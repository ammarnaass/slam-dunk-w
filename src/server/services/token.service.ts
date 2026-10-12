import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AppError, ErrorCode } from "../types/errors";

export const JWT_SECRET = process.env.JWT_SECRET || "slam-dunk-secret-key-123";
export const JWT_KEY = new TextEncoder().encode(JWT_SECRET);
export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_DAYS = 30;

export interface TokenUserPayload {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string | null;
}

export class TokenService {
    /**
     * Compute SHA-256 hash of a raw token for secure database storage
     */
    static hashToken(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    /**
     * Generate standard Access Token (15m lifespan)
     */
    static async generateAccessToken(payload: TokenUserPayload): Promise<string> {
        return await new SignJWT({ user: payload })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(ACCESS_TOKEN_TTL)
            .sign(JWT_KEY);
    }

    /**
     * Generate raw and hashed refresh token pair with calculated expiration date
     */
    static generateRefreshTokenPair(): { raw: string; hash: string; expiresAt: Date } {
        const raw = crypto.randomBytes(40).toString("hex");
        const hash = this.hashToken(raw);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
        return { raw, hash, expiresAt };
    }

    /**
     * Authenticate incoming request via Bearer Authorization header or session Cookie
     */
    static async authenticateRequest(request: Request): Promise<TokenUserPayload> {
        // 1. Authorization Bearer Token
        const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7).trim();
            try {
                const { payload } = await jwtVerify(token, JWT_KEY, { algorithms: ["HS256"] });
                if (payload && payload.user) {
                    return payload.user as TokenUserPayload;
                }
            } catch (_) {
                throw new AppError(ErrorCode.TOKEN_EXPIRED, "انتهت صلاحية رمز الدخول، يرجى تجديده", 401);
            }
        }

        // 2. Cookie fallback for Web
        try {
            const cookieStore = await cookies();
            const sessionCookie = cookieStore.get("session")?.value;
            if (sessionCookie) {
                const { payload } = await jwtVerify(sessionCookie, JWT_KEY, { algorithms: ["HS256"] });
                if (payload && payload.user) {
                    return payload.user as TokenUserPayload;
                }
            }
        } catch (_) {}

        throw new AppError(ErrorCode.UNAUTHORIZED, "يرجى تسجيل الدخول للمتابعة", 401);
    }

    /**
     * Clear auth cookies on web
     */
    static async clearSessionCookies(): Promise<void> {
        try {
            const cookieStore = await cookies();
            cookieStore.delete("session");
            cookieStore.delete("refreshToken");
        } catch (_) {}
    }
}
