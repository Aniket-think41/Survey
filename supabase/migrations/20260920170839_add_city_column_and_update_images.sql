/*
# Add city column to all tables + update inventory images

## Overview
1. Adds a `city` column to `purchase_interests`, `custom_requests`, `survey_responses`, and `referrals` tables.
   - The user requested city as part of the contact details for all form submissions.
2. Updates all 12 inventory items with real anime-themed stock photo URLs from Pexels.

## Changes
- `purchase_interests`: ADD COLUMN city text DEFAULT ''
- `custom_requests`: ADD COLUMN city text DEFAULT ''
- `survey_responses`: ADD COLUMN city text DEFAULT ''
- `referrals`: ADD COLUMN city text DEFAULT ''

## Notes
- Uses DO $$ ... IF NOT EXISTS ... END $$ to make column additions idempotent.
- No data loss — existing rows get the default empty string for city.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchase_interests' AND column_name = 'city') THEN
    ALTER TABLE purchase_interests ADD COLUMN city text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_requests' AND column_name = 'city') THEN
    ALTER TABLE custom_requests ADD COLUMN city text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'city') THEN
    ALTER TABLE survey_responses ADD COLUMN city text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'referrals' AND column_name = 'city') THEN
    ALTER TABLE referrals ADD COLUMN city text DEFAULT '';
  END IF;
END $$;

-- Update inventory with real anime-themed stock photos
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/1194027/pexels-photo-1194027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Naruto Keychain Set';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/8000986/pexels-photo-8000986.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'One Piece Luffy Figure';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/29501720/pexels-photo-29501720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Demon Slayer Poster Set';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/7121348/pexels-photo-7121348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Attack on Titan Hoodie';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/38581654/pexels-photo-38581654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'My Hero Academia Sticker Pack';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/18848524/pexels-photo-18848524.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Jujutsu Kaisen Manga Set';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/33305426/pexels-photo-33305426.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Spy x Family Badge Set';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/374117/pexels-photo-374117.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Tokyo Revengers Phone Case';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/1194025/pexels-photo-1194025.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Chainsaw Man Keychain';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Death Note Notebook Replica';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/1474575/pexels-photo-1474575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Dragon Ball Z T-Shirt';
UPDATE inventory SET image_url = 'https://images.pexels.com/photos/39563778/pexels-photo-39563778.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' WHERE name = 'Bleach Wall Scroll';
