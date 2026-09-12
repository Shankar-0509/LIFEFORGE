/*
# Create LIFEFORGE Core Schema

This migration creates the complete database schema for LIFEFORGE, a Life RPG application.

1. New Tables
- `player_profiles`: User game state (display name, level, XP, essence, streak, onboarding completion, primary focus, starting world)
- `attributes`: Five RPG attributes (mind, body, craft, social, balance) with level and XP per attribute
- `quests`: User-created tasks with title, description, attribute, difficulty, status, timestamps
- `xp_events`: Log of all XP awards with event type, attribute, amount, description, timestamp
- `shop_items`: Catalog of purchasable items (name, description, cost, category, icon)
- `inventory`: Owned items with quantity and equipped state
- `world_unlocks`: Unlocked world nodes with unlock timestamp

2. Security
- RLS enabled on all tables
- All tables are owner-scoped (user_id) with DEFAULT auth.uid()
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE) scoped to authenticated users owning their data
- shop_items is shared catalog data: readable by all authenticated, writable only by service role (no anon insert/update/delete policies)

3. Important Notes
- Level/XP/essence/streak are stored on player_profiles and updated server-side via the complete_quest function
- Attribute XP and level are stored in the attributes table
- World unlocks are determined by level thresholds defined in the application config
- The complete_quest function atomically: marks quest complete, awards XP+essence, updates streak, updates attribute, checks level-up, checks world unlocks, logs XP event
*/

-- ============= PLAYER PROFILES =============
CREATE TABLE IF NOT EXISTS player_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  xp integer NOT NULL DEFAULT 0,
  xp_to_next_level integer NOT NULL DEFAULT 100,
  essence integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_completion_date date,
  onboarding_completed boolean NOT NULL DEFAULT false,
  primary_focus text DEFAULT 'mind',
  starting_world text DEFAULT 'forge',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON player_profiles;
CREATE POLICY "select_own_profile" ON player_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON player_profiles;
CREATE POLICY "insert_own_profile" ON player_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON player_profiles;
CREATE POLICY "update_own_profile" ON player_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON player_profiles;
CREATE POLICY "delete_own_profile" ON player_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============= ATTRIBUTES =============
CREATE TABLE IF NOT EXISTS attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  attribute_type text NOT NULL CHECK (attribute_type IN ('mind', 'body', 'craft', 'social', 'balance')),
  level integer NOT NULL DEFAULT 1,
  xp integer NOT NULL DEFAULT 0,
  xp_to_next_level integer NOT NULL DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, attribute_type)
);

ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attributes" ON attributes;
CREATE POLICY "select_own_attributes" ON attributes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_attributes" ON attributes;
CREATE POLICY "insert_own_attributes" ON attributes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_attributes" ON attributes;
CREATE POLICY "update_own_attributes" ON attributes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_attributes" ON attributes;
CREATE POLICY "delete_own_attributes" ON attributes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============= QUESTS =============
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  attribute text NOT NULL CHECK (attribute IN ('mind', 'body', 'craft', 'social', 'balance')),
  difficulty text NOT NULL CHECK (difficulty IN ('trivial', 'easy', 'medium', 'hard', 'epic')),
  xp_reward integer NOT NULL DEFAULT 10,
  essence_reward integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_quests" ON quests;
CREATE POLICY "select_own_quests" ON quests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_quests" ON quests;
CREATE POLICY "insert_own_quests" ON quests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_quests" ON quests;
CREATE POLICY "update_own_quests" ON quests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_quests" ON quests;
CREATE POLICY "delete_own_quests" ON quests FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quests_user_id ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);

-- ============= XP EVENTS =============
CREATE TABLE IF NOT EXISTS xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL DEFAULT 'quest_completion',
  attribute text,
  xp_amount integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_xp_events" ON xp_events;
CREATE POLICY "select_own_xp_events" ON xp_events FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_xp_events" ON xp_events;
CREATE POLICY "insert_own_xp_events" ON xp_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_xp_events" ON xp_events;
CREATE POLICY "delete_own_xp_events" ON xp_events FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_xp_events_user_id ON xp_events(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_created_at ON xp_events(created_at DESC);

-- ============= SHOP ITEMS (shared catalog) =============
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cost integer NOT NULL,
  category text NOT NULL CHECK (category IN ('world_upgrade', 'cosmetic', 'boost', 'artifact')),
  icon text NOT NULL DEFAULT 'sparkles',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_shop_items" ON shop_items;
CREATE POLICY "select_shop_items" ON shop_items FOR SELECT
  TO authenticated USING (true);

-- ============= INVENTORY =============
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_item_id uuid NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  equipped boolean NOT NULL DEFAULT false,
  purchased_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_inventory" ON inventory;
CREATE POLICY "select_own_inventory" ON inventory FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_inventory" ON inventory;
CREATE POLICY "insert_own_inventory" ON inventory FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_inventory" ON inventory;
CREATE POLICY "update_own_inventory" ON inventory FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_inventory" ON inventory;
CREATE POLICY "delete_own_inventory" ON inventory FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);

-- ============= WORLD UNLOCKS =============
CREATE TABLE IF NOT EXISTS world_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, node_id)
);

ALTER TABLE world_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_world_unlocks" ON world_unlocks;
CREATE POLICY "select_own_world_unlocks" ON world_unlocks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_world_unlocks" ON world_unlocks;
CREATE POLICY "insert_own_world_unlocks" ON world_unlocks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_world_unlocks" ON world_unlocks;
CREATE POLICY "delete_own_world_unlocks" ON world_unlocks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_world_unlocks_user_id ON world_unlocks(user_id);

-- ============= UPDATED_AT TRIGGER FUNCTION =============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_player_profiles_updated_at ON player_profiles;
CREATE TRIGGER trigger_player_profiles_updated_at
  BEFORE UPDATE ON player_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_attributes_updated_at ON attributes;
CREATE TRIGGER trigger_attributes_updated_at
  BEFORE UPDATE ON attributes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============= COMPLETE QUEST FUNCTION =============
CREATE OR REPLACE FUNCTION complete_quest(p_quest_id uuid)
RETURNS json AS $$
DECLARE
  v_user_id uuid;
  v_quest quests%ROWTYPE;
  v_profile player_profiles%ROWTYPE;
  v_attr attributes%ROWTYPE;
  v_new_xp integer;
  v_new_level integer;
  v_xp_to_next integer;
  v_leveled_up boolean;
  v_streak integer;
  v_longest_streak integer;
  v_today date := CURRENT_DATE;
  v_yesterday date;
  v_new_unlocks text[] := ARRAY[]::text[];
  v_node_id text;
  v_result json;
BEGIN
  -- Get the quest
  SELECT * INTO v_quest FROM quests WHERE id = p_quest_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found';
  END IF;
  IF v_quest.status = 'completed' THEN
    RAISE EXCEPTION 'Quest already completed';
  END IF;
  v_user_id := v_quest.user_id;

  -- Get profile
  SELECT * INTO v_profile FROM player_profiles WHERE user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Player profile not found';
  END IF;

  -- Get attribute
  SELECT * INTO v_attr FROM attributes WHERE user_id = v_user_id AND attribute_type = v_quest.attribute FOR UPDATE;
  IF NOT FOUND THEN
    -- Create attribute if missing
    INSERT INTO attributes (user_id, attribute_type, level, xp, xp_to_next_level)
    VALUES (v_user_id, v_quest.attribute, 1, 0, 50)
    RETURNING * INTO v_attr;
  END IF;

  -- Award XP to attribute
  v_attr.xp := v_attr.xp + v_quest.xp_reward;
  v_new_level := v_attr.level;
  v_xp_to_next := v_attr.xp_to_next_level;
  WHILE v_attr.xp >= v_xp_to_next LOOP
    v_attr.xp := v_attr.xp - v_xp_to_next;
    v_new_level := v_new_level + 1;
    v_xp_to_next := 50 + (v_new_level - 1) * 25;
  END LOOP;
  v_attr.level := v_new_level;
  v_attr.xp_to_next_level := v_xp_to_next;
  UPDATE attributes SET level = v_attr.level, xp = v_attr.xp, xp_to_next_level = v_attr.xp_to_next_level
  WHERE id = v_attr.id;

  -- Award XP to player profile
  v_profile.xp := v_profile.xp + v_quest.xp_reward;
  v_profile.essence := v_profile.essence + v_quest.essence_reward;
  v_new_level := v_profile.level;
  v_xp_to_next := v_profile.xp_to_next_level;
  v_leveled_up := false;
  WHILE v_profile.xp >= v_xp_to_next LOOP
    v_profile.xp := v_profile.xp - v_xp_to_next;
    v_new_level := v_new_level + 1;
    v_xp_to_next := 100 + (v_new_level - 1) * 50;
    v_leveled_up := true;
  END LOOP;
  v_profile.level := v_new_level;
  v_profile.xp_to_next_level := v_xp_to_next;

  -- Update streak
  v_streak := v_profile.streak;
  v_longest_streak := v_profile.longest_streak;
  IF v_profile.last_completion_date IS NULL THEN
    v_streak := 1;
  ELSIF v_profile.last_completion_date = v_today THEN
    -- Already completed today, keep streak
    v_streak := v_streak;
  ELSE
    v_yesterday := v_today - 1;
    IF v_profile.last_completion_date = v_yesterday THEN
      v_streak := v_streak + 1;
    ELSE
      v_streak := 1;
    END IF;
  END IF;
  IF v_streak > v_longest_streak THEN
    v_longest_streak := v_streak;
  END IF;
  v_profile.streak := v_streak;
  v_profile.longest_streak := v_longest_streak;
  v_profile.last_completion_date := v_today;

  -- Check world unlocks based on new level
  -- World nodes unlock at specific levels
  FOR v_node_id IN
    SELECT node_id FROM (VALUES
      ('library', 5),
      ('workshop', 8),
      ('training_ground', 10),
      ('garden', 12),
      ('community', 15)
    ) AS nodes(node_id, req_level)
    WHERE req_level <= v_new_level
    AND NOT EXISTS (
      SELECT 1 FROM world_unlocks WHERE user_id = v_user_id AND node_id = nodes.node_id
    )
  LOOP
    INSERT INTO world_unlocks (user_id, node_id) VALUES (v_user_id, v_node_id);
    v_new_unlocks := array_append(v_new_unlocks, v_node_id);
  END LOOP;

  -- Update profile
  UPDATE player_profiles SET
    level = v_profile.level,
    xp = v_profile.xp,
    xp_to_next_level = v_profile.xp_to_next_level,
    essence = v_profile.essence,
    streak = v_profile.streak,
    longest_streak = v_profile.longest_streak,
    last_completion_date = v_profile.last_completion_date
  WHERE id = v_profile.id;

  -- Mark quest completed
  UPDATE quests SET status = 'completed', completed_at = now() WHERE id = p_quest_id;

  -- Log XP event
  INSERT INTO xp_events (user_id, event_type, attribute, xp_amount, description)
  VALUES (v_user_id, 'quest_completion', v_quest.attribute, v_quest.xp_reward, v_quest.title);

  -- Build result
  SELECT json_build_object(
    'questId', p_quest_id,
    'completedAt', now(),
    'xpAwarded', v_quest.xp_reward,
    'essenceAwarded', v_quest.essence_reward,
    'newTotalXp', v_profile.xp,
    'level', v_profile.level,
    'leveledUp', v_leveled_up,
    'streak', v_profile.streak,
    'attributeUpdate', json_build_object(
      'attribute', v_quest.attribute,
      'level', v_attr.level,
      'xp', v_attr.xp,
      'xpToNextLevel', v_attr.xp_to_next_level
    ),
    'worldUnlocks', to_json(v_new_unlocks)
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============= PURCHASE ITEM FUNCTION =============
CREATE OR REPLACE FUNCTION purchase_item(p_shop_item_id uuid)
RETURNS json AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_item shop_items%ROWTYPE;
  v_profile player_profiles%ROWTYPE;
  v_existing inventory%ROWTYPE;
  v_new_essence integer;
  v_result json;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_item FROM shop_items WHERE id = p_shop_item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found';
  END IF;

  SELECT * INTO v_profile FROM player_profiles WHERE user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF v_profile.essence < v_item.cost THEN
    RAISE EXCEPTION 'Insufficient essence';
  END IF;

  v_new_essence := v_profile.essence - v_item.cost;
  UPDATE player_profiles SET essence = v_new_essence WHERE id = v_profile.id;

  -- Check if already owned
  SELECT * INTO v_existing FROM inventory WHERE user_id = v_user_id AND shop_item_id = p_shop_item_id;
  IF FOUND THEN
    UPDATE inventory SET quantity = quantity + 1 WHERE id = v_existing.id;
  ELSE
    INSERT INTO inventory (user_id, shop_item_id, quantity, equipped) VALUES (v_user_id, p_shop_item_id, 1, false);
  END IF;

  SELECT json_build_object(
    'success', true,
    'newEssence', v_new_essence,
    'itemId', p_shop_item_id,
    'itemName', v_item.name
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============= SEED SHOP ITEMS =============
INSERT INTO shop_items (name, description, cost, category, icon) VALUES
  ('Forge Amplifier', 'Boost XP gain by 10% for your next 3 quests', 150, 'boost', 'zap'),
  ('Time Crystal', 'Skip one rest day without losing your streak', 200, 'artifact', 'clock'),
  ('Garden Shrine', 'A decorative shrine for your sanctuary garden', 300, 'world_upgrade', 'trees'),
  ('Library Tome', 'An ancient tome to display in your library', 250, 'world_upgrade', 'book-open'),
  ('Aura of Focus', 'A glowing aura effect for your character', 180, 'cosmetic', 'sparkles'),
  ('Ember Cloak', 'A warm cloak woven from forge embers', 220, 'cosmetic', 'flame'),
  ('Training Dummy', 'Upgrade your training ground with a practice dummy', 350, 'world_upgrade', 'sword'),
  ('Community Banner', 'A banner to fly over your community area', 400, 'world_upgrade', 'flag'),
  ('Mind Elixir', 'Grants a temporary mind attribute boost', 120, 'boost', 'brain'),
  ('Craftsman Toolkit', 'Essential tools for your workshop', 280, 'world_upgrade', 'hammer')
ON CONFLICT DO NOTHING;
