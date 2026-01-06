import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const participantSchema = z.object({
  name: z.string().nonempty("participant name is required"),
  victim: z.boolean().optional(),
});

const lineSchema = z.discriminatedUnion("lineType", [
  z.object({
    lineType: z.literal("CONTEXT"),
    text: z.string().nonempty("line text is required"),
    punchLine: z.boolean().optional(),
    participants: z.array(participantSchema).max(0).optional(),
  }),
  
  z.object({
    lineType: z.literal("SPEECH"),
    text: z.string().nonempty("line text is required"),
    punchLine: z.boolean().optional(),
    participants: z.array(participantSchema).min(1, "line must have at least one participant")
  })
]);

const conversationSchema = z.object({
  id: z.uuid(),
  lines: z.array(lineSchema),
  createdOn: z.string(),
  conversationDate: z.string().nonempty("conversation date is required")
});

// Setup CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-app-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {

    const body = await req.json();

    
    const result = conversationSchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.format() }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase
      .from("conversations")
      .insert([{ conversation: result.data }]);

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