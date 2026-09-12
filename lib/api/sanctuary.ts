import { supabase } from '@/lib/supabase/client';
import { ShopItem, PurchaseResult } from '@/lib/types';

export async function getShopItems(): Promise<{
  data: ShopItem[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('shop_items')
    .select('*')
    .order('cost', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function purchaseItem(itemId: string): Promise<{
  data: PurchaseResult | null;
  error: string | null;
}> {
  const { data, error } = await supabase.rpc('purchase_item', { p_shop_item_id: itemId });

  if (error) return { data: null, error: error.message };
  return { data: data as PurchaseResult, error: null };
}

export async function toggleEquip(inventoryId: string, equipped: boolean): Promise<{
  error: string | null;
}> {
  const { error } = await supabase
    .from('inventory')
    .update({ equipped })
    .eq('id', inventoryId);

  return { error: error?.message || null };
}
