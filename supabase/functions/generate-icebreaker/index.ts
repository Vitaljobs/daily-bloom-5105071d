import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userSkills, partnerSkills, partnerName, language = "nl" } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Find shared and unique skills
    const userSet = new Set(userSkills.map((s: string) => s.toLowerCase()));
    const partnerSet = new Set(partnerSkills.map((s: string) => s.toLowerCase()));
    
    const sharedSkills: string[] = [];
    userSkills.forEach((skill: string) => {
      if (partnerSet.has(skill.toLowerCase())) {
        sharedSkills.push(skill);
      }
    });

    const systemPrompt = language === "nl" 
      ? `Je bent een vriendelijke netwerkassistent voor Common Ground, een premium koffiebar voor professionals. 
         Genereer een warme, persoonlijke ijsbreker om een gesprek te starten.
         Wees specifiek over de gedeelde interesses maar niet te formeel.
         Houd het kort (max 2 zinnen) en eindig met een uitnodigende vraag.
         Antwoord alleen met de ijsbreker tekst, geen extra uitleg.`
      : `You are a friendly networking assistant for Common Ground, a premium coffee bar for professionals.
         Generate a warm, personal icebreaker to start a conversation.
         Be specific about shared interests but not too formal.
         Keep it short (max 2 sentences) and end with an inviting question.
         Reply only with the icebreaker text, no extra explanation.`;

    const userPrompt = language === "nl"
      ? `Maak een ijsbreker voor een gesprek met ${partnerName}.
         Mijn skills: ${userSkills.join(", ")}
         Hun skills: ${partnerSkills.join(", ")}
         Gedeelde skills: ${sharedSkills.length > 0 ? sharedSkills.join(", ") : "geen directe overlap"}`
      : `Create an icebreaker for a conversation with ${partnerName}.
         My skills: ${userSkills.join(", ")}
         Their skills: ${partnerSkills.join(", ")}
         Shared skills: ${sharedSkills.length > 0 ? sharedSkills.join(", ") : "no direct overlap"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const icebreaker = data.choices?.[0]?.message?.content || "";

    // Also generate 3 topic suggestions
    const topicsPrompt = language === "nl"
      ? `Genereer precies 3 korte gespreksvragen (max 15 woorden elk) gebaseerd op deze gedeelde interesses: ${sharedSkills.length > 0 ? sharedSkills.join(", ") : userSkills.slice(0, 3).join(", ")}.
         Format: Een vraag per regel, geen nummering.`
      : `Generate exactly 3 short conversation questions (max 15 words each) based on these shared interests: ${sharedSkills.length > 0 ? sharedSkills.join(", ") : userSkills.slice(0, 3).join(", ")}.
         Format: One question per line, no numbering.`;

    const topicsResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: topicsPrompt },
        ],
      }),
    });

    let topics: string[] = [];
    if (topicsResponse.ok) {
      const topicsData = await topicsResponse.json();
      const topicsText = topicsData.choices?.[0]?.message?.content || "";
      topics = topicsText.split("\n").filter((t: string) => t.trim()).slice(0, 3);
    }

    return new Response(
      JSON.stringify({ 
        icebreaker, 
        topics,
        sharedSkills 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate icebreaker error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
