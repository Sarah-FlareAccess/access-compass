-- Add training_hub_only flag for workshop participants
-- Defaults to false so existing organisations are unaffected.
-- Set to true to restrict an org's members to the AI Comms course only.
-- Flip to false to grant the org full app access.

ALTER TABLE organisations
ADD COLUMN training_hub_only BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN organisations.training_hub_only IS 'When true, members of this org can only access the AI Comms course in Training Hub and nothing else in the app. Used for paid workshop participants prior to broader access being granted.';
