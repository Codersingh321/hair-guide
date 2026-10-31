import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [isGuest, setIsGuest] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setIsGuest(false);
      // Someone opened a password reset link from their email
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp(email, password, consentData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_18_plus: consentData.is18,
          consented_at: new Date().toISOString(),
          privacy_version: "v1",
        },
      },
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsGuest(false);
  }

  // Sends a password reset email. The link opens the login page.
  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  }

  // Sets a new password for the person who opened the reset link.
  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    setRecovering(false);
  }

  // Permanently deletes the account, profile, and all tracker entries.
  async function deleteAccount() {
    const { error } = await supabase.rpc("delete_my_account");
    if (error) throw error;
    await supabase.auth.signOut({ scope: "local" });
    setIsGuest(false);
  }

  function continueAsGuest() {
    setIsGuest(true);
  }

  const value = {
    user,
    isGuest,
    recovering,
    isLoading: user === undefined,
    isLoggedIn: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    deleteAccount,
    continueAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}