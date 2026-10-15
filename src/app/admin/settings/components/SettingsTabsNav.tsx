import { Layers, Film, Sparkles, Palette, SlidersHorizontal, Columns, Smartphone } from "lucide-react";
import { ValidTab } from "../constants/initial-settings";

interface SettingsTabsNavProps {
    activeTab: ValidTab;
    onTabChange: (tab: ValidTab) => void;
}

interface TabItem {
    id: ValidTab;
    label: string;
    icon: React.ElementType;
}

const TABS: TabItem[] = [
    { id: "home", label: "أقسام الصفحة الرئيسية", icon: Layers },
    { id: "slider", label: "السلايدر السينمائي", icon: Film },
    { id: "logo", label: "الشعار والمحاكاة", icon: Sparkles },
    { id: "identity", label: "الهوية والتسمية والألوان", icon: Palette },
    { id: "system", label: "النظام، الصيانة، والإعلانات", icon: SlidersHorizontal },
    { id: "promo", label: "بانر الترويج وتطبيق PWA", icon: Sparkles },
    { id: "footer", label: "الشريط السفلي (Footer)", icon: Columns },
    { id: "app", label: "تطبيق الأندرويد و API", icon: Smartphone },
];

export default function SettingsTabsNav({ activeTab, onTabChange }: SettingsTabsNavProps) {
    return (
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#131317] border border-white/[0.08] max-w-fit flex-wrap">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                            isActive
                                ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                                : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
