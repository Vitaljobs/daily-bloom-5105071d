import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetEmailRequest {
  email: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: ResetEmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending password reset email to: ${email}`);

    // Create Supabase admin client to generate reset link
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Generate password reset link using admin API
    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (linkError) {
      console.error("Error generating reset link:", linkError);
      return new Response(
        JSON.stringify({ error: linkError.message }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resetLink = data.properties?.action_link;
    
    if (!resetLink) {
      console.error("No action link generated");
      return new Response(
        JSON.stringify({ error: "Could not generate reset link" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Reset link generated successfully");

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Common Ground <onboarding@resend.dev>",
      to: [email],
      subject: "Reset je wachtwoord - Common Ground",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B4513; margin: 0;">☕ Common Ground</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Wachtwoord resetten</h2>
          
          <p>Hallo,</p>
          
          <p>Je hebt gevraagd om je wachtwoord te resetten. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #8B4513; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Nieuw wachtwoord instellen
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Of kopieer deze link naar je browser:<br>
            <a href="${resetLink}" style="color: #8B4513; word-break: break-all;">${resetLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Als je deze email niet hebt aangevraagd, kun je hem veilig negeren.<br>
            Deze link is 24 uur geldig.
          </p>
        </body>
        </html>
      `,
    });

    console.log("Resend response:", JSON.stringify(emailResponse));

    // Check for Resend errors
    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      
      // Handle domain verification error specifically
      if (emailResponse.error.message?.includes("verify a domain")) {
        return new Response(
          JSON.stringify({ 
            error: "Email kon niet verstuurd worden. Resend vereist een geverifieerd domein om naar dit adres te sturen." 
          }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: emailResponse.error.message }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Reset email sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-reset-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
