-- Add linkedin_url and portfolio_url columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN linkedin_url TEXT,
ADD COLUMN portfolio_url TEXT;

-- Create connections table to store user network
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  connected_user_id UUID NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lab_id TEXT REFERENCES public.labs(id),
  shared_skills TEXT[] DEFAULT '{}',
  private_note TEXT,
  linkedin_shared BOOLEAN DEFAULT false,
  email_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Enable RLS on connections
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Users can view their own connections
CREATE POLICY "Users can view own connections"
ON public.connections
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create connections for themselves
CREATE POLICY "Users can create own connections"
ON public.connections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own connections (for notes, etc.)
CREATE POLICY "Users can update own connections"
ON public.connections
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete own connections"
ON public.connections
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updating updated_at column
CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_connections_user_id ON public.connections(user_id);
CREATE INDEX idx_connections_connected_at ON public.connections(connected_at DESC);