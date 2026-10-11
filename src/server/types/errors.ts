export const ErrorCode = {
    // 400 Bad Request / Validation
    BAD_REQUEST: "BAD_REQUEST",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INVALID_INPUT: "INVALID_INPUT",

    // 401 Unauthorized
    UNAUTHORIZED: "UNAUTHORIZED",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    INVALID_TOKEN: "INVALID_TOKEN",

    // 403 Forbidden
    FORBIDDEN: "FORBIDDEN",
    ADMIN_REQUIRED: "ADMIN_REQUIRED",
    PREMIUM_REQUIRED: "PREMIUM_REQUIRED",

    // 404 Not Found
    NOT_FOUND: "NOT_FOUND",
    ANIME_NOT_FOUND: "ANIME_NOT_FOUND",
    EPISODE_NOT_FOUND: "EPISODE_NOT_FOUND",
    CHARACTER_NOT_FOUND: "CHARACTER_NOT_FOUND",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    SERVER_NOT_FOUND: "SERVER_NOT_FOUND",

    // 409 Conflict
    CONFLICT: "CONFLICT",
    ALREADY_EXISTS: "ALREADY_EXISTS",

    // 429 Rate Limit
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

    // 500 Internal
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
    EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR"
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(code: string, message: string, statusCode = 400, details?: any) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}
