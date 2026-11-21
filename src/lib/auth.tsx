import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { User } from './types';

interface OrgInfo {
  id: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  org: OrgInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, company: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function initialsFromName(name: string): string {
  return name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || 'U';
}

function mapUser(su: SupabaseUser, profile: { full_name: string | null; avatar_initials: string | null } | null, org: OrgInfo | null): User {
  const metaName = (su.user_metadata?.full_name as string) || profile?.full_name || '';
  const name = metaName || su.email?.split('@')[0] || 'User';
  return {
    id: su.id,
    name,
    email: su.email ?? '',
    role: org?.role ?? 'Owner',
    company: org?.name ?? 'Your Workspace',
    avatarInitials: profile?.avatar_initials || initialsFromName(name),
  };
}

async function loadProfileAndOrg(userId: string): Promise<{ profile: { full_name: string | null; avatar_initials: string | null } | null; org: OrgInfo | null }> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_initials')
    .eq('id', userId)
    .maybeSingle();

  const { data: memberships } = await supabase
    .from('org_members')
    .select('role, organizations(id, name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1);

  let org: OrgInfo | null = null;
  if (memberships && memberships.length > 0) {
    const m = memberships[0] as unknown as { role: string; organizations: { id: string; name: string } | null };
    if (m.organizations) {
      org = { id: m.organizations.id, name: m.organizations.name, role: m.role };
    }
  }
  return { profile, org };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (!data.session) {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setUser(null);
        setOrg(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    (async () => {
      const { profile, org: orgInfo } = await loadProfileAndOrg(session.user.id);
      if (!mounted) return;
      setOrg(orgInfo);
      setUser(mapUser(session.user, profile, orgInfo));
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [session]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string, company: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, company } },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign-up failed. Please try again.' };

    // Wait briefly for the auth user to be available, then bootstrap the org
    await new Promise((r) => setTimeout(r, 400));

    const { error: bootError } = await supabase.rpc('bootstrap_organization', {
      org_name: company || `${name}'s Workspace`,
      full_name: name,
    });
    if (bootError) {
      // The user was created but org bootstrap failed — they can retry later.
      return { error: `Account created, but workspace setup failed: ${bootError.message}. Please sign in to retry.` };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrg(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        org,
        isAuthenticated: !!session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
