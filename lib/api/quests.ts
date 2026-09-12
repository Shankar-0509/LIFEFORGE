import { supabase } from '@/lib/supabase/client';
import { Quest, QuestCompletionResult, AttributeType, Difficulty } from '@/lib/types';
import { DIFFICULTY_CONFIG } from '@/lib/game-config';

export async function getQuests(status?: 'active' | 'completed'): Promise<{
  data: Quest[];
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  let query = supabase.from('quests').select('*').eq('user_id', user.id);
  if (status) query = query.eq('status', status);
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function createQuest(input: {
  title: string;
  description?: string;
  attribute: AttributeType;
  difficulty: Difficulty;
}): Promise<{ data: Quest | null; error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const diffConfig = DIFFICULTY_CONFIG[input.difficulty];

  const { data, error } = await supabase
    .from('quests')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description || null,
      attribute: input.attribute,
      difficulty: input.difficulty,
      xp_reward: diffConfig.xp,
      essence_reward: diffConfig.essence,
      status: 'active',
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateQuest(
  questId: string,
  updates: { title?: string; description?: string; attribute?: AttributeType; difficulty?: Difficulty }
): Promise<{ data: Quest | null; error: string | null }> {
  const updateData: Record<string, unknown> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.attribute !== undefined) updateData.attribute = updates.attribute;
  if (updates.difficulty !== undefined) {
    updateData.difficulty = updates.difficulty;
    const diffConfig = DIFFICULTY_CONFIG[updates.difficulty];
    updateData.xp_reward = diffConfig.xp;
    updateData.essence_reward = diffConfig.essence;
  }

  const { data, error } = await supabase
    .from('quests')
    .update(updateData)
    .eq('id', questId)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteQuest(questId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('quests').delete().eq('id', questId);
  return { error: error?.message || null };
}

export async function completeQuest(questId: string): Promise<{
  data: QuestCompletionResult | null;
  error: string | null;
}> {
  const { data, error } = await supabase.rpc('complete_quest', { p_quest_id: questId });

  if (error) return { data: null, error: error.message };
  return { data: data as QuestCompletionResult, error: null };
}
