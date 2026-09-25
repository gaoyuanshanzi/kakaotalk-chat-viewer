import type { ChatMessage, ParseResult } from '../types';

// 이미지 파일 확장자 정규식
const IMAGE_EXTENSION_REGEX = /^(.+?\.(jpg|jpeg|png|gif|webp|bmp|heic))$/i;
const KAKAO_IMAGE_NOTICE_REGEX = /^(사진|동영상|음성메시지|파일|이모티콘)$/i;

export function isImageContent(content: string): { isImage: boolean; fileName: string | null } {
  const trimmed = content.trim();
  const fileMatch = trimmed.match(IMAGE_EXTENSION_REGEX);
  if (fileMatch) {
    return { isImage: true, fileName: fileMatch[1] };
  }
  if (KAKAO_IMAGE_NOTICE_REGEX.test(trimmed)) {
    return { isImage: true, fileName: trimmed };
  }
  return { isImage: false, fileName: null };
}

/**
 * 카카오톡 .txt 파일 내용 파싱
 * 정규식: /^(\d{4}년\s\d{1,2}월\s\d{1,2}일\s(?:오전|오후)\s\d{1,2}:\d{2}),\s*([^:]+?)\s*:\s*(.*)/
 */
export function parseKakaoTalkText(rawText: string, defaultTitle = '카카오톡 대화'): ParseResult {
  // Normalize line endings
  const lines = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const MESSAGE_HEADER_REGEX = /^(\d{4}년\s\d{1,2}월\s\d{1,2}일\s(?:오전|오후)\s\d{1,2}:\d{2}),\s*([^:]+?)\s*:\s*(.*)/;
  const DATE_SPLIT_REGEX = /^(\d{4}년\s\d{1,2}월\s\d{1,2}일)\s(.*)$/;

  const messages: ChatMessage[] = [];
  const sendersSet = new Set<string>();
  let currentMessage: ChatMessage | null = null;
  let parsedTitle = defaultTitle;

  // 상단 안내 줄에서 대화방 이름 추출 시도
  // 예: "XXX 님과 카카오톡 대화", "카카오톡 대화" 등
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    if (line.includes('카카오톡 대화') || line.includes('대화방')) {
      parsedTitle = line;
      break;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(MESSAGE_HEADER_REGEX);

    if (match) {
      // 새로운 메시지 시작
      const dateTimeStr = match[1].trim();
      const sender = match[2].trim();
      const content = match[3];

      // 일시에서 날짜, 시간 분리
      const dateSplit = dateTimeStr.match(DATE_SPLIT_REGEX);
      const dateStr = dateSplit ? dateSplit[1] : dateTimeStr;
      const timeStr = dateSplit ? dateSplit[2] : '';

      const { isImage, fileName } = isImageContent(content);

      const msg: ChatMessage = {
        id: `msg-${messages.length + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        dateTimeStr,
        dateStr,
        timeStr,
        sender,
        content,
        isImage,
        imageFileName: fileName,
      };

      messages.push(msg);
      sendersSet.add(sender);
      currentMessage = msg;
    } else {
      // 정규식에 일치하지 않는 줄
      if (currentMessage) {
        // 이전 메시지 본문에 줄바꿈과 함께 병합
        currentMessage.content += '\n' + line;
        // 여러 줄로 늘어났을 때 이미지 여부 재판단
        const { isImage, fileName } = isImageContent(currentMessage.content);
        currentMessage.isImage = isImage;
        currentMessage.imageFileName = fileName;
      }
    }
  }

  return {
    title: parsedTitle,
    rawCount: messages.length,
    messages,
    senders: Array.from(sendersSet),
  };
}
