import Link from "next/link";
import { Play } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative h-[600px] w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80")',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-20">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            الأنمي الرياضي #1
                        </span>
                        <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                            101 حلقة كاملة
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        سلام دانك
                    </h1>
                    <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                        ساكوراجي هاناميتشي، طالب جانح ينضم لفريق كرة السلة في مدرسة شوهوكو الثانوية. تابع رحلته من مبتدئ إلى "العبقري" في عالم كرة السلة.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/episodes/1"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-colors"
                        >
                            <Play fill="currentColor" size={20} />
                            ابدأ المشاهدة
                        </Link>
                        <Link
                            href="/characters"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border border-white/20"
                        >
                            تعرف على الشخصيات
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
