import React from 'react';
import { View, Text } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './animes-screen.styles';

export const AnimeCatalogEmptyState: React.FC = () => {
    return (
        <View style={styles.emptyContainer}>
            <Icon name="search" size={48} color={THEME.colors.outlineVariant} />
            <Text style={styles.emptyTitle}>لم يتم العثور على نتائج</Text>
            <Text style={styles.emptySubtitle}>
                جرب البحث بكلمة مختلفة أو اختر تصنيفاً آخر من القائمة
            </Text>
        </View>
    );
};
