import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Verify API key from request header
    const apiKey = req.headers.get("x-api-key");
    const expectedApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing API key" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Gather statistics
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Get premium users
    const { data: premiumData } = await supabase
      .from("profiles")
      .select("premium_tier");
    
    const premiumCount = premiumData?.filter(p => p.premium_tier === "premium" || p.premium_tier === "vip").length || 0;

    // Get active users (checked into a lab)
    const { count: activeUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .not("current_lab_id", "is", null)
      .neq("status", "invisible");

    // Get online users (last seen within 15 minutes)
    const fifteenMinutesAgo = new Date(now);
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
    
    const { count: onlineUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("last_seen", fifteenMinutesAgo.toISOString());

    // Get page views
    const { count: totalPageViews } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });

    const { count: todayPageViews } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    const { count: weekPageViews } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    // Get lab occupancy
    const { data: profiles } = await supabase
      .from("profiles")
      .select("current_lab_id")
      .not("current_lab_id", "is", null)
      .neq("status", "invisible");

    const labOccupancy: Record<string, number> = {};
    profiles?.forEach(p => {
      if (p.current_lab_id) {
        labOccupancy[p.current_lab_id] = (labOccupancy[p.current_lab_id] || 0) + 1;
      }
    });

    // Get total connections
    const { count: totalConnections } = await supabase
      .from("connections")
      .select("*", { count: "exact", head: true });

    const stats = {
      meta: {
        generated_at: now.toISOString(),
        version: "1.0.0",
        platform: "Common Ground Pulse",
      },
      users: {
        total: totalUsers || 0,
        premium: premiumCount,
        free: (totalUsers || 0) - premiumCount,
        active_in_labs: activeUsers || 0,
        online_now: onlineUsers || 0,
      },
      engagement: {
        total_connections: totalConnections || 0,
        page_views: {
          total: totalPageViews || 0,
          today: todayPageViews || 0,
          this_week: weekPageViews || 0,
        },
      },
      labs: {
        occupancy: labOccupancy,
        total_checked_in: activeUsers || 0,
      },
    };

    return new Response(JSON.stringify(stats, null, 2), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
