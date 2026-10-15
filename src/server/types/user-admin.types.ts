export type QuickUserAction =
    | "UPGRADE_30"
    | "UPGRADE_90"
    | "UPGRADE_365"
    | "UPGRADE_LIFETIME"
    | "CANCEL_VIP"
    | "TOGGLE_ROLE";

export interface UserSubscriptionInput {
    type?: string;
    planType?: string;
    status?: string;
    isActive?: boolean;
    endDate?: string | null;
}

export interface UpdateUserAdminDto {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    quickAction?: QuickUserAction | string;
    subscription?: UserSubscriptionInput;
}

export interface SafeAdminUser {
    id: string;
    name?: string | null;
    username?: string;
    email?: string | null;
    role: string;
    avatar?: string | null;
    createdAt?: string | Date;
    subscription?: {
        planType?: string;
        isActive?: boolean;
        endDate?: string | null;
    } | null;
    [key: string]: any;
}
