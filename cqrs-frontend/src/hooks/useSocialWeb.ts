import { useMemo } from 'react';
import type { Conversation, Line } from '../types/types';
import { type Node, type Link }  from "../pages/Social";

export interface SocialWeb {
  nodes: Node[];
  links: Link[];
}

export function useSocialWeb(conversations: Conversation[]): SocialWeb {
  return useMemo(() => {
    const nodeSet = new Set<string>();
    const linkMap = new Map<string, number>();

    conversations.forEach((convo) => {
        // Collect all participants in the conversation
        const participants = new Set<string>();
        convo.lines.forEach(line => line.participants.forEach(p => participants.add(p.name)));

        // Add all participants to the node set
        participants.forEach(name => nodeSet.add(name));

        const participantsArray = Array.from(participants);
        // Create a link for every pair of participants in the conversation
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

