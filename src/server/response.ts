import { NextResponse } from "next/server";
import { ApiMeta, ApiSuccessResponse, ApiErrorResponse } from "./types/api";
import { AppError, ErrorCode } from "./types/errors";
import { ZodError } from "zod";

/**
 * Returns a standardized JSON success response.
 * Contract: { ok: true, data: T, meta?: { page, limit, total, nextCursor } }
 */
export function apiSuccess<T>(data: T, meta?: ApiMeta, status = 200) {
    const payload: ApiSuccessResponse<T> = {
        ok: true,
        data,
        ...(meta ? { meta } : {})
    };
    return NextResponse.json(payload, { status });
}

/**
 * Returns a standardized JSON error response.
 * Contract: { ok: false, error: { code: string, message: string, details?: any } }
 */
export function apiError(code: string, message: string, status = 400, details?: any) {
    const payload: ApiErrorResponse = {
        ok: false,
        error: {
            code,
            message,
            details: details ?? null
        }
    };
    return NextResponse.json(payload, { status });
}

/**
 * Centralized error handler for Route Handlers
 */
export function handleRouteError(error: unknown) {
    if (error instanceof AppError) {
        return apiError(error.code, error.message, error.statusCode, error.details);
    }

    if (error instanceof ZodError) {
        return apiError(
            ErrorCode.VALIDATION_ERROR,
            "البيانات المدخلة غير صالحة",
            422,
            error.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            }))
        );
    }

    console.error("Unhandled API Error:", error);

    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع في الخادم";
    return apiError(ErrorCode.INTERNAL_SERVER_ERROR, errorMessage, 500);
}
