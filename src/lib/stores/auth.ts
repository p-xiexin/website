import { browser } from '$app/environment';
import { PUBLIC_PREVIEW_TOKEN } from '$env/static/public';
import { writable } from 'svelte/store';

type AuthState = {
  isLoggedIn: boolean;
  displayName: string;
  tokenHash: string;
  loggedAt: number;
};

const STORAGE_KEY = 'preview-auth';
const defaultState: AuthState = {
  isLoggedIn: false,
  displayName: '',
  tokenHash: '',
  loggedAt: 0,
};

const readStoredState = (): AuthState => {
  if (!browser) return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AuthState;
    return {
      isLoggedIn: Boolean(parsed?.isLoggedIn),
      displayName: parsed?.displayName || '',
      tokenHash: parsed?.tokenHash || '',
      loggedAt: Number(parsed?.loggedAt) || 0,
    };
  } catch (error) {
    console.warn('Failed to read preview auth state', error);
    return defaultState;
  }
};

const persistState = (state: AuthState) => {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const EXPECTED_TOKEN = (PUBLIC_PREVIEW_TOKEN || '').trim();
const getExpectedToken = () => EXPECTED_TOKEN;
const getTokenHash = (token: string) => (token ? btoa(token) : '');
const isExpired = (timestamp: number) => {
  const MAX_AGE_MS = 1000 * 60 * 60 * 1; // 1h session window
  return Date.now() - timestamp > MAX_AGE_MS;
};

function createAuthStore() {
  const { subscribe, set } = writable<AuthState>(defaultState);

  const clearState = () => {
    set(defaultState);
    if (browser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const hydrate = () => {
    const expected = getExpectedToken();
    const expectedHash = getTokenHash(expected);
    if (!expected) {
      clearState();
      return;
    }

    const stored = readStoredState();
    const storedHash = stored.tokenHash || '';

    if (stored.isLoggedIn && storedHash === expectedHash && !isExpired(stored.loggedAt)) {
      set(stored);
    } else {
      clearState();
    }
  };

  const login = (token: string) => {
    const expected = getExpectedToken();
    const expectedHash = getTokenHash(expected);
    const trimmed = token.trim();

    if (!expected) return false;
    if (!trimmed || trimmed !== expected) return false;

    const nextState: AuthState = {
      isLoggedIn: true,
      displayName: 'Preview',
      tokenHash: expectedHash,
      loggedAt: Date.now(),
    };
    set(nextState);
    persistState(nextState);
    return true;
  };

  const logout = () => {
    clearState();
  };

  hydrate();

  return {
    subscribe,
    login,
    logout,
  };
}

export const authStore = createAuthStore();
