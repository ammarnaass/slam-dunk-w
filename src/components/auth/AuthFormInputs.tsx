import React from "react";
import Link from "next/link";

interface AuthFormInputsProps {
    isLogin: boolean;
    formData: { username: string; email: string; password: string };
    setFormData: React.Dispatch<React.SetStateAction<{ username: string; email: string; password: string }>>;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
    loading: boolean;
}

export const AuthFormInputs: React.FC<AuthFormInputsProps> = ({
    isLogin,
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    loading,
}) => {
    return (
        <div className="space-y-space-md">
            {/* Username or Email */}
            <div>
                <label className="block font-label-md text-label-md text-on-surface mb-space-xs font-bold">
                    {isLogin ? "اسم المستخدم أو البريد الإلكتروني" : "اسم المستخدم"}
                </label>
                <div className="relative flex items-center">
                    <span className="absolute right-space-md text-on-surface-variant material-symbols-outlined pointer-events-none text-xl">
                        person
                    </span>
                    <input
                        type="text"
                        required
                        autoComplete={isLogin ? "username" : "off"}
                        inputMode="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder={isLogin ? "otaku@animedaze.tv أو اسم المستخدم" : "مثال: kaito_otaku"}
                        className="w-full min-h-[48px] bg-surface-container rounded-xl pr-11 pl-space-md py-3 text-base sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    />
                </div>
            </div>

            {/* Email (on Register only) */}
            {!isLogin && (
                <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-space-xs font-bold">
                        البريد الإلكتروني
                    </label>
                    <div className="relative flex items-center">
                        <span className="absolute right-space-md text-on-surface-variant material-symbols-outlined pointer-events-none text-xl">
                            alternate_email
                        </span>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            inputMode="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="otaku@animedaze.tv"
                            className="w-full min-h-[48px] bg-surface-container rounded-xl pr-11 pl-space-md py-3 text-base sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-space-xs">
                    <label className="block font-label-md text-label-md text-on-surface font-bold">
                        كلمة المرور
                    </label>
                    {isLogin && (
                        <Link href="/terms" className="font-label-sm text-label-sm text-primary hover:underline">
                            نسيت كلمة المرور؟
                        </Link>
                    )}
                </div>
                <div className="relative flex items-center">
                    <span className="absolute right-space-md text-on-surface-variant material-symbols-outlined pointer-events-none text-xl">
                        lock
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••••••"
                        className="w-full min-h-[48px] bg-surface-container rounded-xl pr-11 pl-12 py-3 text-base sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        aria-label={showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 group relative flex items-center justify-center gap-space-sm bg-primary-container hover:brightness-110 text-on-primary-container py-space-md px-space-lg rounded-xl font-headline-sm text-headline-sm shadow-[0_0_24px_rgba(220,38,38,0.45)] active:scale-95 transition-all cursor-pointer font-bold"
            >
                <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
                    {isLogin ? "login" : "person_add"}
                </span>
                <span>
                    {loading ? "جاري المعالجة..." : (isLogin ? "تسجيل الدخول إلى الحساب" : "إنشاء حساب أوتاكو جديد")}
                </span>
            </button>
        </div>
    );
};
