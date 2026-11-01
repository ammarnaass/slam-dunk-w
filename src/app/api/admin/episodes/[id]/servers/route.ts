import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";
import { resolveStreamUrl, categorizeServers } from "@/lib/resolvers";

export const dynamic = "force-dynamic";

async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const auth = await verifyAuth(request);
  if (auth && auth.role?.toUpperCase() === "ADMIN") {
    return true;
  }

  const adminKey = request.headers.get("x-admin-key");
  const configuredAdminKey = process.env.ADMIN_API_KEY;
  if (
    configuredAdminKey &&
    configuredAdminKey.length >= 16 &&
    adminKey &&
    adminKey === configuredAdminKey
  ) {
    return true;
  }

  return false;
}

// GET /api/admin/episodes/[id]/servers
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "غير مصرح - صلاحيات المشرف مطلوبة (Unauthorized Admin Access)" },
        { status: 401 }
      );
    }

    const { id: episodeId } = await context.params;

    const servers = await prisma.server.findMany({
      where: { episodeId },
      orderBy: [{ priority: "asc" }, { isWorking: "desc" }],
    });

    const enriched = servers.map((s) => {
      const resolved = resolveStreamUrl(s.url, s.quality || undefined);
      return {
        ...s,
        directUrl: s.directUrl || resolved.directUrl,
        embedUrl: resolved.embedUrl,
        downloadUrl: resolved.downloadUrl,
        provider: s.provider || resolved.provider,
        category: s.category || resolved.category,
        type: s.type || resolved.type,
        matrixCategory: resolved.matrixCategory,
        isDirectPlayable: resolved.isDirectPlayable,
      };
    });

    const classified = categorizeServers(enriched);

    return NextResponse.json({
      success: true,
      servers: enriched,
      watchServers: classified.watchServers,
      downloadServers: classified.downloadServers,
      directServers: classified.directServers,
      backupServers: classified.backupServers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "فشل جلب سيرفرات الحلقة" },
      { status: 500 }
    );
  }
}
