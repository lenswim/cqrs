import { useState } from "react";
import type { LineType, Participant } from "../types/types";
import { URL, FUNCTION_SECRET, ANON } from "../util/supabase";
import conversationSchema from "../schemas/conversationSchema";

export interface LineData {
  text: string;
  lineType: LineType;
  punchLine: boolean;
  participants: Participant[];
}

export function useConversationForm(onSuccess?: () => void, onFailure?: (message?: string) => void) {
  const [conversationDate, setConversationDate] = useState("");
  const [lines, setLines] = useState<LineData[]>([
    { text: "", lineType: "SPEECH" as LineType, punchLine: false, participants: [] },
  ]);

  const handleLineChange = (
    index: number,
    field: keyof LineData,
    value: any
  ) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addLine = () => {
    setLines((prev) => [...prev, { text: "", lineType: "SPEECH", punchLine: false, participants: [] }]);
  };

  const handleSubmit = async () => {
    const conversationData = {
      id: crypto.randomUUID(),
      conversationDate: conversationDate || "",
      createdOn: new Date().toISOString(),
      lines: lines.map(l => ({
        text: l.text,
        lineType: l.lineType,
        punchLine: l.punchLine,
        participants: l.participants.map(p => ({ name: p.name, victim: !!p.victim })),
      })),
    };

    const result = conversationSchema.safeParse(conversationData);

    if (!result.success) {
      const errors = result.error.issues
      .map(err => `${err.path.join(" → ") || "field"}: ${err.message}`)
      .join("\n");

      if (onFailure) onFailure(errors);
      return;
    }

    try {
      const res = await fetch(
        `${URL}/functions/v1/create-conversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ANON}`,
            "x-app-secret": FUNCTION_SECRET,
          },
          body: JSON.stringify(conversationData),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Server error");
      }

      onSuccess?.();
    } catch (err: any) {
      onFailure?.(err.message);
    }
  };

  return {
    conversationDate,
    setConversationDate,
    lines,
    handleLineChange,
    addLine,
    handleSubmit,
  };
}
