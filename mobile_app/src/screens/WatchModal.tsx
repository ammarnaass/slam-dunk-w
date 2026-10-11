import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Share,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Episode } from '../types';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { recordWatchHistory } from '../services/api';

interface WatchModalProps {
  visible: boolean;
  episode: Episode | null;
  onClose: () => void;
  onNextEpisode?: () => void;
}

interface CommentItem {
  id: string;
  userName: string;
  avatar: string;
  isVip: boolean;
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    userName: 'طارق الأسطورة',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwBLTC5yGIznP0iTZmVobozF5AZhsKyizalhORe4cSb2K9AG6_Xi1ABa5HbAYBvew7oOUIcf_pK9yKLgCTOUI6po_Z22DmdqNCBaHayW-ZfE1QQvrM3bwKaupIK9zTpE-7N7X2ER-Ynm-lUQ_TPqZZkhCde_h30-zdne6MWW01MULxumM8U-xGBXQ5sx2JoGUQjf2J7GjEitt9oxk38kLCjLfzupvSyNuUtIcbNGdbyinvpgSi33Df',
    isVip: true,
    timeAgo: 'منذ 15 دقيقة • سيرفر الصقر',
    content:
      'أداء حسان في هذه اللحظة بالذات يثبت أنه ليس مجرد مبتدئ! صوت مؤدي الدبلجة في الصرخة الأخيرة أعاد ذكريات الطفولة بقوة لا توصف 🔥🏀',
    likes: 42,
  },
  {
    id: 'c2',
    userName: 'ريم الفهد',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2OsPY2ToyKhKhG8D7ZbaPaYG4D2T7Dv0eEXKU3A0Ex693Ig-zjdxb2-kAf90bXglPiQlYDdhMXDvxjjKfgX10ul-iA3cSikJLgAgolwUszccm1ogl6-3MTkYANxItcjCS9NyTi31FmLKohMg3PhkypD_iLmkAqt0JXaq2biKgLszhuySi5lposOauX3idEdWwQieSxF94qbpkarNk2rQM6Q_BboqvG0Sk9nXxNPmJ6mX9PRQxFDxv',
    isVip: false,
    timeAgo: 'منذ 42 دقيقة',
    content:
      'تمريرة فادي الأخيرة لا يمكن أن تصدق، التكتيك في الشوط الثاني يثبت عبقرية المدرب غسان وسعد تحت السلة!',
    likes: 18,
  },
];

const SERVERS = [
  { id: 's1', name: 'الصقر السريع 1', desc: 'الأسرع للـ 4K' },
  { id: 's2', name: 'الفهد المباشر 2', desc: 'سلس ومستقر' },
  { id: 's3', name: 'سيرفر بديل 3', desc: 'طوارئ احتياطي' },
];

export const WatchModal: React.FC<WatchModalProps> = ({
  visible,
  episode,
  onClose,
  onNextEpisode,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedServer, setSelectedServer] = useState('s1');
  const [audioTrack, setAudioTrack] = useState<'dub' | 'sub'>('dub');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');

  if (!episode) return null;

  const epNum = episode.episode_number || episode.episodeNumber || 47;
  const nextEpNum = epNum + 1;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `أشاهد الحلقة ${epNum} من سلام دانك على ANIME DAZE: https://slam-dunk-w.vercel.app`,
      });
    } catch (_) {}
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    const item: CommentItem = {
      id: Date.now().toString(),
      userName: 'عمار الناصري',
      avatar:
        'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
      isVip: true,
      timeAgo: 'الآن',
      content: newComment.trim(),
      likes: 0,
    };
    setComments([item, ...comments]);
    setNewComment('');
  };

  const handleToggleLike = (id: string) => {
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
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* 1. Modal Header */}
        <View style={styles.header}>
          <View style={styles.headerLeading}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={onClose}
              accessibilityLabel="إغلاق"
            >
              <Icon name="arrow_forward" size={24} color={THEME.colors.onSurface} />
            </TouchableOpacity>
            <View style={styles.headerProfileRow}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
                }}
                style={styles.headerAvatar}
              />
              <Text style={styles.headerTitle} numberOfLines={1}>
                مشغل الفيديو السينمائي
              </Text>
            </View>
          </View>

          <View style={styles.headerTrailing}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleShare}
              accessibilityLabel="مشاركة"
            >
              <Icon name="share" size={22} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => setIsBookmarked(!isBookmarked)}
              accessibilityLabel="حفظ"
            >
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark_border'}
                size={22}
                color={
                  isBookmarked
                    ? THEME.colors.primaryContainer
                    : THEME.colors.onSurfaceVariant
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. Embedded Cinematic Video Player (16:9) */}
          <View style={styles.playerFrame}>
            <Image
              source={{
                uri:
                  episode.thumbnail ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMPVNR4ix76vzObnfVl-_p9CUq0Lh9p40E21mNoEN8WXID79OT4iIDMlpJq-OwOOshargraXFmTOJ5GDo0DinsBgvSWKsos0klNKgwvyCVkVyQ5MmQzQPlhTy8X6x74nNjEl80PxCHj7zRirprKdR3QtSaRaNEXQHNtoGRAtEv1eiiA5YjiQ4OqN_XIIKPua84NEE0peAb1K3swIuKif5EqdRHWEiAAkUkUhZuYxvXX7LBRKSvJ4iH',
              }}
              style={styles.playerPoster}
              resizeMode="cover"
            />
            {/* Scrim Gradient */}
            <View style={styles.playerScrim} />

            {/* Top Live Badges */}
            <View style={styles.playerTopBar}>
              <View style={styles.liveIndicatorRow}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>بث فائق الدقة</Text>
                </View>
                <View style={styles.qualityTag}>
                  <Text style={styles.qualityTagText}>1080p FHD</Text>
                </View>
              </View>

              <View style={styles.playerSettingsBtn}>
                <Icon name="settings" size={18} color={THEME.colors.onSurface} />
              </View>
            </View>

            {/* Center Play/Pause Trigger */}
            <TouchableOpacity
              style={styles.centerPlayBtn}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.9}
            >
              <Icon
                name={isPlaying ? 'pause' : 'play_arrow'}
                size={30}
                color={THEME.colors.onPrimaryContainer}
                filled
              />
            </TouchableOpacity>

            {/* Bottom Controls Bar */}
            <View style={styles.playerBottomControls}>
              {/* Progress Bar */}
              <View style={styles.playerProgressBar}>
                <View style={[styles.playerProgressFill, { width: '61%' }]} />
              </View>

              {/* Controls Row */}
              <View style={styles.controlsRow}>
                <View style={styles.controlsLeft}>
                  <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                    <Icon
                      name={isPlaying ? 'pause' : 'play_arrow'}
                      size={20}
                      color={THEME.colors.onSurface}
                      filled
                    />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Icon name="replay_10" size={18} color={THEME.colors.onSurfaceVariant} />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Icon name="forward_10" size={18} color={THEME.colors.onSurfaceVariant} />
                  </TouchableOpacity>

                  <Text style={styles.timerText}>
                    14:32 <Text style={styles.timerSlash}>/</Text> 23:45
                  </Text>
                </View>

                <View style={styles.controlsRight}>
                  <Icon name="volume_up" size={18} color={THEME.colors.onSurfaceVariant} />
                  <Icon name="fullscreen" size={18} color={THEME.colors.onSurface} />
                </View>
              </View>
            </View>
          </View>

          {/* 3. Streaming Servers Preference Panel */}
          <View style={styles.serversPanel}>
            <View style={styles.serversPanelHeader}>
              <View style={styles.serversTitleRow}>
                <Icon name="dns" size={18} color={THEME.colors.primaryContainer} />
                <Text style={styles.serversTitle}>اختر سيرفر البث المباشر</Text>
              </View>
              <TouchableOpacity
                style={styles.reportRow}
                onPress={() =>
                  Alert.alert('تم استلام البلاغ', 'شكراً لمساعدتنا، سيتم فحص السيرفر فوراً!')
                }
              >
                <Icon name="flag" size={14} color={THEME.colors.onSurfaceVariant} />
                <Text style={styles.reportText}>إبلاغ عن رابط معطل</Text>
              </TouchableOpacity>
            </View>

            {/* 3 Server Pills */}
            <View style={styles.serverPillsRow}>
              {SERVERS.map((s) => {
                const isSelected = selectedServer === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.serverPill,
                      isSelected ? styles.serverPillActive : styles.serverPillNormal,
                    ]}
                    onPress={() => setSelectedServer(s.id)}
                    activeOpacity={0.8}
                  >
                    {isSelected && <View style={styles.serverDotActive} />}
                    <Text
                      style={[
                        styles.serverName,
                        isSelected && styles.serverNameActive,
                      ]}
                      numberOfLines={1}
                    >
                      {s.name}
                    </Text>
                    <Text
                      style={[
                        styles.serverDesc,
                        isSelected && styles.serverDescActive,
                      ]}
                    >
                      {s.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Audio Track Switcher */}
            <View style={styles.audioSwitchRow}>
              <View style={styles.audioSwitchLabel}>
                <Icon name="translate" size={18} color={THEME.colors.secondary} />
                <Text style={styles.audioLabelText}>المسار الصوتي والترجمة</Text>
              </View>

              <View style={styles.audioToggleCapsule}>
                <TouchableOpacity
                  style={[
                    styles.audioToggleBtn,
                    audioTrack === 'dub' && styles.audioToggleBtnActive,
                  ]}
                  onPress={() => setAudioTrack('dub')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.audioToggleText,
                      audioTrack === 'dub' && styles.audioToggleTextActive,
                    ]}
                  >
                    الدبلجة الكلاسيكية
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.audioToggleBtn,
                    audioTrack === 'sub' && styles.audioToggleBtnActive,
                  ]}
                  onPress={() => setAudioTrack('sub')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.audioToggleText,
                      audioTrack === 'sub' && styles.audioToggleTextActive,
                    ]}
                  >
                    الياباني المترجم
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 4. Episode Info & Quick Actions */}
          <View style={styles.episodeInfoPanel}>
            <View style={styles.infoTagsRow}>
              <View style={styles.seasonTag}>
                <Text style={styles.seasonTagText}>موسم 1</Text>
              </View>
              <View style={styles.genreTag}>
                <Text style={styles.genreTagText}>رياضي • شونين</Text>
              </View>
              <View style={styles.ratingTag}>
                <Icon name="star" size={14} color={THEME.colors.secondary} filled />
                <Text style={styles.ratingTagText}>9.6</Text>
              </View>
            </View>

            <Text style={styles.epMainTitle}>
              سلام دانك - الحلقة {epNum}: {episode.title || 'العزيمة النارية في الشوط الحاسم'}
            </Text>

            <Text style={styles.epSynopsis}>
              {episode.description ||
                'يشتعل التنافس بين الصقور والخصم اللدود مع بقاء دقيقتين فقط على صافرة النهاية؛ يتأهب حسان لتحقيق الارتداد التاريخي الحاسم تحت السلة وسط حماس الجماهير الملتهب.'}
            </Text>

            {/* Quick Actions Row */}
            <View style={styles.actionsBar}>
              {/* Next Episode CTA */}
              <TouchableOpacity
                style={styles.nextEpBtn}
                onPress={() => {
                  if (onNextEpisode) onNextEpisode();
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.nextEpText}>الحلقة التالية ({nextEpNum})</Text>
                <Icon name="arrow_forward" size={18} color={THEME.colors.onPrimaryContainer} />
              </TouchableOpacity>

              {/* Download */}
              <TouchableOpacity
                style={styles.downloadActionBtn}
                onPress={() =>
                  Alert.alert('بدء التنزيل', `جاري تنزيل الحلقة ${epNum} بجودة 1080p`)
                }
                activeOpacity={0.8}
              >
                <Icon name="download" size={18} color={THEME.colors.onSurface} />
                <Text style={styles.downloadActionText}>تحميل</Text>
              </TouchableOpacity>

              {/* Share */}
              <TouchableOpacity
                style={styles.shareActionBtn}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Icon name="share" size={18} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Visual Divider */}
          <View style={styles.sectionDivider} />

          {/* 5. Fan Discussions & Comments */}
          <View style={styles.discussionsPanel}>
            <View style={styles.discussionsHeader}>
              <View style={styles.discussionsTitleRow}>
                <Icon name="forum" size={20} color={THEME.colors.primaryContainer} />
                <Text style={styles.discussionsTitle}>نقاشات المعجبين</Text>
                <View style={styles.commentsCountPill}>
                  <Text style={styles.commentsCountText}>{comments.length + 182} تعليق</Text>
                </View>
              </View>

              <View style={styles.latestSorter}>
                <Text style={styles.latestSorterText}>الأحدث أولاً</Text>
                <Icon name="swap_vert" size={14} color={THEME.colors.onSurfaceVariant} />
              </View>
            </View>

            {/* Input Box */}
            <View style={styles.commentInputBox}>
              <View style={styles.inputAvatar}>
                <Icon name="person" size={18} color={THEME.colors.onSurfaceVariant} />
              </View>
              <View style={styles.inputFormArea}>
                <TextInput
                  style={styles.commentTextInput}
                  placeholder={`اكتب تعليقك حول الحلقة ${epNum} وحماس اللقاء...`}
                  placeholderTextColor="rgba(223, 226, 238, 0.45)"
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <View style={styles.inputBottomRow}>
                  <View style={styles.emojiRow}>
                    <TouchableOpacity>
                      <Icon name="sentiment_satisfied" size={18} color={THEME.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.sendCommentBtn}
                    onPress={handleSendComment}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sendCommentText}>نشر</Text>
                    <Icon name="arrow_forward" size={14} color={THEME.colors.onPrimaryContainer} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Comments Stream */}
            <View style={styles.commentsStream}>
              {comments.map((c) => (
                <View key={c.id} style={styles.commentCard}>
                  <View style={styles.commentTop}>
                    <View style={styles.commentAuthorRow}>
                      <Image source={{ uri: c.avatar }} style={styles.authorAvatar} />
                      <View>
                        <View style={styles.authorNameRow}>
                          <Text style={styles.authorName}>{c.userName}</Text>
                          {c.isVip && (
                            <View style={styles.vipTagPill}>
                              <Text style={styles.vipTagText}>عضو VIP</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.commentTimestamp}>{c.timeAgo}</Text>
                      </View>
                    </View>
                    <Icon name="more_vert" size={18} color={THEME.colors.onSurfaceVariant} />
                  </View>

                  <Text style={styles.commentText}>{c.content}</Text>

                  <View style={styles.commentActions}>
                    <TouchableOpacity
                      style={styles.likeBtn}
                      onPress={() => handleToggleLike(c.id)}
                    >
                      <Icon
                        name="thumb_up"
                        size={15}
                        color={c.isLiked ? THEME.colors.primaryContainer : THEME.colors.onSurfaceVariant}
                      />
                      <Text
                        style={[
                          styles.likeText,
                          c.isLiked && styles.likeTextActive,
                        ]}
                      >
                        {c.likes}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.replyBtn}>
                      <Icon name="reply" size={15} color={THEME.colors.onSurfaceVariant} />
                      <Text style={styles.replyText}>رد</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    height: 64 + STATUSBAR_HEIGHT,
    backgroundColor: THEME.colors.surfaceGlass,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerTitle: {
    ...THEME.typography.headlineSm,
    fontSize: 16,
    color: THEME.colors.onSurface,
  },
  headerTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  playerFrame: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  playerPoster: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  playerScrim: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(10, 14, 22, 0.35)',
  },
  playerTopBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFF',
  },
  liveText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onPrimaryContainer,
  },
  qualityTag: {
    backgroundColor: 'rgba(38, 42, 51, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qualityTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  playerSettingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(38, 42, 51, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primaryContainer,
    marginTop: -28,
    marginLeft: -28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  playerBottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 6,
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
  },
  playerProgressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerProgressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: THEME.colors.primaryContainer,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  controlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  timerSlash: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serversPanel: {
    padding: THEME.spacing.margin,
    backgroundColor: THEME.colors.surfaceContainerLow,
    gap: 12,
  },
  serversPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serversTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  serversTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  serverPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  serverPill: {
    flex: 1,
    padding: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  serverPillActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
  },
  serverPillNormal: {
    backgroundColor: THEME.colors.surfaceContainer,
  },
  serverDotActive: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primaryContainer,
  },
  serverName: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  serverNameActive: {
    color: THEME.colors.onSurface,
  },
  serverDesc: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  serverDescActive: {
    color: THEME.colors.primary,
  },
  audioSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 8,
    borderRadius: THEME.radius.md,
  },
  audioSwitchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioLabelText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  audioToggleCapsule: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceContainerLowest,
    padding: 2,
    borderRadius: 8,
  },
  audioToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  audioToggleBtnActive: {
    backgroundColor: THEME.colors.secondaryContainer,
  },
  audioToggleText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  audioToggleTextActive: {
    color: THEME.colors.onSecondaryContainer,
    fontWeight: '700',
  },
  episodeInfoPanel: {
    padding: THEME.spacing.margin,
    gap: 10,
  },
  infoTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seasonTag: {
    backgroundColor: THEME.colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seasonTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  genreTag: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genreTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 'auto',
  },
  ratingTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  epMainTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    lineHeight: 24,
    textAlign: 'right',
  },
  epSynopsis: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    lineHeight: 20,
    textAlign: 'right',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  nextEpBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 5,
  },
  nextEpText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  downloadActionBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  downloadActionText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  shareActionBtn: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDivider: {
    height: 4,
    backgroundColor: THEME.colors.surfaceContainerLow,
    marginVertical: 4,
  },
  discussionsPanel: {
    padding: THEME.spacing.margin,
    gap: 14,
  },
  discussionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discussionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discussionsTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  commentsCountPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  commentsCountText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  latestSorter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  latestSorterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  commentInputBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 12,
    borderRadius: THEME.radius.xl,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFormArea: {
    flex: 1,
    gap: 8,
  },
  commentTextInput: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: THEME.colors.onSurface,
    ...THEME.typography.bodySm,
    textAlign: 'right',
  },
  inputBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sendCommentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.md,
  },
  sendCommentText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  commentsStream: {
    gap: 10,
  },
  commentCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 14,
    borderRadius: THEME.radius.xl,
    gap: 8,
  },
  commentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  vipTagPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  vipTagText: {
    color: THEME.colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  commentTimestamp: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  commentText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurface,
    lineHeight: 20,
    textAlign: 'right',
    paddingRight: 46,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 46,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  likeTextActive: {
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
});
