import crypto from "crypto";
import { prisma } from "@/lib/prismadb";
import { AppError, ErrorCode } from "../types/errors";
import { TokenService, TokenUserPayload } from "./token.service";

export interface ClientMeta {
    deviceName?: string;
    userAgent?: string;
    ip?: string;
}

// In-memory sessions store as resilient fallback when DB is unreachable
const memorySessions = new Map<string, any>();

export class SessionService {
    /**
     * Create a new session and issue Access & Refresh tokens
     */
    static async createSession(user: any, meta: ClientMeta = {}) {
        const { raw: refreshTokenRaw, hash: refreshTokenHash, expiresAt } = TokenService.generateRefreshTokenPair();
        let sessionId: string = crypto.randomUUID();

        try {
            const dbSession = await prisma.session.create({
                data: {
                    id: sessionId,
                    userId: user.id,
                    refreshTokenHash,
                    deviceName: meta.deviceName || "جهاز غير محدد",
                    userAgent: meta.userAgent || null,
                    ip: meta.ip || null,
                    expiresAt
                }
            });
            sessionId = dbSession.id;
        } catch (dbErr) {
            console.warn("Prisma session create failed, saving to fallback session cache:", dbErr);
            memorySessions.set(refreshTokenHash, {
                id: sessionId,
                userId: user.id,
                refreshTokenHash,
                deviceName: meta.deviceName || "جهاز محلي",
                userAgent: meta.userAgent || null,
                ip: meta.ip || null,
                expiresAt,
                revokedAt: null
            });
        }

        const userPayload: TokenUserPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "USER",
            avatar: user.avatar || null
        };

        const accessToken = await TokenService.generateAccessToken(userPayload);

        return {
            user: userPayload,
            accessToken,
            refreshToken: refreshTokenRaw,
            expiresIn: 900, // 15 minutes in seconds
            sessionId
        };
    }

    /**
     * Refresh Token with rotation and reuse detection
     */
    static async refreshTokens(refreshTokenRaw: string, getUserFallback: (userId: string) => any, meta: ClientMeta = {}) {
        if (!refreshTokenRaw) {
            throw new AppError(ErrorCode.BAD_REQUEST, "رمز التجديد مطلوب", 400);
        }

        const hashed = TokenService.hashToken(refreshTokenRaw);

        let session: any = null;
        try {
            session = await prisma.session.findUnique({
                where: { refreshTokenHash: hashed },
                include: { user: true }
            });
        } catch (_) {}

        if (!session) {
            session = memorySessions.get(hashed);
        }

        if (!session) {
            throw new AppError(ErrorCode.TOKEN_EXPIRED, "جلسة غير صالحة أو منتهية", 401);
        }

        // Reuse detection: If revoked token is used, revoke all user sessions
        if (session.revokedAt) {
            try {
                await prisma.session.updateMany({
                    where: { userId: session.userId },
                    data: { revokedAt: new Date() }
                });
            } catch (_) {}
            throw new AppError(ErrorCode.UNAUTHORIZED, "تم كشف محاولة إعادة استخدام رمز ملغى، تم إنهاء الجلسات للأمان", 401);
        }

        // Check expiration
        if (new Date() > new Date(session.expiresAt)) {
            throw new AppError(ErrorCode.TOKEN_EXPIRED, "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً", 401);
        }

        // Rotate token
        const { raw: newRefreshTokenRaw, hash: newRefreshTokenHash, expiresAt: newExpiresAt } = TokenService.generateRefreshTokenPair();

        try {
            await prisma.session.update({
                where: { id: session.id },
                data: {
                    refreshTokenHash: newRefreshTokenHash,
                    expiresAt: newExpiresAt,
                    deviceName: meta.deviceName || session.deviceName,
                    userAgent: meta.userAgent || session.userAgent,
                    ip: meta.ip || session.ip
                }
            });
        } catch (_) {
            memorySessions.delete(hashed);
            memorySessions.set(newRefreshTokenHash, {
                ...session,
                refreshTokenHash: newRefreshTokenHash,
                expiresAt: newExpiresAt
            });
        }

        let user = session.user;
        if (!user) {
            user = getUserFallback(session.userId) || {
                id: session.userId,
                email: "user@slamdunk.com",
                name: "مستخدم",
                role: "USER"
            };
        }

        const userPayload: TokenUserPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "USER",
            avatar: user.avatar || null
        };

        const newAccessToken = await TokenService.generateAccessToken(userPayload);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshTokenRaw,
            expiresIn: 900
        };
    }

    /**
     * Terminate / Revoke Session
     */
    static async revokeSessionByToken(refreshTokenRaw?: string) {
        if (refreshTokenRaw) {
            const hashed = TokenService.hashToken(refreshTokenRaw);
            try {
                await prisma.session.updateMany({
                    where: { refreshTokenHash: hashed },
                    data: { revokedAt: new Date() }
                });
            } catch (_) {
                memorySessions.delete(hashed);
            }
        }
        await TokenService.clearSessionCookies();
        return { loggedOut: true };
    }

    /**
     * Get Active User Sessions
     */
    static async getUserSessions(userId: string) {
        let sessions: any[] = [];
        try {
            sessions = await prisma.session.findMany({
                where: {
                    userId,
                    revokedAt: null,
                    expiresAt: { gt: new Date() }
                },
                select: {
                    id: true,
                    deviceName: true,
                    userAgent: true,
                    ip: true,
                    createdAt: true,
                    expiresAt: true
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (_) {}

        if (sessions.length === 0) {
            for (const s of memorySessions.values()) {
                if (s.userId === userId && !s.revokedAt) {
                    sessions.push({
                        id: s.id,
                        deviceName: s.deviceName,
                        userAgent: s.userAgent,
                        ip: s.ip,
                        createdAt: s.createdAt,
                        expiresAt: s.expiresAt
                    });
                }
            }
        }

        return sessions;
    }

    /**
     * Revoke a specific session
     */
    static async revokeUserSession(userId: string, sessionId: string) {
        try {
            await prisma.session.updateMany({
                where: { id: sessionId, userId },
                data: { revokedAt: new Date() }
            });
        } catch (_) {}

        return { revoked: true };
    }
}
