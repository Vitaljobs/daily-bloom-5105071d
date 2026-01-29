-- User Sessions Tracking Table
-- This table tracks active user sessions for real-time analytics

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lab_id TEXT REFERENCES public.labs(id),
    page_path TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_lab_id ON public.user_sessions(lab_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON public.user_sessions(last_active_at) WHERE ended_at IS NULL;

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Sessions zijn leesbaar"
ON public.user_sessions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users kunnen eigen sessies aanmaken"
ON public.user_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users kunnen eigen sessies updaten"
ON public.user_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Auto-cleanup function for inactive sessions (30 min timeout)
CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.user_sessions
    SET ended_at = last_active_at
    WHERE ended_at IS NULL
    AND last_active_at < now() - interval '30 minutes';
END;
$$;

-- Optional: Create a cron job to run cleanup every 5 minutes
-- This requires pg_cron extension (available in Supabase)
-- SELECT cron.schedule('cleanup-sessions', '*/5 * * * *', 'SELECT cleanup_inactive_sessions()');
