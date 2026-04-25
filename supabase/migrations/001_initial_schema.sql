-- WingAI Initial Schema
-- Kör via: supabase db push

-- Aktivera pgvector för embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── Användarprofiler (UserDNA) ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,

  -- Röstprofil
  avg_message_length INTEGER DEFAULT 40,
  humor_register TEXT CHECK (humor_register IN ('dry_ironic', 'warm_wholesome', 'wordplay', 'absurdist', 'self_deprecating')),
  emoji_density TEXT DEFAULT 'rare' CHECK (emoji_density IN ('none', 'rare', 'moderate', 'frequent')),
  opener_style TEXT DEFAULT 'observation' CHECK (opener_style IN ('observation', 'question', 'compliment', 'humor')),
  formality_index FLOAT DEFAULT 0.3,
  characteristic_phrases TEXT[] DEFAULT '{}',

  -- Psykologisk profil
  attachment_style TEXT CHECK (attachment_style IN ('secure', 'anxious', 'avoidant', 'disorganized')),
  love_languages TEXT[] DEFAULT '{}',

  -- Preferenser
  hard_dealbreakers TEXT[] DEFAULT '{}',
  soft_dealbreakers TEXT[] DEFAULT '{}',
  lifestyle_vectors JSONB DEFAULT '{}',
  stated_preferences JSONB DEFAULT '{}',

  -- AI-embeddings (röstbaseline)
  voice_baseline_embedding vector(1536),
  revealed_preference_embedding vector(1536),

  -- Metadata
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Matchkort ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS match_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Plattform
  platform TEXT NOT NULL CHECK (platform IN ('hinge', 'tinder', 'bumble', 'badoo', 'happn', 'other')),
  platform_match_id TEXT NOT NULL,

  -- Profil (härledd data — inte rådata från tredje part)
  display_name TEXT NOT NULL,
  age INTEGER,
  occupation TEXT,
  location TEXT,

  -- AI-poäng
  chemistry_score FLOAT NOT NULL DEFAULT 50,
  longterm_score FLOAT NOT NULL DEFAULT 50,
  risk_score FLOAT NOT NULL DEFAULT 20,
  effort_roi TEXT DEFAULT 'medium' CHECK (effort_roi IN ('very_high', 'high', 'medium', 'low')),

  -- Analysresultat
  green_flags TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  personality_signals JSONB DEFAULT '{}',
  visual_signals JSONB DEFAULT '{}',
  compatibility_explanation TEXT,
  suggested_opener_angle TEXT,
  next_recommended_action TEXT,

  -- Pipeline
  stage TEXT NOT NULL DEFAULT 'matched' CHECK (stage IN ('discovered', 'matched', 'active', 'date_scheduled', 'date_complete', 'closed')),
  conversation_momentum TEXT CHECK (conversation_momentum IN ('rising', 'stable', 'falling', 'stalled')),
  last_message_at TIMESTAMPTZ,

  -- Unik kombination per användare + plattform
  UNIQUE(user_id, platform, platform_match_id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Konversationsutfall (inlärningsdata) ─────────────────────────────────

CREATE TABLE IF NOT EXISTS conversation_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_card_id UUID REFERENCES match_cards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  message_type TEXT NOT NULL CHECK (message_type IN ('ai_suggested', 'ai_edited', 'user_written')),
  style_used TEXT CHECK (style_used IN ('safe', 'playful', 'bold')),
  message_text TEXT, -- användarens egna meddelanden, aldrig matchens

  response_received BOOLEAN DEFAULT FALSE,
  response_latency_hours FLOAT,
  response_quality_score FLOAT,
  date_booked BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_outcomes ENABLE ROW LEVEL SECURITY;

-- Användare ser bara sina egna data
CREATE POLICY "Egna profiler" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Egna matchkort" ON match_cards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Egna utfall" ON conversation_outcomes
  FOR ALL USING (auth.uid() = user_id);

-- ─── Index ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_match_cards_user_stage ON match_cards(user_id, stage);
CREATE INDEX IF NOT EXISTS idx_match_cards_updated ON match_cards(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_outcomes_match ON conversation_outcomes(match_card_id);

-- Vector-index för röstlikhetssökning
CREATE INDEX IF NOT EXISTS idx_voice_embedding ON user_profiles
  USING ivfflat (voice_baseline_embedding vector_cosine_ops)
  WITH (lists = 100);

-- ─── Auto-uppdatering av updated_at ──────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_match_cards_updated_at
  BEFORE UPDATE ON match_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
