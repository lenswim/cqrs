import { useMemo } from 'react';
import type { Conversation } from '../types/types';
import { type Node, type Link }  from "../pages/Social";

export interface SocialWeb {
  nodes: Node[];
  links: Link[];
}

export function useSocialWeb(conversations: Conversation[]): SocialWeb {
  return useMemo(() => {
    const nodeSet = new Set<string>();
    const linkMap = new Map<string, number>();

    // Helper to handle corrupt/joined strings
    const splitNames = (name: string): string[] => {
      return name.split(/ en | & |,/i).map(n => n.trim()).filter(n => n.length > 0);
    };

    conversations.forEach((convo) => {
      const participants = new Set<string>();

      convo.lines.forEach(line => {
        line.participants.forEach(p => {
          const individualNames = splitNames(p.name);
          individualNames.forEach(name => participants.add(name));
        });
      });

      participants.forEach(name => nodeSet.add(name));

      const participantsArray = Array.from(participants);
      
      // Create a link for every pair of participants
      for (let i = 0; i < participantsArray.length; i++) {
        for (let j = i + 1; j < participantsArray.length; j++) {
          const [a, b] = [participantsArray[i], participantsArray[j]].sort();
          const key = `${a}->${b}`;
          linkMap.set(key, (linkMap.get(key) ?? 0) + 1);
        }
      }
    });

    const nodes: Node[] = Array.from(nodeSet).map(name => ({ id: name }));

    const links: Link[] = Array.from(linkMap.entries()).map(([key, count]) => {
      const [source, target] = key.split('->');
      return { source, target, count };
    });

    return { nodes, links };
  }, [conversations]);
}

