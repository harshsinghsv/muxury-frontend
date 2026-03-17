/**
 * AuthContext — wired to real backend API.
 *
 * Supports:
 *  - Email + Password login
 *  - Phone + OTP login (2-step)
 *  - Registration with dual verification (email + phone)
 *  - OTP verification, resend OTP, resend email
 *  - Guest session tracking for cart merge
 */

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from 'react';
import api, { tokenStorage } from '../lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
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
    login: (email: string) => Promise<void>;
    loginEmail: (email: string) => Promise<void>;
    loginEmailSendOtp: (email: string) => Promise<void>;
    loginEmailVerifyOtp: (email: string, otp: string) => Promise<void>;
    loginPhoneSendOtp: (phone: string) => Promise<void>;
    loginPhoneVerifyOtp: (phone: string, otp: string) => Promise<void>;
    register: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone: string;
    }) => Promise<{ userId: string; message: string }>;
    verifyPhone: (userId: string, otp: string) => Promise<{ bothVerified: boolean }>;
    resendOtp: (userId: string) => Promise<void>;
    resendEmail: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

// ─── Guest Session Helper ────────────────────────────────────────────────────

const GUEST_SESSION_KEY = 'muxury_guest_session_id';

export function getGuestSessionId(): string | null {
    return localStorage.getItem(GUEST_SESSION_KEY);
}

export function clearGuestSession(): void {
    localStorage.removeItem(GUEST_SESSION_KEY);
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

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

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // On mount: restore session from stored access token
    useEffect(() => {
        const restoreSession = async () => {
            const token = tokenStorage.getAccess();
            if (!token) {
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
        restoreSession();
    }, []);

    // ─── Login — Email + OTP (Step 1: Send OTP) ───────────────────────────

    const loginEmailSendOtp = useCallback(async (email: string) => {
        try {
            await api.post('/auth/login-email/send-otp', { email });
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to send login code.';
            throw new Error(message);
        }
    }, []);

    // Backward compat aliases
    const loginEmail = loginEmailSendOtp;
    const login = loginEmailSendOtp;

    // ─── Login — Email + OTP (Step 2: Verify OTP) ─────────────────────────

    const loginEmailVerifyOtp = useCallback(async (email: string, otp: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { data } = await api.post('/auth/login-email/verify-otp', { email, otp });
            const { user, accessToken, refreshToken } = data.data;
            tokenStorage.setTokens(accessToken, refreshToken);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (err: any) {
            dispatch({ type: 'SET_LOADING', payload: false });
            throw new Error(err?.response?.data?.message || 'OTP verification failed.');
        }
    }, []);

    // ─── Login — Phone + OTP (Step 1) ─────────────────────────────────────────

    const loginPhoneSendOtp = useCallback(async (phone: string) => {
        try {
            await api.post('/auth/login-phone/send-otp', { phone });
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to send OTP.';
            throw new Error(message);
        }
    }, []);

    // ─── Login — Phone + OTP (Step 2) ─────────────────────────────────────────

    const loginPhoneVerifyOtp = useCallback(async (phone: string, otp: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { data } = await api.post('/auth/login-phone/verify-otp', { phone, otp });
            const { user, accessToken, refreshToken } = data.data;
            tokenStorage.setTokens(accessToken, refreshToken);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (err: any) {
            dispatch({ type: 'SET_LOADING', payload: false });
            throw new Error(err?.response?.data?.message || 'OTP verification failed.');
        }
    }, []);

    // ─── Register ─────────────────────────────────────────────────────────────

    const register = useCallback(
        async (data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone: string;
        }) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const guestSessionId = getGuestSessionId();
                const { data: res } = await api.post('/auth/register', {
                    ...data,
                    ...(guestSessionId && { guestSessionId }),
                });
                dispatch({ type: 'SET_LOADING', payload: false });
                return { userId: res.data.userId, message: res.message };
            } catch (err: any) {
                dispatch({ type: 'SET_LOADING', payload: false });
                let message = err?.response?.data?.message || 'Registration failed. Please try again.';

                // Format detailed validation errors if they exist
                if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                    message = err.response.data.errors.map((e: any) => e.message).join(' | ');
                }

                throw new Error(message);
            }
        },
        []
    );

    // ─── Verify Phone OTP ─────────────────────────────────────────────────────

    const verifyPhone = useCallback(async (userId: string, otp: string) => {
        try {
            const guestSessionId = getGuestSessionId();
            const { data } = await api.post('/auth/verify-phone', {
                userId,
                otp,
                ...(guestSessionId && { guestSessionId }),
            });

            const { bothVerified } = data.data;

            // If both verified, clear guest session
            if (bothVerified) {
                clearGuestSession();
            }

            return { bothVerified };
        } catch (err: any) {
            throw new Error(err?.response?.data?.message || 'OTP verification failed.');
        }
    }, []);

    // ─── Resend Phone OTP ─────────────────────────────────────────────────────

    const resendOtp = useCallback(async (userId: string) => {
        try {
            await api.post('/auth/resend-phone-otp', { userId });
        } catch (err: any) {
            throw new Error(err?.response?.data?.message || 'Failed to resend OTP.');
        }
    }, []);

    // ─── Resend Email Verification ────────────────────────────────────────────

    const resendEmail = useCallback(async (email: string) => {
        try {
            await api.post('/auth/resend-email', { email });
        } catch (err: any) {
            throw new Error(err?.response?.data?.message || 'Failed to resend email.');
        }
    }, []);

    // ─── Logout ───────────────────────────────────────────────────────────────

    const logout = useCallback(async () => {
        const refreshToken = tokenStorage.getRefresh();
        try {
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch {
            // Ignore errors; clear tokens regardless
        } finally {
            tokenStorage.clear();
            dispatch({ type: 'LOGOUT' });
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            loginEmail,
            loginEmailSendOtp,
            loginEmailVerifyOtp,
            loginPhoneSendOtp,
            loginPhoneVerifyOtp,
            register,
            verifyPhone,
            resendOtp,
            resendEmail,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
