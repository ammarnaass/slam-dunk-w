/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock API service to resolve synchronously in test environment
jest.mock('../src/services/api', () => ({
  fetchAppConfig: jest.fn().mockResolvedValue(null),
  fetchHomeData: jest.fn().mockResolvedValue({ slider: [], latest: [] }),
  fetchEpisodes: jest.fn().mockResolvedValue([]),
  fetchCharacters: jest.fn().mockResolvedValue([]),
  fetchAnimes: jest.fn().mockResolvedValue([]),
  loginUser: jest.fn().mockResolvedValue({ user: null, error: null }),
  setAuthToken: jest.fn(),
  getAuthToken: jest.fn().mockReturnValue(null),
  fetchUserProfile: jest.fn().mockResolvedValue(null),
  recordWatchHistory: jest.fn(),
  API_BASE_URL: 'https://slam-dunk-w.vercel.app',
  setApiBaseUrl: jest.fn(),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
