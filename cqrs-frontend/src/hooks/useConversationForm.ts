import { useState } from "react";
import type { LineType, Participant } from "../types/types";

export interface LineData {
  text: string;
  lineType: LineType;
  punchLine: boolean;
  participants: Participant[];
}

export function useConversationForm() {
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

  const handleSubmit = () => {
    const payload = { conversationDate, lines };
    console.log("Submitting:", payload);
    // TODO: send to backend
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
