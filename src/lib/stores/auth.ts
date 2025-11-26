import { browser } from '$app/environment';
import { PUBLIC_PREVIEW_TOKEN_HASH } from '$env/static/public';
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

/* -------------------------------------------------------
 * Local storage
 * -----------------------------------------------------*/
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
  } catch (err) {
    console.warn('[preview-auth] Failed to parse stored state', err);
    return defaultState;
  }
};

const persistState = (state: AuthState) => {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

/* -------------------------------------------------------
 * Hashing utilities
 * -----------------------------------------------------*/
const toHex = (bytes: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const hashToken = async (token: string): Promise<string> => {
  if (!token) return '';

  // Browser: SubtleCrypto
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return toHex(digest);
  }

  // SSR fallback
  try {
    const { createHash } = await import('crypto');
    return createHash('sha256').update(token).digest('hex');
  } catch (err) {
    console.warn('[preview-auth] Failed to hash token', err);
    return '';
  }
};

/* -------------------------------------------------------
 * Expected hash (only hash — no plaintext allowed)
 * SUPPORTS:
 *  - fc5e03...
 *  - sha256:fc5e03...
 * -----------------------------------------------------*/
let rawHash = (PUBLIC_PREVIEW_TOKEN_HASH || '').trim().toLowerCase();

if (rawHash.startsWith('sha256:')) {
  rawHash = rawHash.slice('sha256:'.length);
}

export const EXPECTED_HASH = rawHash || null;

if (!EXPECTED_HASH) {
  console.warn('[preview-auth] Missing PUBLIC_PREVIEW_TOKEN_HASH. Login will always fail.');
}

/* -------------------------------------------------------
 * Expiry (1 hour)
 * -----------------------------------------------------*/
const isExpired = (timestamp: number) => {
  const MAX_AGE = 1000 * 60 * 60; // 1 hour
  return Date.now() - timestamp > MAX_AGE;
};

/* -------------------------------------------------------
 * Auth Store
 * -----------------------------------------------------*/
function createAuthStore() {
  const { subscribe, set } = writable<AuthState>(defaultState);

  const clearState = () => {
    set(defaultState);
    if (browser) localStorage.removeItem(STORAGE_KEY);
  };

  const hydrate = () => {
    if (!EXPECTED_HASH) return clearState();

    const stored = readStoredState();
    if (
      stored.isLoggedIn &&
      stored.tokenHash === EXPECTED_HASH &&
      !isExpired(stored.loggedAt)
    ) {
      set(stored);
    } else {
      clearState();
    }
  };

  const login = async (token: string) => {
    if (!EXPECTED_HASH) return false;

    const trimmed = token.trim();
    if (!trimmed) return false;

    const providedHash = await hashToken(trimmed);

    if (providedHash !== EXPECTED_HASH) return false;

    const nextState: AuthState = {
      isLoggedIn: true,
      displayName: 'Preview',
      tokenHash: EXPECTED_HASH,
      loggedAt: Date.now(),
    };

    set(nextState);
    persistState(nextState);   // ← 存入 localStorage
    return true;
  };

  const logout = () => {
    clearState();
  };

  hydrate();

  return { subscribe, login, logout };
}

export const authStore = createAuthStore();
