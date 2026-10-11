export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    nextCursor?: string | null;
    [key: string]: any;
}

export interface ApiErrorPayload {
    code: string;
    message: string;
    details?: any;
}

export interface ApiSuccessResponse<T = any> {
    ok: true;
    data: T;
    meta?: ApiMeta;
}

export interface ApiErrorResponse {
    ok: false;
    error: ApiErrorPayload;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
