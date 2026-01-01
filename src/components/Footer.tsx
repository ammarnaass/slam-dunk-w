"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react";
import { Settings } from "@/types";

export default function Footer({ settings }: { settings: any }) {

    // Removed client-side fetch, now using DB data passed from Layout

    const social = settings?.socialLinks;

    if (!settings) return null; // Or a simple skeleton

    return (
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-white mb-6 block">
                            {settings.siteName}
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm mb-8">
                            {settings.siteDescription}
                        </p>
                        <div className="flex items-center gap-4">
                            {social?.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Facebook size={20} />
                                </a>
                            )}
                            {social?.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-xl hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Twitter size={20} />
                                </a>
                            )}
                            {social?.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-xl hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {social?.youtube && (
                                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-xl hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Youtube size={20} />
                                </a>
                            )}
                            {social?.telegram && (
                                <a href={social.telegram} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-xl hover:bg-sky-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Send size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">روابط سريعة</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/animes" className="hover:text-red-500 transition-colors">
                                    قائمة الأنمي
                                </Link>
                            </li>
                            <li>
                                <Link href="/characters" className="hover:text-red-500 transition-colors">
                                    الشخصيات
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-red-500 transition-colors">
                                    شروط الاستخدام
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">تواصل معنا</h4>
                        <p className="text-sm">
                            للاقتراحات أو الإبلاغ عن روابط معطلة، يرجى التواصل عبر البريد الإلكتروني.
                        </p>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-900 text-center text-sm">
                    <p>© {new Date().getFullYear()} جميع الحقوق محفوظة..</p>
                </div>
            </div>
        </footer>
    );
}
