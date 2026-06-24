"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type DemoUser = {
  name: string;
  email: string;
  role: "customer" | "admin";
};

type AuthContextValue = {
  user: DemoUser | null;
  ready: boolean;
  signIn: (email: string, role?: DemoUser["role"]) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "car-care-demo-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored) as DemoUser);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signIn: (email, role = "customer") => {
        const nextUser = {
          email,
          role,
          name: role === "admin" ? "Admin" : email.split("@")[0],
        } as DemoUser;
        setUser(nextUser);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      },
      signOut: () => {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
