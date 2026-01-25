# 🚀 Complete Migratie Handleiding

## Common Ground / Daily Bloom → Eigen Supabase Pro

**Geschatte tijd:** 30-45 minuten  
**Moeilijkheidsgraad:** Gemiddeld  
**Vereist:** Supabase Pro account, Supabase CLI, GitHub toegang

---

## 📋 Overzicht

Je gaat migreren van Lovable Cloud naar je eigen Supabase Pro account. Na deze migratie heb je volledige controle over:
- ✅ Database (PostgreSQL)
- ✅ Authenticatie
- ✅ Edge Functions
- ✅ Storage
- ✅ Realtime subscriptions

---

## 📁 Benodigde Bestanden

| Bestand | Locatie | Bevat |
|---------|---------|-------|
| `DATABASE.md` | Project root | Complete schema (enums, tables, RLS, triggers) |
| `MIGRATION_EXPORT.sql` | Project root | Data export (labs, profiles, roles) |
| `supabase/functions/` | Project folder | 4 Edge Functions |

---

## 🔧 STAP 1: Supabase Pro Project Aanmaken

1. Ga naar [supabase.com/dashboard](https://supabase.com/dashboard)
2. Klik **"New Project"**
3. Vul in:
   - **Name:** `common-ground-pulse` (of je eigen naam)
   - **Database Password:** Kies een sterk wachtwoord (bewaar dit!)
   - **Region:** Kies EU (Frankfurt) voor snelheid
4. Wacht tot het project klaar is (~2 minuten)

**📝 Noteer deze gegevens:**
```
Project ID: ___________________________
Project URL: https://____________.supabase.co
Anon Key: ___________________________
Service Role Key: ___________________________
```

---

## 🗃️ STAP 2: Database Schema Aanmaken

### 2.1 Open de SQL Editor
1. Ga naar je Supabase Dashboard
2. Klik op **"SQL Editor"** in de sidebar
3. Klik **"New Query"**

### 2.2 Voer de Enums uit
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
Klik **"Run"** ✅

### 2.3 Voer de Functions uit
```sql
-- Role Check Function (SECURITY CRITICAL)
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

-- Auto-update Timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
Klik **"Run"** ✅

### 2.4 Voer de Tabellen uit
```sql
-- Profiles (Gebruikersprofielen)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    industry industry DEFAULT 'other',
    current_lab_id TEXT,
    checked_in_at TIMESTAMPTZ,
    lab_visits INTEGER DEFAULT 0,
    status user_status DEFAULT 'open',
    preferred_language TEXT DEFAULT 'nl',
    premium_tier premium_tier DEFAULT 'free',
    linkedin_url TEXT,
    portfolio_url TEXT,
    last_seen TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Labs (Locaties)
CREATE TABLE public.labs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    tagline TEXT,
    atmosphere TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Connections
CREATE TABLE public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    connected_user_id UUID NOT NULL,
    lab_id TEXT,
    shared_skills TEXT[] DEFAULT '{}',
    private_note TEXT,
    linkedin_shared BOOLEAN DEFAULT false,
    email_shared BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, connected_user_id),
    CHECK (user_id != connected_user_id)
);

-- Page Views (Analytics)
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    session_id TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_current_lab ON public.profiles(current_lab_id);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_connections_user_id ON public.connections(user_id);
CREATE INDEX idx_connections_connected_user_id ON public.connections(connected_user_id);
```
Klik **"Run"** ✅

### 2.5 Voer RLS Policies uit
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User Roles Policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Labs Policies
CREATE POLICY "Anyone can view labs" ON public.labs FOR SELECT USING (true);
CREATE POLICY "Admins can manage labs" ON public.labs FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Connections Policies
CREATE POLICY "Users can view own connections" ON public.connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own connections" ON public.connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own connections" ON public.connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON public.connections FOR DELETE USING (auth.uid() = user_id);

-- Page Views Policies
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view page views" ON public.page_views FOR SELECT USING (has_role(auth.uid(), 'admin'));
```
Klik **"Run"** ✅

### 2.6 Voer Triggers uit
```sql
-- Auto-update timestamps
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
Klik **"Run"** ✅

### 2.7 Voer de View uit
```sql
-- Page View Stats (aggregated view for admin)
CREATE VIEW public.page_view_stats
WITH (security_invoker = on) AS
SELECT 
  date_trunc('day', created_at) as view_date,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users
FROM public.page_views
GROUP BY date_trunc('day', created_at)
ORDER BY view_date DESC;
```
Klik **"Run"** ✅

---

## 🌍 STAP 3: Labs Data Importeren

Voer dit uit in de SQL Editor:
```sql
INSERT INTO public.labs (id, name, description, icon, tagline, atmosphere) VALUES
('espresso', 'The Espresso Bar', 'Bruisende energie en snelle connecties aan de bar.', '☕', 'Snel & Sociaal', 'social'),
('greenhouse', 'The Greenhouse', 'Omringd door planten in een lichte, botanische oase.', '🌿', 'Fris & Groen', 'fresh'),
('library', 'The Library Vault', 'Diepe concentratie in een klassieke bibliotheeksfeer met leren fauteuils.', '📚', 'Stil & Focus', 'quiet'),
('roastery', 'The Roastery', 'Een ruige, industriële sfeer met koperen branders en de geur van vers gebrande bonen.', '🔥', 'Industrieel & Ruig', 'industrial'),
('rooftop', 'The Rooftop Terrace', 'Panoramisch uitzicht bij zonsondergang voor creatieve inspiratie.', '🌅', 'Inspirerend & Open', 'inspiring');
```
Klik **"Run"** ✅

---

## 🔐 STAP 4: Authenticatie Configureren

1. Ga naar **Authentication** → **Providers**
2. Zorg dat **Email** is ingeschakeld
3. Ga naar **Authentication** → **Settings**
4. Zet **"Confirm email"** UIT (voor development)
5. Stel **Site URL** in: `https://pulse.xx.kg` (of je domein)
6. Voeg **Redirect URLs** toe:
   - `https://pulse.xx.kg/*`
   - `http://localhost:5173/*`

---

## ⚡ STAP 5: Edge Functions Deployen

### 5.1 Installeer Supabase CLI
```bash
# macOS
brew install supabase/tap/supabase

# Windows (met scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (alternatief)
npm install -g supabase
```

### 5.2 Login en Link
```bash
# Login bij Supabase
supabase login

# Ga naar je project folder
cd /pad/naar/daily-bloom

# Link naar je nieuwe project
supabase link --project-ref JOUW_PROJECT_ID
```

### 5.3 Secrets Instellen
```bash
# API key voor stats endpoint
supabase secrets set LOVABLE_API_KEY=jouw_geheime_api_key_hier

# Resend API key (voor emails)
supabase secrets set RESEND_API_KEY=jouw_resend_key_hier
```

### 5.4 Deploy Functions
```bash
supabase functions deploy api-stats
supabase functions deploy generate-icebreaker
supabase functions deploy send-reset-email
supabase functions deploy translate-message
```

---

## 🌐 STAP 6: Vercel/Hosting Updaten

### 6.1 Environment Variables
Ga naar je Vercel dashboard → Project Settings → Environment Variables

Voeg toe of update:
```
VITE_SUPABASE_URL=https://JOUW_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=jouw_nieuwe_anon_key
VITE_SUPABASE_PROJECT_ID=JOUW_PROJECT_ID
```

### 6.2 Redeploy
```bash
# Via Vercel CLI
vercel --prod

# Of via GitHub push
git add .
git commit -m "chore: switch to own Supabase Pro"
git push origin main
```

---

## 👤 STAP 7: Admin Account Aanmaken

1. Ga naar je app en registreer een nieuw account
2. Ga naar Supabase Dashboard → SQL Editor
3. Voer uit (vervang EMAIL met je email):
```sql
-- Vind je user_id
SELECT id, email FROM auth.users WHERE email = 'JOUW_EMAIL@example.com';

-- Maak admin (vervang USER_ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HIER', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## ✅ STAP 8: Verificatie Checklist

Test de volgende functionaliteit:

| Feature | Test | Status |
|---------|------|--------|
| Registratie | Maak nieuw account | ⬜ |
| Login | Log in met account | ⬜ |
| Profiel | Bekijk/edit profiel | ⬜ |
| Labs | Bekijk alle labs | ⬜ |
| Check-in | Check in bij een lab | ⬜ |
| Admin | Toegang tot /admin | ⬜ |
| API Stats | Test met curl (zie onder) | ⬜ |

### Test API Endpoint
```bash
curl -X GET "https://JOUW_PROJECT_ID.supabase.co/functions/v1/api-stats" \
  -H "x-api-key: jouw_api_key"
```

---

## 🆘 Troubleshooting

### "Invalid API key"
→ Check of VITE_SUPABASE_PUBLISHABLE_KEY correct is in Vercel

### "RLS policy violation"
→ Zorg dat je bent ingelogd en de juiste rol hebt

### "Function not found"
→ Check of edge functions correct zijn gedeployed met `supabase functions list`

### "CORS error"
→ Voeg je domein toe aan Supabase Authentication → URL Configuration

---

## 📞 Support

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **GitHub Repo:** `Vitaljobs/daily-bloom`
- **Edge Function Logs:** Supabase Dashboard → Edge Functions → Logs

---

*Laatst bijgewerkt: Januari 2026*
