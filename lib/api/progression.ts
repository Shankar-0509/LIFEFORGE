import { supabase } from '@/lib/supabase/client';
import { XpEvent } from '@/lib/types';

export async function getXpEvents(limit = 20): Promise<{
  data: XpEvent[];
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('xp_events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}
