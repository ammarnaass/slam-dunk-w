"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

declare global {
    interface Window {
        google: any;
    }
}

interface UseAuthFormProps {
    type: "login" | "register";
}

export function useAuthForm({ type }: UseAuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login: setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const isLogin = type === "login";

    useEffect(() => {
        // Initialize Google Sign-In if library is loaded
        if (window.google) {
            try {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                    callback: handleGoogleResponse,
                });
                const btnEl = document.getElementById("googleSignInDiv");
                if (btnEl) {
                    window.google.accounts.id.renderButton(
                        btnEl,
                        { theme: "filled_black", size: "large", width: "100%", text: "continue_with", shape: "pill" }
                    );
                }
            } catch (e) {
                console.error("Google auth init error", e);
            }
        }
    }, []);

    const handleGoogleResponse = async (response: any) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "فشل تسجيل الدخول بواسطة Google");

            setAuthUser(data);
            if (data.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push(callbackUrl);
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const payload = isLogin
                ? { username: formData.username, password: formData.password }
                : formData;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || (isLogin ? "فشل تسجيل الدخول" : "فشل إنشاء الحساب"));

            if (isLogin) {
                setAuthUser(data);
                if (data.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push(callbackUrl);
                }
            } else {
                setAuthUser(data);
                router.push(callbackUrl);
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        showPassword,
        setShowPassword,
        formData,
        setFormData,
        isLogin,
        handleSubmit,
    };
}
