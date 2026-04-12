/**
 * AuthContext — MOCK MODE (client demo)
 *
 * Auto-logs in with MOCK_USER so the site works without a backend.
 * To restore real API:
 *   1. Remove the MOCK_MODE block below.
 *   2. Uncomment the real restoreSession / login / register / logout calls.
 */

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from 'react';
import api, { tokenStorage } from '../lib/api';
import { MOCK_USER } from '@/data/mock';

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

    // ─── MOCK_MODE: auto-login with demo user ────────────────────────────────
    useEffect(() => {
        dispatch({ type: 'SET_USER', payload: MOCK_USER });
    }, []);
    // ─── REAL API (restore when backend is connected) ─────────────────────────
    // useEffect(() => {
    //     const restoreSession = async () => {
    //         const token = tokenStorage.getAccess();
    //         if (!token) { dispatch({ type: 'SET_LOADING', payload: false }); return; }
    //         try {
    //             const { data } = await api.get('/auth/me');
    //             dispatch({ type: 'SET_USER', payload: data.data.user });
    //         } catch {
    //             tokenStorage.clear();
    //             dispatch({ type: 'LOGOUT' });
    //         }
    //     };
    //     restoreSession();
    // }, []);

    // ─── Login ────────────────────────────────────────────────────────────────

    const login = useCallback(async (_email: string, _password: string) => {
        // MOCK_MODE: accept any credentials
        dispatch({ type: 'SET_USER', payload: MOCK_USER });
        // REAL API:
        // dispatch({ type: 'SET_LOADING', payload: true });
        // try {
        //     const { data } = await api.post('/auth/login', { email: _email, password: _password });
        //     const { user, accessToken, refreshToken } = data.data;
        //     tokenStorage.setTokens(accessToken, refreshToken);
        //     dispatch({ type: 'SET_USER', payload: user });
        // } catch (err: any) {
        //     dispatch({ type: 'SET_LOADING', payload: false });
        //     throw new Error(err?.response?.data?.message || 'Login failed.');
        // }
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
            // MOCK_MODE: auto-register and log in
            const mockNewUser = { ...MOCK_USER, firstName: data.firstName, lastName: data.lastName, email: data.email };
            dispatch({ type: 'SET_USER', payload: mockNewUser });
            return { message: 'Account created successfully.' };
            // REAL API:
            // dispatch({ type: 'SET_LOADING', payload: true });
            // try {
            //     const { data: res } = await api.post('/auth/register', data);
            //     dispatch({ type: 'SET_LOADING', payload: false });
            //     if (res.data?.accessToken && res.data?.user) {
            //         tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken);
            //         dispatch({ type: 'SET_USER', payload: res.data.user });
            //     }
            //     return { message: res.message };
            // } catch (err: any) {
            //     dispatch({ type: 'SET_LOADING', payload: false });
            //     throw new Error(err?.response?.data?.message || 'Registration failed.');
            // }
        },
        []
    );

    // ─── Logout ───────────────────────────────────────────────────────────────

    const logout = useCallback(async () => {
        // MOCK_MODE: just dispatch logout
        dispatch({ type: 'LOGOUT' });
        // REAL API:
        // const refreshToken = tokenStorage.getRefresh();
        // try { if (refreshToken) await api.post('/auth/logout', { refreshToken }); } catch {}
        // finally { tokenStorage.clear(); dispatch({ type: 'LOGOUT' }); }
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
