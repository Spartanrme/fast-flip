export const enum SocketMessageType {
    ShowSpeechBubble,
    HideSpeechBubble
}

export interface ShowSpeechBubbleMessage {
    type: SocketMessageType.ShowSpeechBubble;
    tokenID: string;
    sceneID: string;
}

export interface HideSpeechBubbleMessage {
    type: SocketMessageType.HideSpeechBubble;
    tokenID: string;
    sceneID: string;
}

export type SocketMessage = ShowSpeechBubbleMessage | HideSpeechBubbleMessage;