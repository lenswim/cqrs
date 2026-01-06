import { z } from "zod";

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

export default conversationSchema;