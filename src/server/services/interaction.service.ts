import crypto from "crypto";
import { prisma } from "@/lib/prismadb";
import { AuthService } from "./auth.service";
import { AppError, ErrorCode } from "../types/errors";

const memoryComments = new Map<string, any>();
const memoryReports: any[] = [];
const memoryRatings = new Map<string, any>();

export class InteractionService {
    /**
     * Get comments for an episode with cursor pagination
     */
    static async getEpisodeComments(episodeId: string, cursor?: string, limit = 20) {
        if (!episodeId) {
            throw new AppError(ErrorCode.BAD_REQUEST, "معرف الحلقة مطلوب", 400);
        }

        let comments: any[] = [];

        try {
            comments = await prisma.comment.findMany({
                where: { episodeId },
                orderBy: { createdAt: "desc" },
                take: limit + 1,
                ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
            });
        } catch (_) {
            const list = Array.from(memoryComments.values())
                .filter(c => c.episodeId === episodeId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            
            let startIndex = 0;
            if (cursor) {
                const idx = list.findIndex(c => c.id === cursor);
                if (idx >= 0) startIndex = idx + 1;
            }
            comments = list.slice(startIndex, startIndex + limit + 1);
        }

        let nextCursor: string | null = null;
        if (comments.length > limit) {
            const nextItem = comments.pop();
            nextCursor = nextItem.id;
        }

        return {
            items: comments,
            meta: {
                limit,
                nextCursor
            }
        };
    }

    /**
     * Add a comment to an episode
     */
    static async addComment(userId: string, episodeId: string, content: string) {
        if (!userId) {
            throw new AppError(ErrorCode.UNAUTHORIZED, "يرجى تسجيل الدخول للتعليق", 401);
        }

        const user = await AuthService.getMe(userId);
        const commentId = crypto.randomUUID();

        let comment: any = null;

        try {
            comment = await prisma.comment.create({
                data: {
                    id: commentId,
                    userId,
                    userName: user.name,
                    avatar: user.avatar,
                    episodeId,
                    content
                }
            });
        } catch (dbErr) {
            comment = {
                id: commentId,
                userId,
                userName: user.name,
                avatar: user.avatar,
                episodeId,
                content,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            memoryComments.set(commentId, comment);
        }

        return comment;
    }

    /**
     * Edit a comment
     */
    static async updateComment(userId: string, commentId: string, content: string, isAdmin = false) {
        let comment: any = null;

        try {
            comment = await prisma.comment.findUnique({ where: { id: commentId } });
        } catch (_) {
            comment = memoryComments.get(commentId);
        }

        if (!comment) {
            throw new AppError(ErrorCode.NOT_FOUND, "التعليق غير موجود", 404);
        }

        if (comment.userId !== userId && !isAdmin) {
            throw new AppError(ErrorCode.FORBIDDEN, "لا تملك صلاحية تعديل هذا التعليق", 403);
        }

        try {
            const updated = await prisma.comment.update({
                where: { id: commentId },
                data: { content, updatedAt: new Date() }
            });
            return updated;
        } catch (_) {
            comment.content = content;
            comment.updatedAt = new Date();
            memoryComments.set(commentId, comment);
            return comment;
        }
    }

    /**
     * Delete a comment
     */
    static async deleteComment(userId: string, commentId: string, isAdmin = false) {
        let comment: any = null;

        try {
            comment = await prisma.comment.findUnique({ where: { id: commentId } });
        } catch (_) {
            comment = memoryComments.get(commentId);
        }

        if (!comment) {
            throw new AppError(ErrorCode.NOT_FOUND, "التعليق غير موجود", 404);
        }

        if (comment.userId !== userId && !isAdmin) {
            throw new AppError(ErrorCode.FORBIDDEN, "لا تملك صلاحية حذف هذا التعليق", 403);
        }

        try {
            await prisma.comment.delete({ where: { id: commentId } });
        } catch (_) {
            memoryComments.delete(commentId);
        }

        return { deleted: true };
    }

    /**
     * Rate an episode (1 to 5 stars)
     */
    static async rateEpisode(userId: string, episodeId: string, rating: number) {
        if (!userId) {
            throw new AppError(ErrorCode.UNAUTHORIZED, "يرجى تسجيل الدخول للتقييم", 401);
        }

        let ratingRecord: any = null;

        try {
            ratingRecord = await prisma.episodeRating.upsert({
                where: {
                    userId_episodeId: { userId, episodeId }
                },
                update: { rating },
                create: { userId, episodeId, rating }
            });
        } catch (_) {
            const key = `${userId}:${episodeId}`;
            ratingRecord = { id: key, userId, episodeId, rating, createdAt: new Date() };
            memoryRatings.set(key, ratingRecord);
        }

        return ratingRecord;
    }

    /**
     * Report a broken video link / server
     */
    static async reportLink(userId: string | null, episodeId: string, reason: string, serverId?: string) {
        const reportId = crypto.randomUUID();
        const description = serverId ? `سيرفر [${serverId}]: ${reason}` : reason;

        try {
            await prisma.report.create({
                data: {
                    id: reportId,
                    userId,
                    targetType: "link",
                    targetId: episodeId,
                    reason: description
                }
            });
        } catch (_) {
            memoryReports.push({
                id: reportId,
                userId,
                targetType: "link",
                targetId: episodeId,
                reason: description,
                status: "pending",
                createdAt: new Date()
            });
        }

        return { reported: true, message: "شكراً لك! تم استلام البلاغ وسيتم فحص الرابط فوراً." };
    }

    /**
     * Report an abusive or spam comment
     */
    static async reportComment(userId: string | null, commentId: string, reason: string) {
        const reportId = crypto.randomUUID();

        try {
            await prisma.report.create({
                data: {
                    id: reportId,
                    userId,
                    targetType: "comment",
                    targetId: commentId,
                    reason
                }
            });
        } catch (_) {
            memoryReports.push({
                id: reportId,
                userId,
                targetType: "comment",
                targetId: commentId,
                reason,
                status: "pending",
                createdAt: new Date()
            });
        }

        return { reported: true, message: "تم استلام البلاغ وسيتم مراجعة التعليق من قبل المشرفين." };
    }
}
