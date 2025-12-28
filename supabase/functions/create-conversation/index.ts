import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Reuse your schema (Note: non-standard UUID check for robustness)
const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  victim: z.boolean().optional(),
});

const lineSchema = z.object({
  text: z.string().min(1, "Text is required"),
  lineType: z.enum(["CONTEXT", "SPEECH"]),
  punchLine: z.boolean().optional(),
  participants: z.array(participantSchema).min(1),
});

const conversationSchema = z.object({
  id: z.string().uuid(),
  lines: z.array(lineSchema),
  createdOn: z.string(),
  conversationDate: z.string().min(1),
});

// Setup CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-app-secret",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Simple Secret Verification (Optional Hobby Security)
    const secret = req.headers.get("x-app-secret");
    if (secret !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const body = await req.json();

    // 2. Server-Side Validation
    const result = conversationSchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.format() }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // 3. Database Insert using Service Role (Bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase
      .from("conversations")
      .insert([{ conversation: result.data }]); // Ensure column name matches your DB

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});