import { z } from "zod";

// Participant schema
const participantSchema = z.object({
  name: z.string().nonempty("participant name is required"),
  victim: z.boolean().optional(), // optional
});

// Line schema
const lineSchema = z.object({
  text: z.string().nonempty("line text is required"),
  lineType: z.enum(["CONTEXT", "SPEECH"]), 
  punchLine: z.boolean().optional(), // optional
  participants: z.array(participantSchema).min(1, "line must have at least one participant")
});

// Main JSON schema
const conversationSchema = z.object({
  id: z.uuid(),
  lines: z.array(lineSchema),
  createdOn: z.string(), // could also parse to Date if you want
  conversationDate: z.string().nonempty("conversationDate is required")
});

export default conversationSchema;