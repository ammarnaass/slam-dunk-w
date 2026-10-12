import { OAuth2Client } from "google-auth-library";
import { AppError, ErrorCode } from "../types/errors";

export interface GoogleUserProfile {
    email: string;
    name: string;
    avatar: string;
    sub?: string;
}

export class OAuthService {
    private static getOAuthClient(): { client: OAuth2Client; clientId: string } {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
        return {
            client: new OAuth2Client(clientId),
            clientId
        };
    }

    /**
     * Verify Google ID token or Credential string and extract verified profile data
     */
    static async verifyGoogleIdToken(idTokenOrCredential: string): Promise<GoogleUserProfile> {
        const { client, clientId } = this.getOAuthClient();

        let payload: any = null;
        try {
            const ticket = await client.verifyIdToken({
                idToken: idTokenOrCredential,
                audience: clientId || undefined,
            });
            payload = ticket.getPayload();
        } catch (e: any) {
            console.error("Google ID Token verification failed:", e);
            throw new AppError(ErrorCode.INVALID_TOKEN, "رمز Google غير صالح أو منتهي الصلاحية", 400);
        }

        if (!payload || !payload.email) {
            throw new AppError(ErrorCode.INVALID_TOKEN, "فشل استرداد البريد الإلكتروني من Google", 400);
        }

        const email = payload.email.toLowerCase().trim();
        const name = payload.name || email.split("@")[0];
        const avatar = payload.picture || "/logoep.jpg";

        return {
            email,
            name,
            avatar,
            sub: payload.sub
        };
    }
}
