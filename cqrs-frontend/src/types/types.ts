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
    conversationDate: string; // ISO date string
    createdOn: string;        // ISO datetime string
    lines: Line[];
}

export interface Punchline {
    text: string;
    author: string;
}
