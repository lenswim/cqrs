# How does validation work?

[Zod](https://zod.dev/) is used for validation both in the frontend and the backend.

Zod lets you define schemas describing what valid data looks like, then validate runtime data against those schemas.

The schema looks like this:

```ts
import { z } from "zod";

const participantSchema = z.object({
  name: z.string().nonempty("participant name is required"),
  victim: z.boolean().optional(),
});

const lineSchema = z.object({
  text: z.string().nonempty("line text is required"),
  lineType: z.enum(["CONTEXT", "SPEECH"]), 
  punchLine: z.boolean().optional(),
  participants: z.array(participantSchema).min(1, "line must have at least one participant")
});

const conversationSchema = z.object({
  id: z.uuid(),
  lines: z.array(lineSchema),
  createdOn: z.string(),
  conversationDate: z.string().nonempty("conversationDate is required")
});

export default conversationSchema;
```

You can use this schema to validate the data and capture the errrors:
```ts
```ts
const result = conversationSchema.safeParse(conversationData);
```
```

## Frontend

In the frontend this validation is done before submitting the new quote form.



## Backend

In the backend the same validation is added to a [Supabase Edge Function](https://supabase.com/docs/guides/functions) that saves the new quote.