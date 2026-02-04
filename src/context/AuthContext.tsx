import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

type AuthAction =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" }
    | { type: "HYDRATE"; payload: User | null };

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "radiant-cart-auth";

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload, isAuthenticated: true };
        case "LOGOUT":
            return { user: null, isAuthenticated: false };
        case "HYDRATE":
            return {
                user: action.payload,
                isAuthenticated: action.payload !== null,
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
    });

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                dispatch({ type: "HYDRATE", payload: parsed });
            }
        } catch (error) {
            console.error("Failed to load auth from localStorage:", error);
        }
    }, []);

    // Persist to localStorage on changes
    useEffect(() => {
        try {
            if (state.user) {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user));
            } else {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Failed to save auth to localStorage:", error);
        }
    }, [state.user]);

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock validation - in real app this would hit an API
        if (email && _password.length >= 6) {
            const user: User = {
                id: crypto.randomUUID(),
                name: email.split("@")[0],
                email,
            };
            dispatch({ type: "LOGIN", payload: user });
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock validation
        if (name && email && password.length >= 6) {
            const user: User = {
                id: crypto.randomUUID(),
                name,
                email,
            };
            dispatch({ type: "LOGIN", payload: user });
            return true;
        }
        return false;
    };

    const logout = () => {
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
