'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { PlayerState } from '@/lib/types';
import { getFullPlayerState } from '@/lib/api/player';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  playerState: PlayerState | null;
  playerStateLoading: boolean;
  refreshPlayerState: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  playerState: null,
  playerStateLoading: false,
  refreshPlayerState: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [playerStateLoading, setPlayerStateLoading] = useState(false);

  const refreshPlayerState = useCallback(async () => {
    setPlayerStateLoading(true);
    const { data, error } = await getFullPlayerState();
    if (!error && data) {
      setPlayerState(data);
    }
    setPlayerStateLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        setPlayerState(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && !playerState) {
      refreshPlayerState();
    }
    if (!user) {
      setPlayerState(null);
    }
  }, [user, playerState, refreshPlayerState]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setPlayerState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        playerState,
        playerStateLoading,
        refreshPlayerState,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
