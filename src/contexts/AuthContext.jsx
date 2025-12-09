// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // obtener sesión inicial
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setUser(data?.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // listener de cambios de auth (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

	const login = async (email, password) => {
	  const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	  });

	  if (error) {
		return { success: false, error: error.message };
	  }

	  return { success: true, user: data.user, session: data.session };
	};

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔥 IMPORTANTE → ESTE HOOK ES NECESARIO
export function useAuth() {
  return React.useContext(AuthContext);
}

