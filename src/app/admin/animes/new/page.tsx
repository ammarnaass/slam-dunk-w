"use client";

import AnimeForm from "@/components/admin/AnimeForm";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NewAnimePage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit">
                <Link href="/admin/animes" className="flex items-center gap-2">
                    <ArrowRight size={20} /> العودة للقائمة
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-white mb-8">إضافة عمل جديد</h1>

            <AnimeForm />
        </div>
    );
}
