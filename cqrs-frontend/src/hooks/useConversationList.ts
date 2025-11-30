import { useState, useEffect } from "react";
import type {Conversation, Punchline} from "../types/types";

export function useConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  useEffect(() => {


      const API_BASE_URL = import.meta.env.VITE_API_URL;

      fetch(`${API_BASE_URL}/conversations`)
          .then(response => response.json())
          .then(data => setConversations(data))
          .catch(error => {
              console.error("Failed to fetch conversations:", error);
          });



      // Stubbed response instead of fetch - would be replaced with actual API call
    // setConversations([
    //   {
    //     id: "1",
    //     conversationDate: "2025-11-15",
    //     createdOn: "2025-11-15T19:47:37",
    //     lines: [
    //       {
    //         punchLine: false,
    //         lineType: "CONTEXT",
    //         text: "Kevin moet geopereerd worden aan zijn sinussen.",
    //         participants: [],
    //       },
    //       {
    //         punchLine: false,
    //         lineType: "SPEECH",
    //         text: "Kevin moet geopereerd worden ofwa?",
    //         participants: [{ victim: false, name: "Ann" }],
    //       },
    //       {
    //         punchLine: true,
    //         lineType: "SPEECH",
    //         text: "Ja, ze gaan zn kop amputeren!",
    //         participants: [{ victim: false, name: "Wim" }],
    //       }
    //     ]
    //   },
    //   {
    //     id: "2",
    //     conversationDate: "2024-11-15",
    //     createdOn: "2024-11-15T19:47:37",
    //     lines: [
    //       {
    //         punchLine: false,
    //         lineType: "SPEECH",
    //         text: "Wat is een beer?",
    //         participants: [{ victim: false, name: "Tim" }],
    //       },
    //       {
    //         punchLine: true,
    //         lineType: "SPEECH",
    //         text: "Dat is zoals nen hond, maar echt veel groter",
    //         participants: [{ victim: false, name: "Wim" }],
    //       }
    //     ]
    //   }
    // ]);
  }, []);

  const allParticipants = Array.from(
    new Set(
      conversations.flatMap(convo =>
        convo.lines.flatMap(line =>
          line.participants?.map(p => p.name) || []
        )
      )
    )
  );

  const allPunchlines : Punchline[] = Array.from(
      new Set(
          conversations
              .flatMap(convo => convo.lines)
              .filter(line => line.punchLine)
              .map(line => ({
                  text: line.text,
                  author: line.participants?.[0]?.name ?? ""
              }))
      )
  );

  const allYears = Array.from(
    new Set(
      conversations.map(convo =>
        new Date(convo.conversationDate).getFullYear()
      )
    )
  ).sort((a, b) => b - a); // Sort years descending (newest first)

  const filteredConversations = conversations.filter(convo => {
    const participantMatch = selectedParticipants.length === 0 ||
      convo.lines.some(line =>
        line.participants?.some(p => selectedParticipants.includes(p.name))
      );

    const yearMatch = selectedYears.length === 0 ||
      selectedYears.includes(new Date(convo.conversationDate).getFullYear());

    return participantMatch && yearMatch;
  });

  const toggleParticipantFilter = (name: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedParticipants([...selectedParticipants, name]);
    } else {
      setSelectedParticipants(selectedParticipants.filter(p => p !== name));
    }
  };

  const toggleYearFilter = (year: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedYears([...selectedYears, year]);
    } else {
      setSelectedYears(selectedYears.filter(y => y !== year));
    }
  };

  const clearFilters = () => {
    setSelectedParticipants([]);
    setSelectedYears([]);
  };

  return {
    conversations: filteredConversations,
    allParticipants,
    allYears,
    selectedParticipants,
    selectedYears,
    toggleParticipantFilter,
    toggleYearFilter,
    clearFilters,
      allPunchlines
  };
}
