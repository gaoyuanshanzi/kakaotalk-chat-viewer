export interface ChatMessage {
  id: string;
  dateTimeStr: string;
  dateStr: string;
  timeStr: string;
  sender: string;
  content: string;
  isImage?: boolean;
  imageFileName?: string | null;
}

export interface DateGroup {
  date: string;
  messages: ChatMessage[];
}

export interface ParseResult {
  title: string;
  rawCount: number;
  messages: ChatMessage[];
  senders: string[];
}
