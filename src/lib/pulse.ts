
// MOCK DATA GENERATOR (Vervang dit later met echte Database calls)
// Adapted from server-side code for client-side usage

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

function getMockData(projectType: string) {
    const baseUsers = projectType === 'vital' ? 5000 : 8200;
    const randomActive = Math.floor(Math.random() * 50) + 12; // 12-62 active users

    return {
        stats: {
            total_users: baseUsers + Math.floor(Math.random() * 100), // Slowly growing
            active_now: randomActive,
            page_views_24h: randomActive * 120, // Est. views
            popular_lab: projectType === 'vital' ? 'Job Matching' : 'Token Swap'
        },
        live_users: Array.from({ length: 5 }).map((_, i) => ({
            id: `user-${Date.now()}-${i}`,
            name: ['Emma', 'Liam', 'Sophie', 'Lucas', 'Noah'][i],
            email: `user${i}@example.com`,
            activity: 'Viewing Dashboard',
            location: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven'][i],
            status: 'online',
            lastSeen: new Date().toISOString()
        }))
    };
}

// Client-side API simulation
export const pulseApi = {
    getStats: async (project: string = 'generic'): Promise<PulseStats> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getMockData(project);
        return data.stats;
    },

    getLiveUsers: async (project: string = 'generic'): Promise<LiveUser[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getMockData(project);
        return data.live_users as LiveUser[];
    },

    blockUser: async (userId: string) => {
        console.log(`[BLOCKED] User ${userId} is geblokkeerd.`);
        return { success: true, message: `User ${userId} geblokkeerd.` };
    }
};
