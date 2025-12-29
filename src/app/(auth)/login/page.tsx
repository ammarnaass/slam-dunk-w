import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center p-4">
            <AuthForm type="login" />
        </div>
    );
}
