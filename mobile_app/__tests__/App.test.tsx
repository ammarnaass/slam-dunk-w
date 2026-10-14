/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.setTimeout(15000);

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
  initAuthToken: jest.fn().mockResolvedValue(null),
  fetchUserProfile: jest.fn().mockResolvedValue(null),
  fetchPlans: jest.fn().mockResolvedValue([]),
  createPlan: jest.fn().mockResolvedValue({ plan: null }),
  API_BASE_URL: 'https://slam-dunk-w.vercel.app',
  setApiBaseUrl: jest.fn(),
}));

jest.mock('../src/navigation/AppNavigator', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    AppNavigator: () => React.createElement(View, { testID: 'mock-app-navigator' }),
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
