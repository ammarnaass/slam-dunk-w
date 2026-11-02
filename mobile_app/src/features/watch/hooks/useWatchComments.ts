import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { fetchEpisodeComments, postEpisodeComment } from '../../../services/api';
import { CommentItem } from '../types/watch.types';
import { INITIAL_COMMENTS } from '../constants/watch.constants';

export function useWatchComments(episodeId: string, visible: boolean) {
  const { currentUser } = useAppStore();
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!episodeId || !visible) return;

    let isMounted = true;
    fetchEpisodeComments(episodeId)
      .then((apiComments) => {
        if (!isMounted) return;
        if (apiComments && apiComments.length > 0) {
          const mapped: CommentItem[] = apiComments.map((c: any) => ({
            id: c.id || String(Date.now()),
            userName: c.user?.name || c.userName || 'بطل الأنمي',
            avatar:
              c.user?.avatar ||
              c.avatar ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDwBLTC5yGIznP0iTZmVobozF5AZhsKyizalhORe4cSb2K9AG6_Xi1ABa5HbAYBvew7oOUIcf_pK9yKLgCTOUI6po_Z22DmdqNCBaHayW-ZfE1QQvrM3bwKaupIK9zTpE-7N7X2ER-Ynm-lUQ_TPqZZkhCde_h30-zdne6MWW01MULxumM8U-xGBXQ5sx2JoGUQjf2J7GjEitt9oxk38kLCjLfzupvSyNuUtIcbNGdbyinvpgSi33Df',
            isVip: c.user?.isVip ?? false,
            timeAgo: c.timeAgo || 'مؤخراً',
            content: c.content || '',
            likes: c.likes || 0,
          }));
          setComments(mapped);
        } else {
          setComments(INITIAL_COMMENTS);
        }
      })
      .catch(() => {
        if (isMounted) setComments(INITIAL_COMMENTS);
      });

    return () => {
      isMounted = false;
    };
  }, [episodeId, visible]);

  const handleSendComment = useCallback(async () => {
    if (!newComment.trim() || !episodeId) return;
    const content = newComment.trim();
    setNewComment('');

    const tempId = Date.now().toString();
    const optimisticItem: CommentItem = {
      id: tempId,
      userName: currentUser?.name || 'عمار الناصري',
      avatar:
        currentUser?.avatar ||
        'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
      isVip: currentUser?.isVip ?? true,
      timeAgo: 'الآن',
      content,
      likes: 0,
    };
    setComments((prev) => [optimisticItem, ...prev]);

    try {
      const res = await postEpisodeComment(episodeId, content);
      if (res?.id) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: res.id } : c))
        );
      }
    } catch (_) {}
  }, [newComment, episodeId, currentUser]);

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const liked = !c.isLiked;
          return {
            ...c,
            isLiked: liked,
            likes: liked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  }, []);

  return {
    comments,
    newComment,
    setNewComment,
    handleSendComment,
    handleToggleLike,
  };
}
