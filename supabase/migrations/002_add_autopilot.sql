-- Add autopilot and fix column aliases
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS autopilot_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS dealbreakers TEXT[] DEFAULT '{}';
