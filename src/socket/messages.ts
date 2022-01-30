export const enum SocketMessageType {
    ShowSpeechBubble,
    HideSpeechBubble
}

export interface ShowSpeechBubbleMessage {
    type: SocketMessageType.ShowSpeechBubble;
    userID: string;
    tokenID: string;
    sceneID: string;
}

export interface HideSpeechBubbleMessage {
    type: SocketMessageType.HideSpeechBubble;
    userID: string;
    sceneID: string;
}

export type SocketMessage = ShowSpeechBubbleMessage | HideSpeechBubbleMessage;