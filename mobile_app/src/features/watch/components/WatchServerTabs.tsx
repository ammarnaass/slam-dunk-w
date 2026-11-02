import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/Icon';
import { ServerCategoryTab } from '../types/watch.types';
import { serversStyles } from '../styles/servers.styles';

interface WatchServerTabsProps {
  activeTab: ServerCategoryTab;
  onSelectTab: (tab: ServerCategoryTab) => void;
}

export const WatchServerTabs: React.FC<WatchServerTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <View style={serversStyles.tabRow}>
      <TouchableOpacity
        style={[
          serversStyles.tabBtn,
          activeTab === 'direct'
            ? serversStyles.tabBtnActive
            : serversStyles.tabBtnInactive,
        ]}
        onPress={() => onSelectTab('direct')}
        activeOpacity={0.7}
      >
        <Icon
          name="bolt"
          size={14}
          color={activeTab === 'direct' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text
          style={
            activeTab === 'direct'
              ? serversStyles.tabTextActive
              : serversStyles.tabTextInactive
          }
        >
          سيرفرات فائقة (Direct)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          serversStyles.tabBtn,
          activeTab === 'embed'
            ? serversStyles.tabBtnActive
            : serversStyles.tabBtnInactive,
        ]}
        onPress={() => onSelectTab('embed')}
        activeOpacity={0.7}
      >
        <Icon
          name="grid_view"
          size={14}
          color={activeTab === 'embed' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text
          style={
            activeTab === 'embed'
              ? serversStyles.tabTextActive
              : serversStyles.tabTextInactive
          }
        >
          سيرفرات مدمجة (Embed)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          serversStyles.tabBtn,
          activeTab === 'download'
            ? serversStyles.tabBtnActive
            : serversStyles.tabBtnInactive,
        ]}
        onPress={() => onSelectTab('download')}
        activeOpacity={0.7}
      >
        <Icon
          name="download"
          size={14}
          color={activeTab === 'download' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text
          style={
            activeTab === 'download'
              ? serversStyles.tabTextActive
              : serversStyles.tabTextInactive
          }
        >
          تحميل (Download)
        </Text>
      </TouchableOpacity>
    </View>
  );
};
