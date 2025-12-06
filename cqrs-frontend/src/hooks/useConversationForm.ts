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

  const handleSubmit = async () => {
    const payload = {
      conversationDate: conversationDate || null,
      lines: lines.map(l => ({
        text: l.text,
        lineType: l.lineType,
        punchLine: l.punchLine,
        participants: l.participants.map(p => ({ name: p.name, victim: !!p.victim })),
      })),
    };

    try {
      const base = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:8080";
      const res = await fetch(`${base}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      const created = await res.json();
      console.log("created", created);
      // reset if desired
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
