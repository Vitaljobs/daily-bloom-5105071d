# Database Documentatie - Common Ground / Daily Bloom

Dit document bevat de volledige database-structuur voor het Common Ground project. Gebruik deze SQL-scripts om de database te repliceren in je eigen Supabase Pro account.

## Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Enums](#enums)
3. [Tabellen](#tabellen)
4. [RLS Policies](#rls-policies)
5. [Functions](#functions)
6. [Triggers](#triggers)
7. [Storage Buckets](#storage-buckets)
8. [Auth Configuratie](#auth-configuratie)

---

## Overzicht

Het project is een professionele networking app voor co-working spaces. De database ondersteunt:
- Gebruikersprofielen met skills en industrie
- Lab/locatie check-ins
- Premium lidmaatschappen
- Role-based access control
- Chat functionaliteit

---

## Enums

```sql
-- User status voor beschikbaarheid
CREATE TYPE public.user_status AS ENUM ('open', 'focus', 'invisible');

-- Industrie categorieën
CREATE TYPE public.industry AS ENUM ('tech', 'creative', 'finance', 'other');

-- Gebruikersrollen voor toegangsbeheer
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Premium tier niveaus
CREATE TYPE public.premium_tier AS ENUM ('free', 'pro', 'business');
```

---

## Tabellen

### 1. Profiles (Gebruikersprofielen)

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Basis informatie
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT, -- Functietitel (bijv. "Full-Stack Developer")
    bio TEXT,
    
    -- Professional info
    skills TEXT[] DEFAULT '{}',
    industry industry DEFAULT 'other',
    
    -- Lab/Locatie
    current_lab_id TEXT,
    checked_in_at TIMESTAMPTZ,
    lab_visits INTEGER DEFAULT 0,
    
    -- Status
    status user_status DEFAULT 'open',
    preferred_language TEXT DEFAULT 'nl',
    
    -- Premium
    premium_tier premium_tier DEFAULT 'free',
    premium_expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index voor snelle lookups
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_current_lab ON public.profiles(current_lab_id);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_industry ON public.profiles(industry);
```

### 2. User Roles (Gebruikersrollen - SECURITY CRITICAL)

```sql
-- BELANGRIJK: Rollen APART van profiles voor security
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    UNIQUE (user_id, role)
);

-- Index voor snelle role lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
```

### 3. Labs (Locaties/Werkruimtes)

```sql
CREATE TABLE public.labs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    capacity INTEGER DEFAULT 50,
    amenities TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data voor labs
INSERT INTO public.labs (id, name, description, amenities) VALUES
    ('roastery', 'The Roastery', 'Koffie-georiënteerde werkruimte met barista service', ARRAY['coffee', 'wifi', 'power']),
    ('library', 'The Library', 'Stille werkruimte voor focus werk', ARRAY['quiet', 'wifi', 'power', 'books']),
    ('greenhouse', 'The Greenhouse', 'Groene ruimte met planten', ARRAY['plants', 'wifi', 'natural-light']),
    ('espresso', 'Espresso Bar', 'Snelle meetings en koffie breaks', ARRAY['coffee', 'standing-desks']),
    ('rooftop', 'Rooftop Terrace', 'Buitenruimte met uitzicht', ARRAY['outdoor', 'wifi', 'view']);
```

### 4. Connections (Netwerk Connecties)

```sql
CREATE TABLE public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    
    UNIQUE (user_id, connected_user_id),
    CHECK (user_id != connected_user_id)
);

CREATE INDEX idx_connections_user_id ON public.connections(user_id);
CREATE INDEX idx_connections_connected_user_id ON public.connections(connected_user_id);
```

### 5. Chat Messages

```sql
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CHECK (sender_id != receiver_id)
);

CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Enable realtime voor messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

### 6. Help Requests (Help Wall)

```sql
CREATE TABLE public.help_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    skills_needed TEXT[] DEFAULT '{}',
    lab_id TEXT REFERENCES public.labs(id),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

CREATE INDEX idx_help_requests_user_id ON public.help_requests(user_id);
CREATE INDEX idx_help_requests_lab_id ON public.help_requests(lab_id);
```

---

## RLS Policies

### Enable RLS op alle tabellen

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
```

### Profiles Policies

```sql
-- Iedereen kan profielen zien (voor networking)
CREATE POLICY "Profiles zijn publiek leesbaar"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Gebruikers kunnen alleen hun eigen profiel bewerken
CREATE POLICY "Gebruikers kunnen eigen profiel bewerken"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Gebruikers kunnen hun eigen profiel aanmaken
CREATE POLICY "Gebruikers kunnen eigen profiel aanmaken"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Gebruikers kunnen hun eigen profiel verwijderen
CREATE POLICY "Gebruikers kunnen eigen profiel verwijderen"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### User Roles Policies

```sql
-- Alleen admins kunnen rollen zien
CREATE POLICY "Admins kunnen rollen zien"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Alleen admins kunnen rollen toewijzen
CREATE POLICY "Admins kunnen rollen toewijzen"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Alleen admins kunnen rollen verwijderen
CREATE POLICY "Admins kunnen rollen verwijderen"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

### Labs Policies

```sql
-- Labs zijn publiek leesbaar
CREATE POLICY "Labs zijn publiek leesbaar"
ON public.labs FOR SELECT
TO authenticated
USING (true);

-- Alleen admins kunnen labs beheren
CREATE POLICY "Admins kunnen labs beheren"
ON public.labs FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

### Connections Policies

```sql
-- Gebruikers kunnen hun eigen connecties zien
CREATE POLICY "Gebruikers zien eigen connecties"
ON public.connections FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Gebruikers kunnen connectie verzoeken sturen
CREATE POLICY "Gebruikers kunnen connecties aanmaken"
ON public.connections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Gebruikers kunnen hun connecties beheren
CREATE POLICY "Gebruikers kunnen eigen connecties beheren"
ON public.connections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = connected_user_id);
```

### Messages Policies

```sql
-- Gebruikers kunnen hun eigen berichten zien
CREATE POLICY "Gebruikers zien eigen berichten"
ON public.messages FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Gebruikers kunnen berichten versturen
CREATE POLICY "Gebruikers kunnen berichten versturen"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Gebruikers kunnen berichten als gelezen markeren
CREATE POLICY "Gebruikers kunnen berichten updaten"
ON public.messages FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);
```

### Help Requests Policies

```sql
-- Help requests zijn zichtbaar voor iedereen in hetzelfde lab
CREATE POLICY "Help requests zijn leesbaar"
ON public.help_requests FOR SELECT
TO authenticated
USING (true);

-- Gebruikers kunnen hun eigen help requests aanmaken
CREATE POLICY "Gebruikers kunnen help requests aanmaken"
ON public.help_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Gebruikers kunnen hun eigen help requests beheren
CREATE POLICY "Gebruikers kunnen eigen help requests beheren"
ON public.help_requests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Gebruikers kunnen eigen help requests verwijderen"
ON public.help_requests FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

---

## Functions

### 1. Role Check Function (SECURITY CRITICAL)

```sql
-- Security definer functie om rollen te checken zonder recursie
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;
```

### 2. Auto-update Timestamps

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Auto-create Profile on Signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    
    -- Standaard 'user' rol toewijzen
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Check Premium Status

```sql
CREATE OR REPLACE FUNCTION public.is_premium(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE user_id = _user_id
        AND premium_tier != 'free'
        AND (premium_expires_at IS NULL OR premium_expires_at > now())
    )
$$;
```

### 5. Increment Lab Visits

```sql
CREATE OR REPLACE FUNCTION public.increment_lab_visits(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET lab_visits = lab_visits + 1
    WHERE user_id = _user_id;
END;
$$;
```

---

## Triggers

```sql
-- Auto-update timestamps voor profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile bij nieuwe gebruiker
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

---

## Storage Buckets

```sql
-- Avatar uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Avatar policies
CREATE POLICY "Avatar images zijn publiek"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Gebruikers kunnen eigen avatar uploaden"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Gebruikers kunnen eigen avatar updaten"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Auth Configuratie

### Supabase Dashboard Settings

1. **Email Confirmatie**: Disable voor development (enable voor productie)
2. **Site URL**: `https://your-domain.com`
3. **Redirect URLs**: 
   - `https://your-domain.com/*`
   - `http://localhost:5173/*` (development)

### Email Templates

Pas de email templates aan in Supabase Dashboard → Authentication → Email Templates.

---

## Migratie Volgorde

Voer de SQL uit in deze volgorde:

1. Enums
2. Functions (has_role, update_updated_at_column)
3. Tabellen
4. Indexes
5. RLS Policies
6. Triggers
7. Storage Buckets
8. Seed Data (labs)

---

## Environment Variables

Stel deze in je `.env` bestand:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Voor Edge Functions:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Notities

- **Local Guides**: Gebruikers met 30+ lab_visits krijgen een badge
- **Premium Expiry**: Check altijd `premium_expires_at` naast `premium_tier`
- **Realtime**: Messages tabel heeft realtime enabled voor live chat
- **Security**: Role checks altijd via `has_role()` function, nooit direct query

---

*Laatst bijgewerkt: Januari 2026*
