jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

import { useAppStore } from '../src/store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      currentTab: 'home',
      loading: false,
      selectedEpisode: null,
      selectedAnime: null,
      watchModalVisible: false,
      devBypassCode: '',
      isBypassed: false,
    });
  });

  it('initializes with default home tab', () => {
    const state = useAppStore.getState();
    expect(state.currentTab).toBe('home');
    expect(state.watchModalVisible).toBe(false);
  });

  it('updates current tab via setCurrentTab and handleTabChange', () => {
    useAppStore.getState().setCurrentTab('animes');
    expect(useAppStore.getState().currentTab).toBe('animes');

    useAppStore.getState().handleTabChange('episodes');
    expect(useAppStore.getState().currentTab).toBe('episodes');
  });

  it('opens watch modal when episode is pressed', () => {
    const dummyEpisode = {
      id: 'ep-1',
      animeId: 'slam-dunk',
      title: 'الحلقة الأولى',
      episodeNumber: 1,
    };

    useAppStore.getState().handleEpisodePress(dummyEpisode);

    expect(useAppStore.getState().selectedEpisode).toEqual(dummyEpisode);
    expect(useAppStore.getState().watchModalVisible).toBe(true);
  });

  it('toggles dev bypass mode correctly', () => {
    useAppStore.getState().setDevBypassCode('TEST_CODE');
    useAppStore.getState().setIsBypassed(true);

    expect(useAppStore.getState().devBypassCode).toBe('TEST_CODE');
    expect(useAppStore.getState().isBypassed).toBe(true);
  });

  it('manages plans in state correctly', () => {
    const samplePlans = [
      { id: 'p1', name: 'باقة VIP', price: 9.99, duration: '30', isActive: true, features: ['مشاهدة بدقة 4K', 'بدون إعلانات'] },
    ];
    useAppStore.getState().setPlans(samplePlans);
    expect(useAppStore.getState().plans).toEqual(samplePlans);
  });
});
