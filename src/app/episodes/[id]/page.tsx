import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EpisodePage({ params }: PageProps) {
    const { id } = await params;
    redirect(`/watch/${id}`);
}
