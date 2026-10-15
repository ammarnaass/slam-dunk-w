import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './animes-screen.styles';

interface AnimeCatalogResultsBarProps {
    count: number;
    isGridView: boolean;
    onSetGridView: (isGrid: boolean) => void;
}

export const AnimeCatalogResultsBar: React.FC<AnimeCatalogResultsBarProps> = ({
    count,
    isGridView,
    onSetGridView,
}) => {
    return (
        <View style={styles.resultsBar}>
            <View style={styles.resultsCounterRow}>
                <Text style={styles.resultsTitle}>نتائج الدليل الشامل</Text>
                <View style={styles.counterPill}>
                    <Text style={styles.counterText}>
                        {count} عمل أنمي
                    </Text>
                </View>
            </View>

            <View style={styles.viewModeToggle}>
                <TouchableOpacity
                    style={[styles.viewModeBtn, isGridView && styles.viewModeBtnActive]}
                    onPress={() => onSetGridView(true)}
                    accessibilityLabel="عرض شبكة"
                >
                    <Icon
                        name="grid_view"
                        size={18}
                        color={isGridView ? THEME.colors.onSurface : THEME.colors.onSurfaceVariant}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewModeBtn, !isGridView && styles.viewModeBtnActive]}
                    onPress={() => onSetGridView(false)}
                    accessibilityLabel="عرض قائمة"
                >
                    <Icon
                        name="view_agenda"
                        size={18}
                        color={!isGridView ? THEME.colors.onSurface : THEME.colors.onSurfaceVariant}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
