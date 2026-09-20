/*
# Add email column + unique constraint on survey_responses

## Overview
1. Adds `respondent_email` column to `survey_responses` (was missing from the original schema).
2. Adds partial unique indexes on phone and email so each person can only submit the survey once.

## Changes
- `survey_responses`: ADD COLUMN respondent_email text DEFAULT ''
- Unique index on `respondent_phone` (non-empty values only)
- Unique index on `respondent_email` (non-empty values only)
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'respondent_email') THEN
    ALTER TABLE survey_responses ADD COLUMN respondent_email text DEFAULT '';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_survey_phone_unique 
  ON survey_responses (respondent_phone) 
  WHERE respondent_phone IS NOT NULL AND respondent_phone != '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_survey_email_unique 
  ON survey_responses (respondent_email) 
  WHERE respondent_email IS NOT NULL AND respondent_email != '';
