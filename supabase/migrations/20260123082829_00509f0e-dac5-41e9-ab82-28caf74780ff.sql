-- Drop and recreate the view with security_invoker to fix the security definer issue
DROP VIEW IF EXISTS public.page_view_stats;

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