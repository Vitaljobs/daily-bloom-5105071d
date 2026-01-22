-- Create labs table to store lab locations
CREATE TABLE public.labs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  icon TEXT,
  atmosphere TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;

-- Everyone can view labs
CREATE POLICY "Anyone can view labs"
  ON public.labs FOR SELECT
  USING (true);

-- Only admins can manage labs
CREATE POLICY "Admins can manage labs"
  ON public.labs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the labs data
INSERT INTO public.labs (id, name, tagline, description, icon, atmosphere) VALUES
  ('roastery', 'The Roastery', 'Industrieel & Ruig', 'Een ruige, industriële sfeer met koperen branders en de geur van vers gebrande bonen.', '🔥', 'industrial'),
  ('library', 'The Library Vault', 'Stil & Focus', 'Diepe concentratie in een klassieke bibliotheeksfeer met leren fauteuils.', '📚', 'quiet'),
  ('espresso', 'The Espresso Bar', 'Snel & Sociaal', 'Bruisende energie en snelle connecties aan de bar.', '☕', 'social'),
  ('rooftop', 'The Rooftop Terrace', 'Inspirerend & Open', 'Panoramisch uitzicht bij zonsondergang voor creatieve inspiratie.', '🌅', 'inspiring'),
  ('greenhouse', 'The Greenhouse', 'Fris & Groen', 'Omringd door planten in een lichte, botanische oase.', '🌿', 'fresh');

-- Add foreign key constraint to profiles.current_lab_id
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_current_lab
  FOREIGN KEY (current_lab_id) REFERENCES public.labs(id)
  ON DELETE SET NULL;