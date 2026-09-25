import React from 'react';
import { MessageSquare, Upload, LogOut, Search, X } from 'lucide-react';
import { ExportDropdown } from './ExportDropdown';
import type { ChatMessage } from '../types';

interface HeaderProps {
  title: string;
  hasFile: boolean;
  onReset: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredMessages: ChatMessage[];
  totalRawCount: number;
  mySenderName: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  hasFile,
  onReset,
  onLogout,
  searchQuery,
  onSearchChange,
  filteredMessages,
  totalRawCount,
  mySenderName,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo and Room Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
            <MessageSquare className="w-5 h-5 fill-amber-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 truncate">
                {hasFile ? title : '카카오톡 대화 뷰어'}
              </h1>
              {hasFile && (
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                  {filteredMessages.length.toLocaleString()} / {totalRawCount.toLocaleString()}건
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {hasFile ? '화이트 모드 대화 뷰어 & 다중 포맷 내보내기' : '텍스트 파일을 업로드하여 카카오톡 대화를 시각화하세요'}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hasFile && (
            <>
              {/* Search Bar */}
              <div className="relative hidden sm:block w-48 md:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="대화 내용 검색..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Export Dropdown */}
              <ExportDropdown
                messages={filteredMessages}
                title={title}
                mySenderName={mySenderName || undefined}
                totalFilteredCount={filteredMessages.length}
              />

              {/* Reset File Button */}
              <button
                type="button"
                onClick={onReset}
                title="새 파일 업로드"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">새 파일</span>
              </button>
            </>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            title="관리자 로그아웃"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {hasFile && (
        <div className="sm:hidden px-4 pb-2.5 pt-1">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="대화 내용 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
