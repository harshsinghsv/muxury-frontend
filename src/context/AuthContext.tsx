/**
 * AuthContext — Phone-primary auth system.
 *
 * Flows:
 *  1. Registration: register(phone, name, password, email?) → navigate to /verify-otp?purpose=register&phone=xxx
 *  2. Login:        login(phone, password)                  → navigate to /verify-otp?purpose=login&phone=xxx
 *  3. Verify OTP:   verifyOtp(phone, otp, purpose)          → sets user state → navigate to / or ?next=
 *  4. Resend OTP:   resendOtp(phone)
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import api, { tokenStorage } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextType extends AuthState {
  register: (data: { phone: string; firstName: string; lastName: string; password: string; email?: string }) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string, purpose: 'register' | 'login') => Promise<void>;
  resendOtp: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Guest Session ────────────────────────────────────────────────────────────

const GUEST_SESSION_KEY = 'muxury_guest_session_id';

export function getGuestSessionId(): string | null {
  return localStorage.getItem(GUEST_SESSION_KEY);
}

export function clearGuestSession(): void {
  localStorage.removeItem(GUEST_SESSION_KEY);
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session from stored access token on mount
  useEffect(() => {
    const restore = async () => {
      if (!tokenStorage.getAccess()) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        dispatch({ type: 'SET_USER', payload: data.data.user });
      } catch {
        tokenStorage.clear();
        dispatch({ type: 'LOGOUT' });
      }
    };
    restore();
  }, []);

  // ─── Register ───────────────────────────────────────────────────────────────

  const register = useCallback(async (data: {
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
    email?: string;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const guestSessionId = getGuestSessionId();
      await api.post('/auth/register', {
        ...data,
        ...(guestSessionId && { guestSessionId }),
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      // Caller navigates to /verify-otp?purpose=register&phone=xxx
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const errData = err?.response?.data;
      let message = errData?.message || 'Registration failed. Please try again.';
      if (errData?.errors?.length) {
        message = errData.errors.map((e: any) => e.message).join(' ');
      }
      throw new Error(message);
    }
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (phone: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.post('/auth/login', { phone, password });
      dispatch({ type: 'SET_LOADING', payload: false });
      // Caller navigates to /verify-otp?purpose=login&phone=xxx
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = err?.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(message);
    }
  }, []);

  // ─── Verify OTP ─────────────────────────────────────────────────────────────

  const verifyOtp = useCallback(async (phone: string, otp: string, purpose: 'register' | 'login') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const guestSessionId = getGuestSessionId();
      const { data } = await api.post('/auth/verify-otp', {
        phone,
        otp,
        purpose,
        ...(guestSessionId && { guestSessionId }),
      });
      const { user, accessToken, refreshToken } = data.data;
      tokenStorage.setTokens(accessToken, refreshToken);
      clearGuestSession();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error(err?.response?.data?.message || 'Verification failed. Please try again.');
    }
  }, []);

  // ─── Resend OTP ─────────────────────────────────────────────────────────────

  const resendOtp = useCallback(async (phone: string) => {
    try {
      await api.post('/auth/resend-otp', { phone });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Failed to resend OTP.');
    }
  }, []);

  // ─── Logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefresh();
    try {
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore errors
    } finally {
      tokenStorage.clear();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, register, login, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
