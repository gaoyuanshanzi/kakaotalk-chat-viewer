import React, { useState } from 'react';
import type { ChatMessage } from '../types';
import { Image as ImageIcon, Copy, Check, ExternalLink } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  isMine: boolean;
  searchQuery?: string;
}

// 참여자 이름별 일관된 파스텔 아바타 배경색 생성
const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
];

function getSenderColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isMine,
  searchQuery,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // URL 링크 변환 및 텍스트 렌더링
  const renderContent = (content: string) => {
    // 이미지 파일명 또는 안내 문구인 경우 카드 형태 렌더링
    if (message.isImage) {
      return (
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/90 rounded-xl my-1 max-w-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-700 truncate">
              {message.imageFileName || '사진/이미지 파일'}
            </div>
            <div className="text-[11px] text-slate-400">카카오톡 미디어 파일 안내</div>
          </div>
        </div>
      );
    }

    // URL 정규식
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return (
      <div className="whitespace-pre-wrap break-words leading-relaxed text-[14.5px]">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700 underline font-medium hover:bg-blue-50/50 px-1 py-0.5 rounded transition-colors break-all"
              >
                <span>{part}</span>
                <ExternalLink className="w-3 h-3 inline-block shrink-0" />
              </a>
            );
          }

          // 검색어 하이라이트
          if (searchQuery && searchQuery.trim() !== '') {
            const queryRegex = new RegExp(`(${searchQuery})`, 'gi');
            const searchParts = part.split(queryRegex);
            return (
              <React.Fragment key={index}>
                {searchParts.map((subPart, subIdx) =>
                  subPart.toLowerCase() === searchQuery.toLowerCase() ? (
                    <mark key={subIdx} className="bg-amber-200 text-amber-900 rounded px-0.5">
                      {subPart}
                    </mark>
                  ) : (
                    subPart
                  )
                )}
              </React.Fragment>
            );
          }

          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </div>
    );
  };

  const senderInitial = message.sender.trim().charAt(0) || 'U';
  const avatarColorClass = getSenderColor(message.sender);

  return (
    <div
      className={`group flex gap-2.5 py-1.5 transition-colors ${
        isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* 상대방 아바타 */}
      {!isMine && (
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border ${avatarColorClass} shadow-2xs mt-0.5`}
          title={message.sender}
        >
          {senderInitial}
        </div>
      )}

      {/* 메시지 영역 */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
        {/* 상대방일 때만 발신자 이름 표시 */}
        {!isMine && (
          <div className="text-[12.5px] font-semibold text-slate-700 mb-1 ml-0.5 tracking-tight">
            {message.sender}
          </div>
        )}

        {/* 말풍선과 시간 & 복사 버튼 */}
        <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* 말풍선 본체 */}
          <div
            className={`relative px-3.5 py-2.5 rounded-2xl shadow-xs transition-shadow ${
              isMine
                ? 'bg-blue-50/90 text-slate-900 border border-blue-200/90 rounded-tr-xs'
                : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs hover:border-slate-300'
            }`}
          >
            {renderContent(message.content)}
          </div>

          {/* 발신 시간 및 액션 */}
          <div className="flex flex-col justify-end text-[11px] text-slate-400 select-none shrink-0 mb-0.5">
            <div className="flex items-center gap-1">
              <span className="tabular-nums">{message.timeStr}</span>
              <button
                type="button"
                onClick={handleCopy}
                title="메시지 내용 복사"
                className="opacity-0 group-hover:opacity-100 hover:text-slate-600 p-0.5 rounded transition-opacity"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
