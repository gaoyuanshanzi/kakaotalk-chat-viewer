import React, { useMemo, useRef, useState, useEffect } from 'react';
import type { ChatMessage, DateGroup } from '../types';
import { ChatMessageItem } from './ChatMessageItem';
import { ArrowDown, ArrowUp, Calendar, Search } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  selectedSenders: Set<string>;
  mySenderName: string | null;
  searchQuery: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  selectedSenders,
  mySenderName,
  searchQuery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // 1. 참여자 필터 & 검색어 필터 적용
  const filteredMessages = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    return messages.filter((msg) => {
      // 참여자 필터
      if (!selectedSenders.has(msg.sender)) return false;
      // 검색어 필터
      if (trimmedQuery && !msg.content.toLowerCase().includes(trimmedQuery) && !msg.sender.toLowerCase().includes(trimmedQuery)) {
        return false;
      }
      return true;
    });
  }, [messages, selectedSenders, searchQuery]);

  // 2. 날짜별 그룹핑 (선택된 메시지가 있는 날짜만 헤더 생성)
  const dateGroups: DateGroup[] = useMemo(() => {
    const groups: DateGroup[] = [];
    let currentDate = '';
    let currentMsgs: ChatMessage[] = [];

    for (const msg of filteredMessages) {
      if (msg.dateStr !== currentDate) {
        if (currentMsgs.length > 0) {
          groups.push({ date: currentDate, messages: currentMsgs });
        }
        currentDate = msg.dateStr;
        currentMsgs = [msg];
      } else {
        currentMsgs.push(msg);
      }
    }

    if (currentMsgs.length > 0) {
      groups.push({ date: currentDate, messages: currentMsgs });
    }

    return groups;
  }, [filteredMessages]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollTop(scrollTop > 300);
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    handleScroll();
  }, [filteredMessages]);

  if (filteredMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Search className="w-6 h-6 text-slate-400" />
        </div>
        <div className="text-sm font-semibold text-slate-700">표시할 대화 내용이 없습니다.</div>
        <div className="text-xs text-slate-400 mt-1 max-w-xs">
          상단 참여자 필터에서 참여자를 선택하거나 검색어를 변경해 보세요.
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-0 bg-[#F8F9FA]">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-6"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {dateGroups.map((group) => (
            <div key={group.date} className="space-y-3">
              {/* 날짜 구분선 헤더 ("--- 2026년 8월 15일 ---") */}
              <div className="flex items-center justify-center my-4 select-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-xs font-medium shadow-2xs">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>--- {group.date} ---</span>
                </div>
              </div>

              {/* 해당 날짜의 메시지 목록 */}
              <div className="space-y-1">
                {group.messages.map((message) => (
                  <ChatMessageItem
                    key={message.id}
                    message={message}
                    isMine={mySenderName ? message.sender === mySenderName : false}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Scroll Controls */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-20">
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            title="맨 위로 이동"
            className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center hover:scale-105 transition-all"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            title="맨 아래로 이동"
            className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center hover:scale-105 transition-all"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
