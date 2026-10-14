import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { Character } from '../../types';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './characters.styles';

interface CharacterDetailModalProps {
  character: Character | null;
  onClose: () => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
}) => {
  if (!character) return null;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="إغلاق البطاقة"
          >
            <Icon name="close" size={18} color={THEME.colors.onSurface} />
          </TouchableOpacity>

          <View style={styles.modalAvatarLargeWrap}>
            <Image
              source={{
                uri:
                  character.image ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuARaixDwClMBk8VjPmR1Q2rUIzdPzwaLu2UN88LAaneAT68-Dt1lyWDu-0gkKtii62D2siPahcfHX4SFVz3C3ign3Ab0TRwZXQSb7CIPBeuWZDXQrKYufhHb07FXgObV8byTeeQEjhmD0JGOHPuJ6crdhM7akhITM1MepDnWa_wDBnvnNco4IYOGt659sF1WSCFyKDMcDNWPrC9fEF1R_xhCvvamv9DhG2ws40iHFKDLtDpbhs8NwJP',
              }}
              style={styles.modalAvatarLarge}
              resizeMode="cover"
            />
            {character.number ? (
              <View style={styles.modalJerseyLarge}>
                <Text style={styles.modalJerseyLargeText}>
                  #{character.number}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.modalName}>
            {character.name_ar || character.name}
          </Text>
          {character.name_en ? (
            <Text style={styles.modalEnName}>{character.name_en}</Text>
          ) : null}

          <View style={styles.modalBadgesRow}>
            <View style={styles.modalTeamPill}>
              <Text style={styles.modalTeamPillText}>
                {character.team || (character.animeId === 'conan' ? 'المحقق كونان' : 'سلام دانك')}
              </Text>
            </View>
            <View style={styles.modalPosPill}>
              <Text style={styles.modalPosPillText}>
                {character.position || character.role || 'شخصية رئيسية'}
              </Text>
            </View>
          </View>

          <Text style={styles.modalRole}>
            {character.role || 'شخصية رئيسية'}
          </Text>

          {(character.voiceActorJa || character.voiceActorAr) && (
            <View style={{ flexDirection: 'row', gap: 12, marginVertical: 6, justifyContent: 'center' }}>
              {character.voiceActorJa && (
                <Text style={{ fontSize: 11, color: THEME.colors.primaryContainer, fontWeight: 'bold' }}>
                  🇯🇵 {character.voiceActorJa}
                </Text>
              )}
              {character.voiceActorAr && (
                <Text style={{ fontSize: 11, color: '#f59e0b', fontWeight: 'bold' }}>
                  🎙️ {character.voiceActorAr}
                </Text>
              )}
            </View>
          )}

          <Text style={styles.modalDesc}>
            {character.description ||
              'إحدى أبرز الشخصيات في عالم الأنمي، تتميز بالروح والشجاعة والمهارة الاستثنائية.'}
          </Text>

          <TouchableOpacity
            style={styles.modalActionBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.modalActionBtnText}>إغلاق البطاقة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
