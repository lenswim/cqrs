export interface Participant {
    name: string;
    victim: boolean;
}

export type LineType = "SPEECH" | "CONTEXT";

export interface Line {
    text: string;
    punchLine: boolean;
    lineType: LineType;
    participants: Participant[];
}

export interface Conversation {
    id: string;
    dbId?: string;
    conversationDate: string; // ISO date string
    createdOn: string;        // ISO datetime string
    likes: number;
    lines: Line[];
}

export interface Punchline {
    text: string;
    author: string;
}
