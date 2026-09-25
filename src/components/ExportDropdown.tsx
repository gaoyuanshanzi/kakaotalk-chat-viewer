import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileCode, FileText, Table, BookOpen } from 'lucide-react';
import type { ChatMessage } from '../types';
import { exportToHtml, exportToTxt, exportToCsv, exportToMarkdown } from '../utils/exporter';

interface ExportDropdownProps {
  messages: ChatMessage[];
  title: string;
  mySenderName?: string;
  totalFilteredCount: number;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  messages,
  title,
  mySenderName,
  totalFilteredCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type: 'html' | 'txt' | 'csv' | 'md') => {
    if (messages.length === 0) {
      alert('내보낼 대화 내역이 없습니다.');
      return;
    }

    switch (type) {
      case 'html':
        exportToHtml(messages, title, mySenderName);
        break;
      case 'txt':
        exportToTxt(messages, title);
        break;
      case 'csv':
        exportToCsv(messages, title);
        break;
      case 'md':
        exportToMarkdown(messages, title);
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={totalFilteredCount === 0}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-all hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4 text-blue-600" />
        <span>내보내기 ({totalFilteredCount}건)</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-100 z-50 overflow-hidden divide-y divide-slate-100">
          <div className="p-3 bg-slate-50/70">
            <div className="text-xs font-bold text-slate-700">다중 형식 내보내기</div>
            <div className="text-[11px] text-slate-400">필터링된 대화 내용을 원하는 형식으로 저장합니다.</div>
          </div>

          <div className="p-1.5 space-y-1">
            {/* HTML */}
            <button
              type="button"
              onClick={() => handleExport('html')}
              className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 flex items-center gap-1.5">
                  <span>HTML (.html)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded font-medium">추천</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  웹 화면과 동일한 스타일의 단일 독립형 파일
                </div>
              </div>
            </button>

            {/* TXT */}
            <button
              type="button"
              onClick={() => handleExport('txt')}
              className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">TXT (.txt)</div>
                <div className="text-[11px] text-slate-500">
                  카카오톡 원본 내보내기 형식 ("일시, 이름 : 내용")
                </div>
              </div>
            </button>

            {/* CSV */}
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50/70 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Table className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
                  CSV (.csv)
                </div>
                <div className="text-[11px] text-slate-500">
                  엑셀 분석용, 한글 깨짐 방지 UTF-8 BOM 적용
                </div>
              </div>
            </button>

            {/* Markdown */}
            <button
              type="button"
              onClick={() => handleExport('md')}
              className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-violet-50/70 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-violet-700">
                  Markdown (.md)
                </div>
                <div className="text-[11px] text-slate-500">
                  Notion 및 Obsidian 정리용 정형화 문서
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
