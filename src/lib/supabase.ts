import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PackOption = {
  pack_size: string;
  price: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  anime_series: string;
  description: string;
  image_url: string;
  pack_options: PackOption[];
  in_stock: boolean;
  created_at: string;
};

export type PurchaseInterest = {
  id?: string;
  inventory_id: string;
  product_name: string;
  pack_size: string;
  price: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string;
  city?: string;
  college_name?: string;
  notes?: string;
};

export type CustomRequest = {
  id?: string;
  item_description: string;
  anime_series?: string;
  category?: string;
  expected_price?: number;
  quantity?: string;
  requester_name: string;
  requester_phone: string;
  requester_email?: string;
  city?: string;
  college_name?: string;
};

export type SurveyResponse = {
  id?: string;
  respondent_name?: string;
  respondent_phone?: string;
  respondent_email?: string;
  city?: string;
  favorite_anime: string;
  favorite_character?: string;
  favorite_merch_type?: string;
  spending_range?: string;
  would_recommend?: boolean;
  feedback?: string;
};

export type Referral = {
  id?: string;
  referrer_name: string;
  referrer_phone: string;
  referrer_email?: string;
  friend_name: string;
  friend_phone: string;
  friend_email?: string;
  city?: string;
  college_name?: string;
};
