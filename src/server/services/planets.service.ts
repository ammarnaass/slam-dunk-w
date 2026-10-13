import fs from "fs";
import path from "path";
import { 
    AdminPlanetItem, 
    PlanetsSettingsConfig, 
    DEFAULT_ADMIN_PLANETS, 
    DEFAULT_PLANETS_SETTINGS 
} from "@/lib/planets-presets";

const DATA_DIR = path.join(process.cwd(), "src/data");
const PLANETS_FILE = path.join(DATA_DIR, "planets.json");
const PLANETS_SETTINGS_FILE = path.join(DATA_DIR, "planets-settings.json");

export function getStoredPlanets(): AdminPlanetItem[] {
    try {
        if (fs.existsSync(PLANETS_FILE)) {
            const raw = fs.readFileSync(PLANETS_FILE, "utf-8");
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
            }
        }
    } catch (e) {
        console.error("Failed to read planets.json:", e);
    }
    return DEFAULT_ADMIN_PLANETS;
}

export function saveStoredPlanets(planets: AdminPlanetItem[]): void {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(PLANETS_FILE, JSON.stringify(planets, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to write planets.json:", e);
        throw e;
    }
}

export function getStoredPlanetsSettings(): PlanetsSettingsConfig {
    try {
        if (fs.existsSync(PLANETS_SETTINGS_FILE)) {
            const raw = fs.readFileSync(PLANETS_SETTINGS_FILE, "utf-8");
            return { ...DEFAULT_PLANETS_SETTINGS, ...JSON.parse(raw) };
        }
    } catch (e) {
        console.error("Failed to read planets-settings.json:", e);
    }
    return DEFAULT_PLANETS_SETTINGS;
}

export function saveStoredPlanetsSettings(settings: PlanetsSettingsConfig): void {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(PLANETS_SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to write planets-settings.json:", e);
        throw e;
    }
}
