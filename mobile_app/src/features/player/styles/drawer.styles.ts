import { StyleSheet } from 'react-native';

export const drawerStyles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFill as object,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 1200,
    elevation: 40,
  },
  backdrop: {
    flex: 1,
  },
  drawerContent: {
    width: 290,
    height: '100%',
    backgroundColor: '#0F172A',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 40,
    paddingBottom: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  drawerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  listContainer: {
    padding: 12,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  episodeItemActive: {
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    borderColor: '#FF6B00',
  },
  episodeTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  episodeTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  episodeTitleActive: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  episodeDuration: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'right',
  },
  episodeNumberBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: '#FF6B00',
  },
  episodeNumberText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
});
