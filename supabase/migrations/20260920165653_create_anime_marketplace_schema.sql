/*
# Anime Marketplace Schema

## Overview
Creates the full database schema for an anime goods marketplace website where users can:
- Browse an anime inventory with pack-based pricing
- Express purchase interest in inventory items (select pack size, confirm price, enter contact details)
- Submit custom requests for items not in inventory (with expected price and contact details)
- Complete a fun survey
- Refer friends for a chance to win a free goods hamper

This is a single-tenant app with NO sign-in screen. All policies use `TO anon, authenticated`.

## New Tables

1. `inventory` - Anime products with pack-based pricing
   - id (uuid PK)
   - name (text) - product name
   - category (text) - e.g. "Figures", "Posters", "Keychains", "Manga"
   - anime_series (text) - which anime it's from
   - description (text)
   - image_url (text) - product image
   - pack_options (jsonb) - array of {pack_size, price} e.g. [{"pack_size": "1 piece", "price": 50}, {"pack_size": "5 pieces", "price": 200}]
   - in_stock (boolean, default true)
   - created_at (timestamptz)

2. `purchase_interests` - When a user wants to buy an inventory item
   - id (uuid PK)
   - inventory_id (uuid FK -> inventory)
   - product_name (text) - denormalized for record keeping
   - pack_size (text) - which pack they chose
   - price (numeric) - price at time of interest
   - buyer_name (text)
   - buyer_phone (text)
   - buyer_email (text, nullable)
   - college_name (text, nullable)
   - notes (text, nullable)
   - status (text, default 'pending') - pending / contacted / completed
   - created_at (timestamptz)

3. `custom_requests` - When a user wants something not in inventory
   - id (uuid PK)
   - item_description (text) - what they want
   - anime_series (text, nullable) - which anime
   - category (text, nullable)
   - expected_price (numeric, nullable) - what they're willing to pay
   - quantity (text, nullable) - how many they want
   - requester_name (text)
   - requester_phone (text)
   - requester_email (text, nullable)
   - college_name (text, nullable)
   - status (text, default 'pending') - pending / sourcing / fulfilled / closed
   - created_at (timestamptz)

4. `survey_responses` - Fun survey answers
   - id (uuid PK)
   - respondent_name (text, nullable)
   - respondent_phone (text, nullable)
   - favorite_anime (text)
   - favorite_character (text, nullable)
   - favorite_merch_type (text, nullable)
   - spending_range (text, nullable) - e.g. "Under 500", "500-1000", etc.
   - would_recommend (boolean, nullable)
   - feedback (text, nullable)
   - created_at (timestamptz)

5. `referrals` - Refer a friend for hamper giveaway
   - id (uuid PK)
   - referrer_name (text)
   - referrer_phone (text)
   - referrer_email (text, nullable)
   - friend_name (text)
   - friend_phone (text)
   - friend_email (text, nullable)
   - college_name (text, nullable)
   - created_at (timestamptz)

## Security
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` since this is a single-tenant public app with no sign-in.
- Anyone can read inventory (it's a public catalog).
- Anyone can submit purchase interests, custom requests, survey responses, and referrals.
- Update/delete policies are also open since there's no auth — the owner manages data through Supabase dashboard.
*/

-- ============ INVENTORY ============
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Misc',
  anime_series text NOT NULL DEFAULT 'Generic',
  description text DEFAULT '',
  image_url text DEFAULT '',
  pack_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_inventory" ON inventory;
CREATE POLICY "anon_select_inventory" ON inventory FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_inventory" ON inventory;
CREATE POLICY "anon_insert_inventory" ON inventory FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_inventory" ON inventory;
CREATE POLICY "anon_update_inventory" ON inventory FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_inventory" ON inventory;
CREATE POLICY "anon_delete_inventory" ON inventory FOR DELETE
  TO anon, authenticated USING (true);

-- ============ PURCHASE INTERESTS ============
CREATE TABLE IF NOT EXISTS purchase_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES inventory(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  pack_size text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  buyer_name text NOT NULL,
  buyer_phone text NOT NULL,
  buyer_email text DEFAULT '',
  college_name text DEFAULT '',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_purchase_interests" ON purchase_interests;
CREATE POLICY "anon_select_purchase_interests" ON purchase_interests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_purchase_interests" ON purchase_interests;
CREATE POLICY "anon_insert_purchase_interests" ON purchase_interests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_purchase_interests" ON purchase_interests;
CREATE POLICY "anon_update_purchase_interests" ON purchase_interests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_purchase_interests" ON purchase_interests;
CREATE POLICY "anon_delete_purchase_interests" ON purchase_interests FOR DELETE
  TO anon, authenticated USING (true);

-- ============ CUSTOM REQUESTS ============
CREATE TABLE IF NOT EXISTS custom_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_description text NOT NULL,
  anime_series text DEFAULT '',
  category text DEFAULT '',
  expected_price numeric DEFAULT 0,
  quantity text DEFAULT '',
  requester_name text NOT NULL,
  requester_phone text NOT NULL,
  requester_email text DEFAULT '',
  college_name text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_custom_requests" ON custom_requests;
CREATE POLICY "anon_select_custom_requests" ON custom_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_custom_requests" ON custom_requests;
CREATE POLICY "anon_insert_custom_requests" ON custom_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_custom_requests" ON custom_requests;
CREATE POLICY "anon_update_custom_requests" ON custom_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_custom_requests" ON custom_requests;
CREATE POLICY "anon_delete_custom_requests" ON custom_requests FOR DELETE
  TO anon, authenticated USING (true);

-- ============ SURVEY RESPONSES ============
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  respondent_name text DEFAULT '',
  respondent_phone text DEFAULT '',
  favorite_anime text NOT NULL,
  favorite_character text DEFAULT '',
  favorite_merch_type text DEFAULT '',
  spending_range text DEFAULT '',
  would_recommend boolean DEFAULT true,
  feedback text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_survey" ON survey_responses;
CREATE POLICY "anon_select_survey" ON survey_responses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_survey" ON survey_responses;
CREATE POLICY "anon_insert_survey" ON survey_responses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_survey" ON survey_responses;
CREATE POLICY "anon_update_survey" ON survey_responses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_survey" ON survey_responses;
CREATE POLICY "anon_delete_survey" ON survey_responses FOR DELETE
  TO anon, authenticated USING (true);

-- ============ REFERRALS ============
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_name text NOT NULL,
  referrer_phone text NOT NULL,
  referrer_email text DEFAULT '',
  friend_name text NOT NULL,
  friend_phone text NOT NULL,
  friend_email text DEFAULT '',
  college_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_referrals" ON referrals;
CREATE POLICY "anon_select_referrals" ON referrals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_referrals" ON referrals;
CREATE POLICY "anon_insert_referrals" ON referrals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_referrals" ON referrals;
CREATE POLICY "anon_update_referrals" ON referrals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_referrals" ON referrals;
CREATE POLICY "anon_delete_referrals" ON referrals FOR DELETE
  TO anon, authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_anime_series ON inventory(anime_series);
CREATE INDEX IF NOT EXISTS idx_purchase_interests_status ON purchase_interests(status);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created ON referrals(created_at);
