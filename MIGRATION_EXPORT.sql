-- ============================================
-- COMMON GROUND / DAILY BLOOM - DATA EXPORT
-- Generated: 2026-01-25
-- Voor migratie naar eigen Supabase Pro account
-- ============================================

-- STAP 1: Voer eerst DATABASE.md schema uit in je nieuwe project
-- STAP 2: Voer daarna dit bestand uit om de data te importeren

-- ============================================
-- LABS DATA
-- ============================================
INSERT INTO public.labs (id, name, description, icon, tagline, atmosphere, created_at) VALUES
('espresso', 'The Espresso Bar', 'Bruisende energie en snelle connecties aan de bar.', '☕', 'Snel & Sociaal', 'social', '2026-01-22 13:39:30.13446+00'),
('greenhouse', 'The Greenhouse', 'Omringd door planten in een lichte, botanische oase.', '🌿', 'Fris & Groen', 'fresh', '2026-01-22 13:39:30.13446+00'),
('library', 'The Library Vault', 'Diepe concentratie in een klassieke bibliotheeksfeer met leren fauteuils.', '📚', 'Stil & Focus', 'quiet', '2026-01-22 13:39:30.13446+00'),
('roastery', 'The Roastery', 'Een ruige, industriële sfeer met koperen branders en de geur van vers gebrande bonen.', '🔥', 'Industrieel & Ruig', 'industrial', '2026-01-22 13:39:30.13446+00'),
('rooftop', 'The Rooftop Terrace', 'Panoramisch uitzicht bij zonsondergang voor creatieve inspiratie.', '🌅', 'Inspirerend & Open', 'inspiring', '2026-01-22 13:39:30.13446+00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  tagline = EXCLUDED.tagline,
  atmosphere = EXCLUDED.atmosphere;

-- ============================================
-- PROFILES DATA
-- ============================================
-- BELANGRIJK: Profiles worden automatisch aangemaakt via de handle_new_user() trigger
-- bij registratie. Je hoeft deze data alleen te importeren als je bestaande
-- gebruikers wilt overzetten. In dat geval moet je eerst de auth.users aanmaken.

-- Huidige profielen (3 gebruikers):
-- 1. james (user_id: cfa23561-1cb5-4a30-a1f1-7af072b582c8) - role: user
-- 2. test 2 (user_id: 0b807004-f930-4875-8a10-62a652dd9cba) - role: admin
-- 3. James Chin fo sieeuw (user_id: 556ed0af-9f6a-4d0a-86f1-e6593c1e05d7) - role: user

-- Als je profielen handmatig wilt importeren (NA auth.users aanmaken):
/*
INSERT INTO public.profiles (id, user_id, name, industry, status, premium_tier, lab_visits, preferred_language, created_at, updated_at, last_seen) VALUES
('8062086f-1799-4034-b530-3e1f837b2cf2', 'cfa23561-1cb5-4a30-a1f1-7af072b582c8', 'james', 'other', 'open', 'free', 0, 'nl', '2026-01-22 12:15:57.680784+00', '2026-01-22 12:15:57.680784+00', '2026-01-23 08:27:50.420471+00'),
('e20ed595-3141-4606-8afe-b005ceb0ca04', '0b807004-f930-4875-8a10-62a652dd9cba', 'test 2', 'other', 'open', 'free', 0, 'nl', '2026-01-22 13:29:50.406058+00', '2026-01-23 09:06:08.256287+00', '2026-01-23 09:06:07.782+00'),
('4e2e544e-71d2-4db5-bc15-5b6d766392d9', '556ed0af-9f6a-4d0a-86f1-e6593c1e05d7', 'James Chin fo sieeuw', 'other', 'open', 'free', 0, 'nl', '2026-01-22 17:35:40.366176+00', '2026-01-22 17:35:40.366176+00', '2026-01-23 08:27:50.420471+00')
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  industry = EXCLUDED.industry,
  status = EXCLUDED.status,
  premium_tier = EXCLUDED.premium_tier;
*/

-- ============================================
-- USER ROLES DATA
-- ============================================
-- BELANGRIJK: Rollen moeten gekoppeld worden aan de juiste user_id's in je nieuwe project
-- De admin user is: 0b807004-f930-4875-8a10-62a652dd9cba (test 2)

/*
INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES
('14ee64c8-089a-45e9-9114-fa30dcbdc299', 'cfa23561-1cb5-4a30-a1f1-7af072b582c8', 'user', '2026-01-22 12:15:57.680784+00'),
('3238cf10-6fd3-450f-b04e-28ed80b37e3d', '0b807004-f930-4875-8a10-62a652dd9cba', 'admin', '2026-01-22 13:29:50.406058+00'),
('d138b1f3-f1e8-4732-9e28-d6429edad4bb', '556ed0af-9f6a-4d0a-86f1-e6593c1e05d7', 'user', '2026-01-22 17:35:40.366176+00')
ON CONFLICT (user_id, role) DO NOTHING;
*/

-- ============================================
-- CONNECTIONS DATA
-- ============================================
-- Momenteel geen connecties in de database

-- ============================================
-- PAGE VIEWS DATA
-- ============================================
-- 31 page views in totaal (analytics data)
-- Deze data is optioneel om te migreren - je start normaal met verse analytics

-- ============================================
-- MIGRATIE CHECKLIST
-- ============================================
/*
1. [ ] Nieuw Supabase Pro project aangemaakt
2. [ ] Enums aangemaakt (user_status, industry, app_role, premium_tier)
3. [ ] Functions aangemaakt (has_role, handle_new_user, update_updated_at_column)
4. [ ] Tabellen aangemaakt (profiles, user_roles, labs, connections, page_views)
5. [ ] RLS policies aangemaakt
6. [ ] Triggers aangemaakt
7. [ ] Labs data geïmporteerd (dit bestand - alleen de labs INSERT)
8. [ ] Edge functions gedeployed via Supabase CLI
9. [ ] Environment variables bijgewerkt in Vercel/hosting
10. [ ] Auth providers geconfigureerd (Email, auto-confirm aan)
11. [ ] Eerste admin account aangemaakt en rol toegewezen
*/

-- ============================================
-- EDGE FUNCTIONS DEPLOY COMMANDS
-- ============================================
/*
cd /path/to/your/project

# Login bij Supabase
supabase login

# Link naar je nieuwe project
supabase link --project-ref YOUR_NEW_PROJECT_ID

# Deploy alle edge functions
supabase functions deploy api-stats
supabase functions deploy generate-icebreaker
supabase functions deploy send-reset-email
supabase functions deploy translate-message

# Secrets instellen
supabase secrets set LOVABLE_API_KEY=your_api_key_here
supabase secrets set RESEND_API_KEY=your_resend_key_here
*/

-- ============================================
-- ENVIRONMENT VARIABLES VOOR VERCEL
-- ============================================
/*
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_new_anon_key
VITE_SUPABASE_PROJECT_ID=YOUR_NEW_PROJECT_ID
*/
