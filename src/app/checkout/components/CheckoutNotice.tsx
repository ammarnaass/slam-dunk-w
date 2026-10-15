import Link from "next/link";

interface CheckoutNoticeProps {
    title: string;
    linkText?: string;
    linkHref?: string;
}

export function CheckoutNotice({
    title,
    linkText = "العودة لصفحة الأسعار",
    linkHref = "/pricing",
}: CheckoutNoticeProps) {
    return (
        <div className="text-center py-20 text-white">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <Link href={linkHref} className="text-red-500 hover:underline">
                {linkText}
            </Link>
        </div>
    );
}
