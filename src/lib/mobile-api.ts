import { NextResponse } from "next/server";

export type MobileResponse<T> = {
    success: boolean;
    data: T | null;
    error: string | null;
    message?: string;
};

export function mobileResponse<T>(
    data: T | null,
    success: boolean = true,
    error: string | null = null,
    status: number = 200,
    message?: string
) {
    return NextResponse.json(
        {
            success,
            data,
            error,
            message,
        } as MobileResponse<T>,
        { status }
    );
}

export function mobileError(message: string, status: number = 400) {
    return mobileResponse(null, false, message, status);
}

export function mobileSuccess<T>(data: T, message?: string) {
    return mobileResponse(data, true, null, 200, message);
}
