import { useState } from "react";
import type { LineType, Participant } from "../types/types";
import { supabase } from "../util/supabase";

export interface LineData {
  text: string;
  lineType: LineType;
  punchLine: boolean;
  participants: Participant[];
}

export function useConversationForm(onSuccess?: () => void) {
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
      conversationDate: conversationDate || null,
      createdOn: new Date().toISOString(),
      lines: lines.map(l => ({
        text: l.text,
        lineType: l.lineType,
        punchLine: l.punchLine,
        participants: l.participants.map(p => ({ name: p.name, victim: !!p.victim })),
      })),
    };

    try {
      const { error } = await supabase
        .from("conversations")
        .insert([{ conversation: conversationData }]);

      if (error) {
        throw new Error(error.message);
      }

      console.log("created", conversationData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("submit failed", err);
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
