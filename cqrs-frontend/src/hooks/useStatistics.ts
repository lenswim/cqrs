import { useMemo } from 'react';
import type { Conversation } from '../types/types';

export interface Statistics {
  totalConversations: number;
  totalPunchlines: number;
  participantStats: Array<{
    name: string;
    punchlineCount: number;
    victimCount: number;
    appearanceCount: number;
  }>;
  yearStats: Array<{
    year: number;
    count: number;
  }>;
  topPunchlineDeliverer: { name: string; count: number } | null;
  mostVictimized: { name: string; count: number } | null;
}

export function useStatistics(conversations: Conversation[]): Statistics {
  return useMemo(() => {
    const participantMap = new Map<string, {
      punchlineCount: number;
      victimCount: number;
      appearanceCount: number;
    }>();

    const yearMap = new Map<number, number>();

    let totalPunchlines = 0;

    conversations.forEach(convo => {
      const year = new Date(convo.conversationDate).getFullYear();
      yearMap.set(year, (yearMap.get(year) || 0) + 1);

      convo.lines.forEach(line => {
        if (line.punchLine) {
          totalPunchlines++;
        }

        line.participants?.forEach(participant => {
          if (!participantMap.has(participant.name)) {
            participantMap.set(participant.name, {
              punchlineCount: 0,
              victimCount: 0,
              appearanceCount: 0,
            });
          }

          const stats = participantMap.get(participant.name)!;
          stats.appearanceCount++;

          if (line.punchLine && line.lineType === 'SPEECH') {
            stats.punchlineCount++;
          }

          if (participant.victim) {
            stats.victimCount++;
          }
        });
      });
    });

    const participantStats = Array.from(participantMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.punchlineCount - a.punchlineCount);

    const yearStats = Array.from(yearMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year);

    const topPunchlineDeliverer = participantStats.length > 0
      ? { name: participantStats[0].name, count: participantStats[0].punchlineCount }
      : null;

    const victimStats = participantStats
      .filter(p => p.victimCount > 0)
      .sort((a, b) => b.victimCount - a.victimCount);

    const mostVictimized = victimStats.length > 0
      ? { name: victimStats[0].name, count: victimStats[0].victimCount }
      : null;

    return {
      totalConversations: conversations.length,
      totalPunchlines,
      participantStats,
      yearStats,
      topPunchlineDeliverer,
      mostVictimized,
    };
  }, [conversations]);
}

