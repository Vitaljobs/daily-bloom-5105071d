-- Enable realtime for profiles table so premium status updates are reflected immediately
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;