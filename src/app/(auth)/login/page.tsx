import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <AuthForm type="login" />
            </Suspense>
        </div>
    );
}
