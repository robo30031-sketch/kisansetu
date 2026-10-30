import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Profile } from '../types';

export interface AuthState {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
}

const LOCAL_STORAGE_KEY_USER = 'kisansetu_sandbox_user';
const LOCAL_STORAGE_KEY_PROFILE = 'kisansetu_sandbox_profile';

const DEFAULT_SANDBOX_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'ramesh.farmer@kisansetu.in',
};

const DEFAULT_SANDBOX_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Ramesh Patel',
  preferred_language: 'hi',
  state_code: 'MP',
  district_name: 'Hoshangabad',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const getStoredSandboxProfile = (): Profile => {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (item) return JSON.parse(item);
  } catch (e) {
    console.error('Error reading sandbox profile', e);
  }
  return DEFAULT_SANDBOX_PROFILE;
};

export const saveStoredSandboxProfile = (profile: Profile): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error writing sandbox profile', e);
  }
};
