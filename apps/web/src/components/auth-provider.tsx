"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { readableError } from "@/lib/auth-errors";
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  error: string;
}>({ user: null, loading: true, error: "" });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    async function initialize() {
      const supabase = getSupabase();
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
      const { data: validated, error } = await supabase.auth.getUser();
      if (!active) return;
      setUser(validated.user);
      if (error && error.name !== "AuthSessionMissingError")
        setError(readableError(error));
      setLoading(false);
    }
    void initialize().catch((error) => {
      if (active) {
        setError(readableError(error));
        setLoading(false);
      }
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
