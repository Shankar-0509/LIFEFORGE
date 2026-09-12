import { supabase } from '@/lib/supabase/client';
import {
  PlayerProfile,
  AttributeState,
  WorldUnlock,
  InventoryItem,
  PlayerState,
} from '@/lib/types';
import { ATTRIBUTES } from '@/lib/game-config';

export async function createPlayerProfile(
  userId: string,
  displayName: string,
  primaryFocus: string,
  startingWorld: string
): Promise<{ data: PlayerProfile | null; error: string | null }> {
  const { data: profile, error: profileError } = await supabase
    .from('player_profiles')
    .insert({
      user_id: userId,
      display_name: displayName,
      primary_focus: primaryFocus,
      starting_world: startingWorld,
      level: 1,
      xp: 0,
      xp_to_next_level: 100,
      essence: 0,
      streak: 0,
      longest_streak: 0,
      onboarding_completed: false,
    })
    .select()
    .single();

  if (profileError) return { data: null, error: profileError.message };

  // Create attribute rows
  const attrRows = ATTRIBUTES.map((attr) => ({
    user_id: userId,
    attribute_type: attr,
    level: 1,
    xp: 0,
    xp_to_next_level: 50,
  }));

  await supabase.from('attributes').insert(attrRows);

  // Create starting world unlock
  await supabase.from('world_unlocks').insert({
    user_id: userId,
    node_id: 'forge',
  });

  return { data: profile, error: null };
}

export async function getPlayerProfile(): Promise<{
  data: PlayerProfile | null;
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getAttributes(): Promise<{
  data: AttributeState[];
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('attributes')
    .select('*')
    .eq('user_id', user.id)
    .order('attribute_type');

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getWorldUnlocks(): Promise<{
  data: WorldUnlock[];
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('world_unlocks')
    .select('*')
    .eq('user_id', user.id)
    .order('unlocked_at');

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getInventory(): Promise<{
  data: InventoryItem[];
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('inventory')
    .select('*, shop_items(*)')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getFullPlayerState(): Promise<{
  data: PlayerState | null;
  error: string | null;
}> {
  const [profileRes, attrRes, unlockRes, invRes] = await Promise.all([
    getPlayerProfile(),
    getAttributes(),
    getWorldUnlocks(),
    getInventory(),
  ]);

  if (profileRes.error || !profileRes.data)
    return { data: null, error: profileRes.error || 'Profile not found' };

  return {
    data: {
      profile: profileRes.data,
      attributes: attrRes.data,
      worldUnlocks: unlockRes.data.map((u) => u.node_id),
      inventory: invRes.data,
    },
    error: null,
  };
}

export async function updateProfile(
  updates: Partial<Pick<PlayerProfile, 'display_name' | 'primary_focus' | 'onboarding_completed'>>
): Promise<{ error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('player_profiles')
    .update(updates)
    .eq('user_id', user.id);

  return { error: error?.message || null };
}
