import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import { login } from "@/lib/auth";
import { AppError, ErrorCode } from "../types/errors";
import { UpdateProfileDto, UserProfileData } from "../types/profile.types";
import { updateProfileSchema } from "../validators/profile.validator";
import { DEFAULT_PREFERENCES } from "@/lib/profile-presets";

const DATA_DIR = path.join(process.cwd(), "src/data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

interface LocalUserRecord {
    id: string;
    name?: string | null;
    username?: string | null;
    email: string;
    password?: string;
    role?: string;
    avatar?: string | null;
    profileImage?: string | null;
    bannerImage?: string | null;
    bio?: string | null;
    otakuTitle?: string | null;
    auraColor?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    birthDate?: string | null;
    createdAt?: string;
    watchlist?: string[];
    preferences?: any;
    subscription?: any;
}

function loadLocalUsers(): LocalUserRecord[] {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        }
    } catch (_) {}
    return [];
}

function saveLocalUser(user: Partial<LocalUserRecord> & { id: string }) {
    try {
        const users = loadLocalUsers();
        const index = users.findIndex(u => u.id === user.id || (user.email && u.email?.toLowerCase() === user.email.toLowerCase()));
        if (index >= 0) {
            users[index] = { ...users[index], ...user };
        } else {
            users.push(user as LocalUserRecord);
        }
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to save local user metadata:", e);
    }
}

export class ProfileService {
    /**
     * Get complete user profile with Otaku customizations
     */
    static async getProfile(userId: string): Promise<UserProfileData> {
        let dbUser: any = null;
        try {
            dbUser = await prisma.user.findUnique({
                where: { id: userId },
                include: { subscription: true }
            });
        } catch (dbErr) {
            console.warn("Prisma user.findUnique failed, falling back to local file:", dbErr);
        }

        const localUsers = loadLocalUsers();
        const localUser = localUsers.find(u => u.id === userId || (dbUser && u.email?.toLowerCase() === dbUser.email?.toLowerCase()));

        if (!dbUser && !localUser) {
            throw new AppError(ErrorCode.USER_NOT_FOUND, "المستخدم غير موجود", 404);
        }

        const base = dbUser || localUser;
        const localExt: Partial<LocalUserRecord> = localUser || {};

        const isAdmin = base.name === "admin" ||
            base.email?.toLowerCase() === "admin@slamdunk.com" ||
            base.role?.toUpperCase() === "ADMIN";

        const preferences = localExt.preferences || DEFAULT_PREFERENCES;

        return {
            id: base.id,
            name: base.name || localExt.username || "أوتاكو سبيستون",
            email: base.email,
            role: isAdmin ? "ADMIN" : (base.role || "USER"),
            avatar: base.avatar || localExt.profileImage || "/logoep.jpg",
            bannerImage: localExt.bannerImage || "/hero-bg.jpg",
            bio: localExt.bio || "عاشق للأعمال الكلاسيكية وسبيستون الذهبية 🌟",
            otakuTitle: localExt.otakuTitle || "صقر شوهوكو",
            auraColor: localExt.auraColor || "crimson",
            gender: base.gender || localExt.gender || null,
            phoneNumber: base.phoneNumber || localExt.phoneNumber || null,
            birthDate: base.birthDate ? (typeof base.birthDate === "string" ? base.birthDate : base.birthDate.toISOString()) : (localExt.birthDate || null),
            createdAt: base.createdAt ? (typeof base.createdAt === "string" ? base.createdAt : base.createdAt.toISOString()) : new Date().toISOString(),
            watchlist: base.watchlist || localExt.watchlist || [],
            preferences,
            subscription: base.subscription ? {
                planType: base.subscription.planType,
                isActive: base.subscription.isActive,
                startDate: base.subscription.startDate ? new Date(base.subscription.startDate).toISOString() : null,
                endDate: base.subscription.endDate ? new Date(base.subscription.endDate).toISOString() : null,
            } : {
                planType: isAdmin ? "VIP_FOUNDER" : "FREE",
                isActive: isAdmin,
                startDate: null,
                endDate: null
            }
        };
    }

    /**
     * Update user profile with full Otaku customization & session sync
     */
    static async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserProfileData> {
        // 1. Validate payload
        const validation = updateProfileSchema.safeParse(data);
        if (!validation.success) {
            const firstMsg = validation.error.issues[0]?.message || "بيانات التعديل غير صحيحة";
            throw new AppError(ErrorCode.BAD_REQUEST, firstMsg, 400);
        }

        const validData = validation.data;
        const requestedName = (validData.username || validData.name)?.trim();
        const requestedEmail = validData.email?.toLowerCase().trim();

        // 2. Load existing user
        let currentDbUser: any = null;
        try {
            currentDbUser = await prisma.user.findUnique({
                where: { id: userId }
            });
        } catch (_) {}

        const localUsers = loadLocalUsers();
        let currentLocalUser = localUsers.find(u => u.id === userId || (currentDbUser && u.email?.toLowerCase() === currentDbUser.email?.toLowerCase()));

        if (!currentDbUser && !currentLocalUser) {
            throw new AppError(ErrorCode.USER_NOT_FOUND, "المستخدم غير موجود", 404);
        }

        // 3. Check uniqueness if changing email or name
        if (requestedEmail || requestedName) {
            try {
                const conflictUser = await prisma.user.findFirst({
                    where: {
                        AND: [
                            {
                                OR: [
                                    ...(requestedEmail ? [{ email: requestedEmail }] : []),
                                    ...(requestedName ? [{ name: requestedName }] : [])
                                ]
                            },
                            {
                                NOT: { id: userId }
                            }
                        ]
                    }
                });

                if (conflictUser) {
                    throw new AppError(ErrorCode.ALREADY_EXISTS, "اسم المستخدم أو البريد الإلكتروني مسجل بحساب آخر", 409);
                }
            } catch (err: any) {
                if (err instanceof AppError) throw err;
                // Local check fallback
                const localConflict = localUsers.find(u =>
                    u.id !== userId &&
                    ((requestedEmail && u.email?.toLowerCase() === requestedEmail) ||
                     (requestedName && (u.name === requestedName || u.username === requestedName)))
                );
                if (localConflict) {
                    throw new AppError(ErrorCode.ALREADY_EXISTS, "اسم المستخدم أو البريد الإلكتروني مسجل بحساب آخر", 409);
                }
            }
        }

        // 4. Handle password change if requested
        const targetPassword = validData.newPassword || validData.password;
        let newHashedPassword: string | undefined = undefined;

        if (targetPassword && targetPassword.trim().length > 0) {
            if (targetPassword.trim().length < 6) {
                throw new AppError(ErrorCode.BAD_REQUEST, "كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف", 400);
            }

            const existingPasswordHash = currentDbUser?.password || currentLocalUser?.password;

            // If user already has a password and provided currentPassword, verify it
            if (existingPasswordHash && validData.currentPassword) {
                const isMatch = await bcrypt.compare(validData.currentPassword, existingPasswordHash);
                if (!isMatch && validData.currentPassword !== existingPasswordHash) {
                    throw new AppError(ErrorCode.INVALID_CREDENTIALS, "كلمة المرور الحالية غير صحيحة", 401);
                }
            }

            newHashedPassword = await bcrypt.hash(targetPassword.trim(), 10);
        }

        // 5. Prepare Prisma update fields
        const chosenAvatar = validData.avatar || validData.profileImage || currentDbUser?.avatar || currentLocalUser?.avatar;
        const prismaUpdateData: any = {};

        if (requestedName) prismaUpdateData.name = requestedName;
        if (requestedEmail) prismaUpdateData.email = requestedEmail;
        if (chosenAvatar) prismaUpdateData.avatar = chosenAvatar;
        if (validData.gender !== undefined) prismaUpdateData.gender = validData.gender;
        if (validData.phoneNumber !== undefined) prismaUpdateData.phoneNumber = validData.phoneNumber;
        if (validData.birthDate) prismaUpdateData.birthDate = new Date(validData.birthDate);
        if (newHashedPassword) prismaUpdateData.password = newHashedPassword;

        // Execute Prisma update if possible
        try {
            await prisma.user.update({
                where: { id: userId },
                data: prismaUpdateData
            });
        } catch (dbErr) {
            console.warn("Prisma user.update skipped or failed, saving metadata locally:", dbErr);
        }

        // 6. Update local user record with all Otaku customizations
        const mergedPreferences = {
            ...(currentLocalUser?.preferences || DEFAULT_PREFERENCES),
            ...(validData.preferences || {})
        };

        const updatedLocalRecord: Partial<LocalUserRecord> & { id: string } = {
            id: userId,
            email: requestedEmail || currentLocalUser?.email || currentDbUser?.email || "",
            name: requestedName || currentLocalUser?.name || currentDbUser?.name,
            username: requestedName || currentLocalUser?.username || currentDbUser?.name,
            avatar: chosenAvatar,
            profileImage: chosenAvatar,
            bannerImage: validData.bannerImage || currentLocalUser?.bannerImage || "/hero-bg.jpg",
            bio: validData.bio !== undefined ? validData.bio : currentLocalUser?.bio,
            otakuTitle: validData.otakuTitle !== undefined ? validData.otakuTitle : currentLocalUser?.otakuTitle,
            auraColor: validData.auraColor !== undefined ? validData.auraColor : currentLocalUser?.auraColor,
            gender: validData.gender !== undefined ? validData.gender : currentLocalUser?.gender,
            phoneNumber: validData.phoneNumber !== undefined ? validData.phoneNumber : currentLocalUser?.phoneNumber,
            birthDate: validData.birthDate || currentLocalUser?.birthDate,
            preferences: mergedPreferences,
            ...(newHashedPassword ? { password: newHashedPassword } : {})
        };

        saveLocalUser(updatedLocalRecord);

        // 7. Sync session cookie so Navbar & App immediately reflect changes
        const fullProfile = await this.getProfile(userId);

        const sessionUser = {
            id: fullProfile.id,
            name: fullProfile.name,
            email: fullProfile.email,
            role: fullProfile.role,
            avatar: fullProfile.avatar,
            profileImage: fullProfile.avatar
        };

        try {
            await login(sessionUser);
        } catch (cookieErr) {
            console.warn("Failed to automatically refresh session cookie:", cookieErr);
        }

        return fullProfile;
    }
}
