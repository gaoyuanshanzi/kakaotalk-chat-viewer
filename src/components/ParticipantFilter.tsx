import React from 'react';
import { Users, CheckSquare, Square, UserCheck, Star } from 'lucide-react';

interface ParticipantFilterProps {
  senders: string[];
  selectedSenders: Set<string>;
  onToggleSender: (sender: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  senderCounts: Record<string, number>;
  mySenderName: string | null;
  onSetMySender: (sender: string | null) => void;
}

export const ParticipantFilter: React.FC<ParticipantFilterProps> = ({
  senders,
  selectedSenders,
  onToggleSender,
  onSelectAll,
  onDeselectAll,
  senderCounts,
  mySenderName,
  onSetMySender,
}) => {
  const isAllSelected = senders.length > 0 && selectedSenders.size === senders.length;

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Section Title & Select All/Deselect All buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>참여자 필터</span>
            <span className="text-[11px] text-slate-400 font-normal">
              ({selectedSenders.size}/{senders.length}명)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={onSelectAll}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
                isAllSelected
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3 h-3 text-blue-600" />
              전체 선택
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
                selectedSenders.size === 0
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Square className="w-3 h-3 text-slate-400" />
              전체 해제
            </button>
          </div>
        </div>

        {/* Right: Set 'My Message' dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1 whitespace-nowrap">
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>'내 메시지(강조)' 화자:</span>
          </span>
          <select
            value={mySenderName || ''}
            onChange={(e) => onSetMySender(e.target.value || null)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">(지정 안 함 - 전체 상대방 표시)</option>
            {senders.map((s) => (
              <option key={s} value={s}>
                {s} ({senderCounts[s] || 0}건)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Participants Chips */}
      <div className="max-w-5xl mx-auto mt-2.5 flex items-center gap-1.5 flex-wrap">
        {senders.map((sender) => {
          const isSelected = selectedSenders.has(sender);
          const isMe = mySenderName === sender;
          const count = senderCounts[sender] || 0;

          return (
            <button
              key={sender}
              type="button"
              onClick={() => onToggleSender(sender)}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                isSelected
                  ? isMe
                    ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? (isMe ? 'bg-amber-300' : 'bg-blue-400') : 'bg-slate-300'}`} />
              <span className="truncate max-w-[140px]">{sender}</span>
              {isMe && <Star className="w-3 h-3 fill-amber-300 text-amber-300 inline" />}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
