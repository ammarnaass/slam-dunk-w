import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ServerOption } from '../types/watch.types';
import { serversStyles } from '../styles/servers.styles';

interface WatchServerCardProps {
  server: ServerOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const WatchServerCard: React.FC<WatchServerCardProps> = ({
  server,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        serversStyles.serverPill,
        isSelected
          ? serversStyles.serverPillActive
          : serversStyles.serverPillNormal,
      ]}
      onPress={() => onSelect(server.id)}
      activeOpacity={0.7}
    >
      {isSelected && <View style={serversStyles.serverDotActive} />}
      <Text
        style={[
          serversStyles.serverName,
          isSelected && serversStyles.serverNameActive,
        ]}
        numberOfLines={1}
      >
        {server.name}
      </Text>
      <Text
        style={[
          serversStyles.serverDesc,
          isSelected && serversStyles.serverDescActive,
        ]}
      >
        {server.ping || server.desc}
      </Text>
    </TouchableOpacity>
  );
};
