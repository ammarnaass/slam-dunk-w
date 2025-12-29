import { NextResponse } from "next/server";
import { getAnimes } from "@/lib/db";

export async function GET() {
    // Public endpoint, no auth required
    const animes = getAnimes();
    // Maybe filter out drafts if we had that status
    return NextResponse.json(animes);
}
