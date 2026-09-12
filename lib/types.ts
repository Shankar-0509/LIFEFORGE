export type AttributeType = 'mind' | 'body' | 'craft' | 'social' | 'balance';
export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic';
export type QuestStatus = 'active' | 'completed';
export type ShopCategory = 'world_upgrade' | 'cosmetic' | 'boost' | 'artifact';

export interface PlayerProfile {
  id: string;
  user_id: string;
  display_name: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  essence: number;
  streak: number;
  longest_streak: number;
  last_completion_date: string | null;
  onboarding_completed: boolean;
  primary_focus: string;
  starting_world: string;
  created_at: string;
  updated_at: string;
}

export interface AttributeState {
  id: string;
  user_id: string;
  attribute_type: AttributeType;
  level: number;
  xp: number;
  xp_to_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  attribute: AttributeType;
  difficulty: Difficulty;
  xp_reward: number;
  essence_reward: number;
  status: QuestStatus;
  created_at: string;
  completed_at: string | null;
}

export interface XpEvent {
  id: string;
  user_id: string;
  event_type: string;
  attribute: string | null;
  xp_amount: number;
  description: string | null;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: ShopCategory;
  icon: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  shop_item_id: string;
  quantity: number;
  equipped: boolean;
  purchased_at: string;
  shop_items?: ShopItem;
}

export interface WorldUnlock {
  id: string;
  user_id: string;
  node_id: string;
  unlocked_at: string;
}

export interface QuestCompletionResult {
  questId: string;
  completedAt: string;
  xpAwarded: number;
  essenceAwarded: number;
  newTotalXp: number;
  level: number;
  leveledUp: boolean;
  streak: number;
  attributeUpdate: {
    attribute: AttributeType;
    level: number;
    xp: number;
    xpToNextLevel: number;
  };
  worldUnlocks: string[];
}

export interface PurchaseResult {
  success: boolean;
  newEssence: number;
  itemId: string;
  itemName: string;
}

export interface PlayerState {
  profile: PlayerProfile;
  attributes: AttributeState[];
  worldUnlocks: string[];
  inventory: InventoryItem[];
}
