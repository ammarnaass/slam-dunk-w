import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { User, Episode } from "@/types";

const usersFilePath = path.join(process.cwd(), "src/data/users.json");

export function getUsers(): User[] {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const jsonData = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(jsonData);
}

export function saveUsers(users: User[]) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

// Plans Helpers
const plansFilePath = path.join(process.cwd(), "src/data/plans.json");

export interface Plan {
    id: string;
    name: string;
    price: number;
    duration: number; // in days
    features: string[];
    isPopular: boolean;
    active: boolean;
}

export function getPlans(): Plan[] {
    if (!fs.existsSync(plansFilePath)) {
        return [];
    }
    const jsonData = fs.readFileSync(plansFilePath, "utf8");
    return JSON.parse(jsonData);
}

export function savePlans(plans: Plan[]) {
    fs.writeFileSync(plansFilePath, JSON.stringify(plans, null, 2));
}

// Payment Methods Helpers
const paymentMethodsFilePath = path.join(process.cwd(), "src/data/payment-methods.json");

export interface PaymentMethod {
    id: string;
    name: string;
    type: "card" | "manual";
    instructions: string;
    logoUrl?: string; // Optional URL for logo
    active: boolean;
}

export function getPaymentMethods(): PaymentMethod[] {
    if (!fs.existsSync(paymentMethodsFilePath)) {
        return [];
    }
    const jsonData = fs.readFileSync(paymentMethodsFilePath, "utf8");
    return JSON.parse(jsonData);
}

export function savePaymentMethods(methods: PaymentMethod[]) {
    fs.writeFileSync(paymentMethodsFilePath, JSON.stringify(methods, null, 2));
}

// Anime Helpers
import { Anime, Settings } from "@/types";
const animesFilePath = path.join(process.cwd(), "src/data/animes.json");

export function getAnimes(): Anime[] {
    if (!fs.existsSync(animesFilePath)) {
        return [];
    }
    const jsonData = fs.readFileSync(animesFilePath, "utf8");
    return JSON.parse(jsonData);
}

export function saveAnimes(animes: Anime[]) {
    fs.writeFileSync(animesFilePath, JSON.stringify(animes, null, 2));
}

// Episode Helpers
const episodesFilePath = path.join(process.cwd(), "src/data/episodes.json");

export function getEpisodes(): Episode[] {
    if (!fs.existsSync(episodesFilePath)) {
        return [];
    }
    const jsonData = fs.readFileSync(episodesFilePath, "utf8");
    return JSON.parse(jsonData);
}

export function saveEpisodes(episodes: Episode[]) {
    fs.writeFileSync(episodesFilePath, JSON.stringify(episodes, null, 2));
}

export function getAnimeById(id: string): Anime | null {
    const animes = getAnimes();
    return animes.find(a => a.id === id) || null;
}

export function getEpisodeById(id: string): Episode | null {
    const episodes = getEpisodes();
    return episodes.find(e => e.id === id) || null;
}
// Settings
export function getSettings(): Settings {
    const filePath = path.join(process.cwd(), "src/data/settings.json");
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveSettings(settings: Settings) {
    const filePath = path.join(process.cwd(), "src/data/settings.json");
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}
