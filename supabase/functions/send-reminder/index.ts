import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Event {
  id: string;
  title: string;
  date: string;
  location_name: string | null;
  workout_url: string | null;
  user_id: string;
  reminder_sent_24h: boolean;
  reminder_sent_1h: boolean;
}

interface Profile {
  email: string;
  name: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    // Find events needing 24h reminder
    const { data: events24h, error: error24h } = await supabase
      .from("events")
      .select("*")
      .eq("reminder_sent_24h", false)
      .gte("date", now.toISOString())
      .lte("date", in24Hours.toISOString());

    if (error24h) {
      console.error("Error fetching 24h events:", error24h);
    }

    // Find events needing 1h reminder
    const { data: events1h, error: error1h } = await supabase
      .from("events")
      .select("*")
      .eq("reminder_sent_1h", false)
      .gte("date", now.toISOString())
      .lte("date", in1Hour.toISOString());

    if (error1h) {
      console.error("Error fetching 1h events:", error1h);
    }

    const sentReminders: string[] = [];

    // Process 24h reminders
    for (const event of (events24h as Event[]) || []) {
      if (!event.user_id) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", event.user_id)
        .single();

      if (!profile?.email) continue;

      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      try {
        await resend.emails.send({
          from: "Neighborly <onboarding@resend.dev>",
          to: [profile.email],
          subject: `Reminder: ${event.title} is tomorrow!`,
          html: `
            <h1>Event Reminder</h1>
            <p>Hi ${profile.name || "there"},</p>
            <p>Just a friendly reminder that you have an upcoming event:</p>
            <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h2 style="margin: 0 0 8px 0;">${escapeHtml(event.title)}</h2>
              <p style="margin: 0 0 4px 0;"><strong>When:</strong> ${formattedDate}</p>
              ${event.location_name ? `<p style="margin: 0 0 4px 0;"><strong>Where:</strong> ${escapeHtml(event.location_name)}</p>` : ""}
              ${event.workout_url ? `<p style="margin: 0;"><a href="${escapeHtml(event.workout_url)}">View Workout</a></p>` : ""}
            </div>
            <p>Have a great time!</p>
            <p>- The Neighborly Team</p>
          `,
        });

        await supabase
          .from("events")
          .update({ reminder_sent_24h: true })
          .eq("id", event.id);

        sentReminders.push(`24h: ${event.title} -> ${profile.email}`);
        console.log(`Sent 24h reminder for event ${event.id} to ${profile.email}`);
      } catch (emailError) {
        console.error(`Failed to send 24h reminder for event ${event.id}:`, emailError);
      }
    }

    // Process 1h reminders
    for (const event of (events1h as Event[]) || []) {
      if (!event.user_id) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", event.user_id)
        .single();

      if (!profile?.email) continue;

      const eventDate = new Date(event.date);
      const formattedTime = eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

      try {
        await resend.emails.send({
          from: "Neighborly <onboarding@resend.dev>",
          to: [profile.email],
          subject: `Starting soon: ${event.title} at ${formattedTime}`,
          html: `
            <h1>Your Event is Starting Soon!</h1>
            <p>Hi ${profile.name || "there"},</p>
            <p><strong>${escapeHtml(event.title)}</strong> is starting in about an hour!</p>
            ${event.location_name ? `<p><strong>Location:</strong> ${escapeHtml(event.location_name)}</p>` : ""}
            ${event.workout_url ? `<p><a href="${escapeHtml(event.workout_url)}">Open Workout</a></p>` : ""}
            <p>See you there!</p>
            <p>- The Neighborly Team</p>
          `,
        });

        await supabase
          .from("events")
          .update({ reminder_sent_1h: true })
          .eq("id", event.id);

        sentReminders.push(`1h: ${event.title} -> ${profile.email}`);
        console.log(`Sent 1h reminder for event ${event.id} to ${profile.email}`);
      } catch (emailError) {
        console.error(`Failed to send 1h reminder for event ${event.id}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: sentReminders.length,
        details: sentReminders,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

serve(handler);
