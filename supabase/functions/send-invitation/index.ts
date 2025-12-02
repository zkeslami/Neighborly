import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 255;
const MAX_NAME_LENGTH = 100;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_LOCATION_LENGTH = 500;

interface InvitationDetails {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}

interface InvitationRequest {
  type: "friend_invite" | "event_share" | "place_share";
  recipientEmail: string;
  senderName: string;
  details?: InvitationDetails;
}

// Validate and sanitize input
function validateInput(data: unknown): { valid: boolean; error?: string; data?: InvitationRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { type, recipientEmail, senderName, details } = data as Record<string, unknown>;

  // Validate type
  const validTypes = ["friend_invite", "event_share", "place_share"];
  if (!type || typeof type !== 'string' || !validTypes.includes(type)) {
    return { valid: false, error: "Invalid invitation type" };
  }

  // Validate email
  if (!recipientEmail || typeof recipientEmail !== 'string') {
    return { valid: false, error: "Recipient email is required" };
  }
  const trimmedEmail = recipientEmail.trim().toLowerCase();
  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` };
  }
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Validate sender name
  if (!senderName || typeof senderName !== 'string') {
    return { valid: false, error: "Sender name is required" };
  }
  const trimmedName = senderName.trim();
  if (trimmedName.length === 0) {
    return { valid: false, error: "Sender name cannot be empty" };
  }
  if (trimmedName.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Sender name must be less than ${MAX_NAME_LENGTH} characters` };
  }

  // Validate details if provided
  let validatedDetails: InvitationDetails | undefined;
  if (details && typeof details === 'object') {
    const d = details as Record<string, unknown>;
    validatedDetails = {};
    
    if (d.title) {
      if (typeof d.title !== 'string') {
        return { valid: false, error: "Title must be a string" };
      }
      if (d.title.length > MAX_TITLE_LENGTH) {
        return { valid: false, error: `Title must be less than ${MAX_TITLE_LENGTH} characters` };
      }
      validatedDetails.title = d.title.trim();
    }
    
    if (d.description) {
      if (typeof d.description !== 'string') {
        return { valid: false, error: "Description must be a string" };
      }
      if (d.description.length > MAX_DESCRIPTION_LENGTH) {
        return { valid: false, error: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters` };
      }
      validatedDetails.description = d.description.trim();
    }
    
    if (d.date && typeof d.date === 'string') {
      validatedDetails.date = d.date.trim();
    }
    
    if (d.location) {
      if (typeof d.location !== 'string') {
        return { valid: false, error: "Location must be a string" };
      }
      if (d.location.length > MAX_LOCATION_LENGTH) {
        return { valid: false, error: `Location must be less than ${MAX_LOCATION_LENGTH} characters` };
      }
      validatedDetails.location = d.location.trim();
    }
  }

  return {
    valid: true,
    data: {
      type: type as InvitationRequest['type'],
      recipientEmail: trimmedEmail,
      senderName: trimmedName,
      details: validatedDetails
    }
  };
}

// Escape HTML to prevent XSS in emails
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const generateEmailContent = (type: string, senderName: string, details?: InvitationDetails) => {
  const safeSenderName = escapeHtml(senderName);
  const safeTitle = details?.title ? escapeHtml(details.title) : undefined;
  const safeDescription = details?.description ? escapeHtml(details.description) : undefined;
  const safeLocation = details?.location ? escapeHtml(details.location) : undefined;
  const safeDate = details?.date ? escapeHtml(details.date) : undefined;

  switch (type) {
    case "friend_invite":
      return {
        subject: `${safeSenderName} invited you to join Neighborly!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e85a3c; margin: 0;">🏠 Neighborly</h1>
              <p style="color: #666; font-size: 14px;">Your Social Life OS</p>
            </div>
            <h2 style="color: #333;">You've been invited!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              ${safeSenderName} wants to connect with you on Neighborly - the app that helps friends plan hangouts, share places, and stay connected.
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
        subject: `${safeSenderName} shared an event with you: ${safeTitle || 'New Event'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e85a3c; margin: 0;">🏠 Neighborly</h1>
            </div>
            <h2 style="color: #333;">📅 ${safeTitle || 'New Event'}</h2>
            ${safeDescription ? `<p style="color: #555; font-size: 16px;">${safeDescription}</p>` : ''}
            ${safeDate ? `<p style="color: #555;"><strong>When:</strong> ${safeDate}</p>` : ''}
            ${safeLocation ? `<p style="color: #555;"><strong>Where:</strong> ${safeLocation}</p>` : ''}
            <p style="color: #555; margin-top: 20px;">
              ${safeSenderName} thought you might be interested in this event!
            </p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
              Sent via Neighborly
            </p>
          </div>
        `
      };
    case "place_share":
      return {
        subject: `${safeSenderName} shared a place with you: ${safeTitle || 'Check this out'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e85a3c; margin: 0;">🏠 Neighborly</h1>
            </div>
            <h2 style="color: #333;">📍 ${safeTitle || 'A place to check out'}</h2>
            ${safeDescription ? `<p style="color: #555; font-size: 16px;">${safeDescription}</p>` : ''}
            ${safeLocation ? `<p style="color: #555;"><strong>Address:</strong> ${safeLocation}</p>` : ''}
            <p style="color: #555; margin-top: 20px;">
              ${safeSenderName} thought you'd like this place!
            </p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
              Sent via Neighborly
            </p>
          </div>
        `
      };
    default:
      return {
        subject: `Message from ${safeSenderName} via Neighborly`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e85a3c;">🏠 Neighborly</h1>
            <p>${safeSenderName} sent you a message via Neighborly.</p>
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized - no auth header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the JWT token
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    // Parse and validate input
    const rawData = await req.json();
    const validation = validateInput(rawData);
    
    if (!validation.valid || !validation.data) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, recipientEmail, senderName, details } = validation.data;
    console.log(`Sending ${type} email to ${recipientEmail} from ${senderName} (user: ${user.id})`);

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-invitation function:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Failed to send invitation" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
