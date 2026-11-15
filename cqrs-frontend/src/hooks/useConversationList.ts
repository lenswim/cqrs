import { useState, useEffect } from "react";
import type {Conversation, Punchline} from "../types/types";
import { supabase } from "../util/supabase";


export function useConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string>>(new Set());

  const toggleLike = async (conversationId: string) => {
    if (pendingLikeIds.has(conversationId)) {
      return;
    }

    setPendingLikeIds((prev) => new Set(prev).add(conversationId));

    const target = conversations.find((conversation) => conversation.id === conversationId);
    if (!target) {
      setPendingLikeIds((prev) => {
        const next = new Set(prev);
        next.delete(conversationId);
        return next;
      });
      return;
    }

    const previouslyLiked = likedIds.has(conversationId);
    const nextLiked = !previouslyLiked;
    const currentLikes = Number(target.likes ?? 0);
    const nextLikes = Math.max(0, nextLiked ? currentLikes + 1 : currentLikes - 1);

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (nextLiked) next.add(conversationId);
      else next.delete(conversationId);
      return next;
    });

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, likes: nextLikes }
          : conversation
      )
    );

    try {
      const { error } = await supabase
        .from("conversations")
        .update({ conversation: { ...target, likes: nextLikes } })
        .eq("conversation->>id", conversationId);

      if (error) {
        throw error;
      }
    } catch (error) {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (previouslyLiked) next.add(conversationId);
        else next.delete(conversationId);
        return next;
      });
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, likes: currentLikes }
            : conversation
        )
      );
    } finally {
      setPendingLikeIds((prev) => {
        const next = new Set(prev);
        next.delete(conversationId);
        return next;
      });
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setError(null);
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("conversation->createdOn", { ascending: false })
        .overrideTypes<Conversation[]>();

      if (!mounted) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const normalized = (data ?? []).map((item) => {
        const convo = item.conversation ?? item;
        return {
          ...convo,
          likes: Number(convo.likes ?? 0),
          lines: typeof convo.lines === 'string' ? JSON.parse(convo.lines) : convo.lines
        };
      });

      console.log("Fetched conversations:", data);
      setConversations(normalized);
      setLoading(false);
    };

    fetchAll();

    const subscription = supabase
      .channel("realtime-conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        async () => {
          // guard and set loading from an external callback (allowed)
          if (!mounted) return;
          setLoading(true);
          await fetchAll();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const allParticipants = Array.from(
    new Set(
      conversations.flatMap(convo =>
        convo.lines.flatMap(line =>
          line.participants?.map(p => p.name) || []
        )
      )
    )
  ).sort((a, b) => a.localeCompare(b));

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
    allPunchlines,
    loading,
    error,
    toggleLike,
    likedIds,
    pendingLikeIds,
  };
}
