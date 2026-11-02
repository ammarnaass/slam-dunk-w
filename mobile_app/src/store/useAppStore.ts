import { create } from 'zustand';
import { createContentSlice } from './slices/contentSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createUserSlice } from './slices/userSlice';
import { AppState } from './types/store.types';

export * from './types/store.types';

export const useAppStore = create<AppState>()((...a) => ({
  ...createNavigationSlice(...a),
  ...createContentSlice(...a),
  ...createUserSlice(...a),
}));
