import { NextResponse } from 'next/server';

// MOCK DATA GENERATOR (Vervang dit later met echte Database calls)
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

// 1. GET /api/pulse?type=stats
// 2. GET /api/pulse?type=users
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const project = searchParams.get('project') || 'generic';

    const data = getMockData(project);

    // Endpoint 1: Stats
    if (type === 'stats') {
        return NextResponse.json(data.stats);
    }

    // Endpoint 2: Live Users
    if (type === 'live-users') {
        return NextResponse.json(data.live_users);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

// Support Blokkeer Acties (POST)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, userId } = body;

        if (action === 'block') {
            console.log(`[BLOCKED] User ${userId} is geblokkeerd.`);
            return NextResponse.json({ success: true, message: `User ${userId} geblokkeerd.` });
        }

        return NextResponse.json({ success: false, message: 'Unknown action' });
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
