import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";
import {
  resolveStreamUrl,
  testServerLatency,
  categorizeServers,
} from "@/lib/resolvers";
import { z } from "zod";

export const dynamic = "force-dynamic";

const batchServerItemSchema = z.object({
  url: z.string().url("رابط السيرفر غير صالح"),
  name: z.string().optional(),
  quality: z.string().optional().default("1080p FHD"),
  category: z.enum(["streaming", "download", "both"]).optional(),
  priority: z.number().int().min(1).optional(),
  pingCheck: z.boolean().optional().default(false),
});

const batchServerBodySchema = z.object({
  servers: z.array(batchServerItemSchema).min(1, "يجب إرسال سيرفر واحد على الأقل"),
  replaceExisting: z.boolean().optional().default(false),
});

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

// POST /api/admin/episodes/[id]/servers/batch - إضافة مصفوفة سيرفرات متعددة دفعة واحدة (Anime Slayer Style)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: episodeId } = await context.params;

    // Strict Admin Auth Check (No hardcoded credentials, no dev bypasses)
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "غير مصرح - صلاحيات المشرف مطلوبة (Unauthorized Admin Access)" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const parsed = batchServerBodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: (parsed.error as any).issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "بيانات السيرفرات غير صالحة",
        },
        { status: 400 }
      );
    }

    const { servers: inputServers, replaceExisting } = parsed.data;

    // Verify episode exists
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode) {
      return NextResponse.json(
        { success: false, error: "الحلقة المحددة غير موجودة" },
        { status: 404 }
      );
    }

    if (replaceExisting) {
      await prisma.server.deleteMany({
        where: { episodeId },
      });
    }

    const createdServers = [];
    let priorityTracker = 1;

    for (const item of inputServers) {
      const resolved = resolveStreamUrl(item.url, item.quality);

      let latencyMs: number | null = null;
      let isWorking = true;

      if (item.pingCheck) {
        const pingResult = await testServerLatency(resolved.directUrl || item.url, 3000);
        latencyMs = pingResult.latencyMs;
        isWorking = pingResult.isWorking;
      }

      const serverRecord = await prisma.server.create({
        data: {
          episodeId,
          name: item.name || resolved.defaultName,
          url: item.url.trim(),
          directUrl: resolved.directUrl,
          provider: resolved.provider,
          category: item.category || resolved.category,
          type: resolved.type,
          quality: item.quality || resolved.quality,
          priority: item.priority !== undefined ? item.priority : priorityTracker++,
          isWorking,
          latencyMs,
          lastCheckedAt: new Date(),
          supportedQualities: resolved.supportedQualities,
        },
      });

      createdServers.push({
        ...serverRecord,
        embedUrl: resolved.embedUrl,
        downloadUrl: resolved.downloadUrl,
        matrixCategory: resolved.matrixCategory,
        isDirectPlayable: resolved.isDirectPlayable,
      });
    }

    const classified = categorizeServers(createdServers);

    return NextResponse.json(
      {
        success: true,
        message: `تمت إضافة وتصنيف وحل روابط ${createdServers.length} سيرفرات بنجاح بمحرك البث المباشر (Anime Slayer Grade)`,
        totalAdded: createdServers.length,
        servers: createdServers,
        watchServers: classified.watchServers,
        downloadServers: classified.downloadServers,
        directServers: classified.directServers,
        backupServers: classified.backupServers,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Batch Server Ingestion Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء معالجة وإضافة مصفوفة السيرفرات",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/episodes/[id]/servers/batch - جلب وتصنيف سيرفرات الحلقة
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
