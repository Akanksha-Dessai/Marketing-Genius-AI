-- MarketingGenius AI campaign storage
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input JSONB NOT NULL,
  research JSONB NOT NULL,
  strategy JSONB NOT NULL,
  content JSONB NOT NULL,
  analytics JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_user_id ON public.marketing_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_created_at ON public.marketing_campaigns(created_at DESC);

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"
  ON public.marketing_campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON public.marketing_campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON public.marketing_campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Register MarketingGenius in ai_agents if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_agents') THEN
    INSERT INTO public.ai_agents (name, slug, description, system_prompt, is_active, category)
    VALUES (
      'MarketingGenius Campaign Generator',
      'marketing-genius',
      'Four-agent pipeline: Research, Strategy, Content, and Analytics for full marketing campaigns',
      'Orchestrates sequential marketing campaign generation across four specialized AI agents.',
      true,
      'marketing'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      is_active = true;
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;
