import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { Episode } from '../../../types';
import { ServerOption, AudioTrackType } from '../types/watch.types';
import { DEFAULT_SERVERS } from '../constants/watch.constants';

export function useWatchServers(episode: Episode | null) {
  const [selectedServer, setSelectedServer] = useState<string>('s1');
  const [audioTrack, setAudioTrack] = useState<AudioTrackType>('dub');

  const episodeServers = useMemo(() => {
    if (!episode) return DEFAULT_SERVERS;

    const rawList =
      episode.watchServers && episode.watchServers.length > 0
        ? episode.watchServers
        : episode.servers && episode.servers.length > 0
        ? episode.servers
        : episode.mega_link
        ? [
            {
              id: 'srv-mega',
              name: 'سيرفر ميجا الخارق',
              url: episode.mega_link,
              quality: '1080p FHD',
            },
          ]
        : DEFAULT_SERVERS;

    return rawList.map((s: any, idx: number): ServerOption => ({
      id: s.id || `srv-${idx}`,
      name: s.name || `سيرفر ${idx + 1}`,
      desc: s.quality || '1080p FHD',
      url: s.directUrl || s.url,
      directUrl: s.directUrl,
      downloadUrl: s.downloadUrl || s.url,
      category: s.category || 'streaming',
      matrixCategory: s.matrixCategory || 'direct',
      provider: s.provider || 'custom',
      ping: s.ping || (idx === 0 ? '18ms' : idx === 1 ? '24ms' : '36ms'),
      isWorking: s.isWorking ?? true,
    }));
  }, [episode]);

  useEffect(() => {
    if (episodeServers.length > 0) {
      setSelectedServer(episodeServers[0].id);
    }
  }, [episodeServers]);

  const activeServer = useMemo(() => {
    return (
      episodeServers.find((s) => s.id === selectedServer) || episodeServers[0]
    );
  }, [episodeServers, selectedServer]);

  const handleAutoFailover = useCallback(() => {
    const nextServer = episodeServers.find(
      (s) => s.id !== selectedServer && s.isWorking !== false
    );
    if (nextServer) {
      setSelectedServer(nextServer.id);
      Alert.alert(
        '🔄 تبديل تلقائي (Zero-Buffering)',
        `تم تحويل البث تلقائياً إلى "${nextServer.name}" لاستمرار المشاهدة دون انقطاع.`
      );
    }
  }, [episodeServers, selectedServer]);

  return {
    episodeServers,
    selectedServer,
    setSelectedServer,
    activeServer,
    audioTrack,
    setAudioTrack,
    handleAutoFailover,
  };
}
