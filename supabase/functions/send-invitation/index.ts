import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  type: "friend_invite" | "event_share" | "place_share";
  recipientEmail: string;
  senderName: string;
  details?: {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
  };
}

const generateEmailContent = (type: string, senderName: string, details?: InvitationRequest['details']) => {
  switch (type) {
    case "friend_invite":
      return {
        subject: `${senderName} invited you to join Neighborly!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e85a3c; margin: 0;">🏠 Neighborly</h1>
              <p style="color: #666; font-size: 14px;">Your Social Life OS</p>
            </div>
            <h2 style="color: #333;">You've been invited!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              ${senderName} wants to connect with you on Neighborly - the app that helps friends plan hangouts, share places, and stay connected.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://neighborly.lovable.app" style="background-color: #e85a3c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Join Neighborly
              </a>
            </div>
            <p style="color: #888; font-size: 12px; text-align: center;">
              Sent via Neighborly
            </p>
          </div>
        `
      };
    case "event_share":
      return {
        subject: `${senderName} shared an event with you: ${details?.title || 'New Event'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e85a3c; margin: 0;">🏠 Neighborly</h1>
            </div>
            <h2 style="color: #333;">📅 ${details?.title || 'New Event'}</h2>
            ${details?.description ? `<p style="color: #555; font-size: 16px;">${details.description}</p>` : ''}
            ${details?.date ? `<p style="color: #555;"><strong>When:</strong> ${details.date}</p>` : ''}
            ${details?.location ? `<p style="color: #555;"><strong>Where:</strong> ${details.location}</p>` : ''}
            <p style="color: #555; margin-top: 20px;">
              ${senderName} thought you might be interested in this event!
            </p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
              Sent via Neighborly
            </p>
          </div>
        `
      };
    case "place_share":
      return {
        subject: `${senderName} shared a place with you: ${details?.title || 'Check this out'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e85a3c; margin: 0;">🏠 Neighborly</h1>
            </div>
            <h2 style="color: #333;">📍 ${details?.title || 'A place to check out'}</h2>
            ${details?.description ? `<p style="color: #555; font-size: 16px;">${details.description}</p>` : ''}
            ${details?.location ? `<p style="color: #555;"><strong>Address:</strong> ${details.location}</p>` : ''}
            <p style="color: #555; margin-top: 20px;">
              ${senderName} thought you'd like this place!
            </p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
              Sent via Neighborly
            </p>
          </div>
        `
      };
    default:
      return {
        subject: `Message from ${senderName} via Neighborly`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e85a3c;">🏠 Neighborly</h1>
            <p>${senderName} sent you a message via Neighborly.</p>
          </div>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-invitation function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipientEmail, senderName, details }: InvitationRequest = await req.json();
    
    console.log(`Sending ${type} email to ${recipientEmail} from ${senderName}`);

    if (!recipientEmail || !senderName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subject, html } = generateEmailContent(type, senderName, details);

    const emailResponse = await resend.emails.send({
      from: "Neighborly <onboarding@resend.dev>",
      to: [recipientEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
