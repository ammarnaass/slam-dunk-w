"use client";

import { User as UserIcon, Shield, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { EditUserFormData } from "../hooks/useEditUser";

interface EditUserAccountCardProps {
    formData: EditUserFormData;
    setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
}

export function EditUserAccountCard({
    formData,
    setFormData,
    showPassword,
    setShowPassword,
}: EditUserAccountCardProps) {
    return (
        <div className="space-y-6">
            {/* 1. Basic Info */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <UserIcon size={18} className="text-blue-400" /> المعلومات الأساسية
                </h2>

                <div>
                    <label className="block text-slate-300 text-xs font-bold mb-2">اسم المستخدم / العرض</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-300 text-xs font-bold mb-2">البريد الإلكتروني</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-300 text-xs font-bold mb-2">
                        تغيير كلمة المرور <span className="text-slate-500 font-normal">(اتركه فارغاً للإبقاء عليها)</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-4 pl-11 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                            placeholder="••••••••"
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Role & Permissions Management */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Shield size={18} className="text-rose-400" /> إدارة الصلاحيات (Role)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Regular User Option */}
                    <div 
                        onClick={() => setFormData(prev => ({ ...prev, role: "USER" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.role === "USER"
                                ? "bg-blue-950/30 border-blue-500 text-white shadow-lg shadow-blue-950/40"
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs sm:text-sm text-white">مستخدم عادي (USER)</span>
                            {formData.role === "USER" && <CheckCircle2 size={16} className="text-blue-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            تصفح مكتبة الأنمي، مشاهدة الحلقات، إنشاء قوائم المتابعة والتعليق.
                        </p>
                    </div>

                    {/* Admin Option */}
                    <div 
                        onClick={() => setFormData(prev => ({ ...prev, role: "ADMIN" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.role === "ADMIN"
                                ? "bg-rose-950/30 border-rose-500 text-white shadow-lg shadow-rose-950/40"
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs sm:text-sm text-white">مدير نظام (ADMIN)</span>
                            {formData.role === "ADMIN" && <CheckCircle2 size={16} className="text-rose-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            صلاحيات كاملة للوحة التحكم: إدارة المحتوى، المشتركين، الخطط والإعدادات.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
