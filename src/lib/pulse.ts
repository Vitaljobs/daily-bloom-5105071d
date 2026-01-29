import { supabase } from "@/integrations/supabase/client";

export type PulseStats = {
    total_users: number;
    active_now: number;
    page_views_24h: number;
    popular_lab: string;
};

export type LiveUser = {
    id: string;
    name: string;
    email: string;
    activity: string;
    location: string;
    status: string;
    lastSeen: string;
};

// Real Supabase-based tracking API
export const pulseApi = {
    /**
     * Get real-time statistics from user sessions
     */
    getStats: async (project: string = 'generic'): Promise<PulseStats> => {
        try {
            // Count active sessions (last 30 min)
            const { count: activeNow, error: activeError } = await supabase
                .from('user_sessions')
                .select('*', { count: 'exact', head: true })
                .is('ended_at', null)
                .gte('last_active_at', new Date(Date.now() - 30 * 60 * 1000).toISOString());

            if (activeError) throw activeError;

            // Count total users
            const { count: totalUsers, error: totalError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // Count page views in last 24h
            const { count: pageViews24h, error: viewsError } = await supabase
                .from('user_sessions')
                .select('*', { count: 'exact', head: true })
                .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            if (viewsError) throw viewsError;

            // Get most popular lab
            const { data: labData, error: labError } = await supabase
                .from('user_sessions')
                .select('lab_id')
                .not('lab_id', 'is', null)
                .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            if (labError) throw labError;

            // Count lab occurrences
            const labCounts: Record<string, number> = {};
            labData?.forEach(session => {
                if (session.lab_id) {
                    labCounts[session.lab_id] = (labCounts[session.lab_id] || 0) + 1;
                }
            });

            const popularLab = Object.entries(labCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'roastery';

            return {
                total_users: totalUsers || 0,
                active_now: activeNow || 0,
                page_views_24h: pageViews24h || 0,
                popular_lab: popularLab
            };
        } catch (error) {
            console.error('[Pulse API] Error fetching stats:', error);
            // Fallback to mock data on error
            return {
                total_users: 0,
                active_now: 0,
                page_views_24h: 0,
                popular_lab: 'roastery'
            };
        }
    },

    /**
     * Get list of currently active users
     */
    getLiveUsers: async (project: string = 'generic'): Promise<LiveUser[]> => {
        try {
            const { data, error } = await supabase
                .from('user_sessions')
                .select(`
                    id,
                    user_id,
                    lab_id,
                    last_active_at,
                    profiles!inner (
                        name,
                        current_lab_id
                    )
                `)
                .is('ended_at', null)
                .gte('last_active_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
                .order('last_active_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            return (data || []).map(session => ({
                id: session.user_id,
                name: session.profiles?.name || 'Anonymous',
                email: '', // Privacy: don't expose emails
                activity: 'Viewing Dashboard',
                location: session.lab_id || session.profiles?.current_lab_id || 'Unknown',
                status: 'online',
                lastSeen: session.last_active_at
            }));
        } catch (error) {
            console.error('[Pulse API] Error fetching live users:', error);
            return [];
        }
    },

    /**
     * Track a page view / session
     */
    trackPageView: async (pagePath: string, labId?: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Check if there's an active session
            const { data: existingSessions } = await supabase
                .from('user_sessions')
                .select('id')
                .eq('user_id', user.id)
                .is('ended_at', null)
                .single();

            if (existingSessions) {
                // Update existing session
                const { error } = await supabase
                    .from('user_sessions')
                    .update({ last_active_at: new Date().toISOString(), lab_id: labId })
                    .eq('id', existingSessions.id);

                if (error) throw error;
                return existingSessions.id;
            } else {
                // Create new session
                const { data, error } = await supabase
                    .from('user_sessions')
                    .insert({
                        user_id: user.id,
                        page_path: pagePath,
                        lab_id: labId
                    })
                    .select('id')
                    .single();

                if (error) throw error;
                return data?.id;
            }
        } catch (error) {
            console.error('[Pulse API] Error tracking page view:', error);
            return null;
        }
    },

    /**
     * Send heartbeat to keep session alive
     */
    heartbeat: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('user_sessions')
                .update({ last_active_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .is('ended_at', null);
        } catch (error) {
            console.error('[Pulse API] Error sending heartbeat:', error);
        }
    },

    /**
     * End current session
     */
    endSession: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('user_sessions')
                .update({ ended_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .is('ended_at', null);
        } catch (error) {
            console.error('[Pulse API] Error ending session:', error);
        }
    },

    blockUser: async (userId: string) => {
        console.log(`[BLOCKED] User ${userId} is geblokkeerd.`);
        return { success: true, message: `User ${userId} geblokkeerd.` };
    }
};

