/**
 * AuthContext — wired to real backend API.
 *
 * Zero UI changes: same context shape as before.
 * Implementation change only: login/register/logout now call real endpoints.
 * Tokens stored via tokenStorage (localStorage), 15-min access + 7-day refresh.
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
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone?: string;
    }) => Promise<{ message: string }>;
    logout: () => Promise<void>;
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
                // Token invalid or expired — the interceptor handles refresh.
                // If it fails again, clear and treat as logged out.
                tokenStorage.clear();
                dispatch({ type: 'LOGOUT' });
            }
        };
        restoreSession();
    }, []);

    // ─── Login ────────────────────────────────────────────────────────────────

    const login = useCallback(async (email: string, password: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            const { user, accessToken, refreshToken } = data.data;
            tokenStorage.setTokens(accessToken, refreshToken);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (err: any) {
            dispatch({ type: 'SET_LOADING', payload: false });
            const message = err?.response?.data?.message || 'Login failed. Please try again.';
            throw new Error(message);
        }
    }, []);

    // ─── Register ─────────────────────────────────────────────────────────────

    const register = useCallback(
        async (data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string;
        }) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const { data: res } = await api.post('/auth/register', data);
                dispatch({ type: 'SET_LOADING', payload: false });
                // Registration does NOT log user in — they must verify email first
                return { message: res.message };
            } catch (err: any) {
                dispatch({ type: 'SET_LOADING', payload: false });
                const message = err?.response?.data?.message || 'Registration failed. Please try again.';
                throw new Error(message);
            }
        },
        []
    );

    // ─── Logout ───────────────────────────────────────────────────────────────

    const logout = useCallback(async () => {
        const refreshToken = tokenStorage.getRefresh();
        try {
            // Best-effort: revoke refresh token on server
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
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
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
