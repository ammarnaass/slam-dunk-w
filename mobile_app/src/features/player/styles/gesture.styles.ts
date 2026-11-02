import { StyleSheet } from 'react-native';

export const gestureStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill as object,
    zIndex: 200,
  },
  brightnessDimmer: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: '#000000',
  },
  feedbackPill: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 20,
    gap: 12,
  },
  gaugeTrack: {
    width: 90,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 3,
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 38,
    textAlign: 'center',
  },
  seekPill: {
    position: 'absolute',
    top: '42%',
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 20,
  },
  seekDeltaText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  seekTimeText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '500',
  },
  rippleContainer: {
    position: 'absolute',
    top: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleLeft: {
    left: '12%',
  },
  rippleRight: {
    right: '12%',
  },
  rippleBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.35)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FF6B00',
  },
  rippleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
