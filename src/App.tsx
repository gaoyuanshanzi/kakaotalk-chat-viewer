import { useState, useEffect, useMemo } from 'react';
import { LoginModal } from './components/LoginModal';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ParticipantFilter } from './components/ParticipantFilter';
import { ChatView } from './components/ChatView';
import { parseKakaoTalkText } from './utils/parser';
import type { ParseResult } from './types';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  const [selectedSenders, setSelectedSenders] = useState<Set<string>>(new Set());
  const [mySenderName, setMySenderName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check initial authentication state
  useEffect(() => {
    const auth = sessionStorage.getItem('kakaoviewer_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kakaoviewer_auth');
    setIsAuthenticated(false);
  };

  // 파일 업로드 시 파싱 처리
  const handleFileLoaded = (text: string, fileName: string) => {
    const result = parseKakaoTalkText(text, fileName);
    setParsedData(result);
    // 기본적으로 모든 참여자 선택
    setSelectedSenders(new Set(result.senders));
    // 첫 번째 참여자 또는 참여자 목록에서 기본값 설정
    setMySenderName(null);
    setSearchQuery('');
  };

  // 초기화 (새 파일 업로드)
  const handleReset = () => {
    if (window.confirm('현재 대화 내용을 닫고 새 파일을 업로드하시겠습니까?')) {
      setParsedData(null);
      setSelectedSenders(new Set());
      setMySenderName(null);
      setSearchQuery('');
    }
  };

  // 참여자별 메시지 수 계산
  const senderCounts = useMemo(() => {
    if (!parsedData) return {};
    const counts: Record<string, number> = {};
    for (const msg of parsedData.messages) {
      counts[msg.sender] = (counts[msg.sender] || 0) + 1;
    }
    return counts;
  }, [parsedData]);

  // 참여자 토글
  const handleToggleSender = (sender: string) => {
    setSelectedSenders((prev) => {
      const next = new Set(prev);
      if (next.has(sender)) {
        next.delete(sender);
      } else {
        next.add(sender);
      }
      return next;
    });
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (parsedData) {
      setSelectedSenders(new Set(parsedData.senders));
    }
  };

  // 전체 해제
  const handleDeselectAll = () => {
    setSelectedSenders(new Set());
  };

  // 필터링된 메시지 목록 계산
  const filteredMessages = useMemo(() => {
    if (!parsedData) return [];
    const trimmed = searchQuery.trim().toLowerCase();
    return parsedData.messages.filter((msg) => {
      if (!selectedSenders.has(msg.sender)) return false;
      if (trimmed && !msg.content.toLowerCase().includes(trimmed) && !msg.sender.toLowerCase().includes(trimmed)) {
        return false;
      }
      return true;
    });
  }, [parsedData, selectedSenders, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-800">
      {/* 1. 관리자 인증 모달 */}
      {!isAuthenticated && <LoginModal onLoginSuccess={handleLoginSuccess} />}

      {/* 2. 상단 헤더 */}
      <Header
        title={parsedData?.title || '카카오톡 대화 뷰어'}
        hasFile={!!parsedData}
        onReset={handleReset}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredMessages={filteredMessages}
        totalRawCount={parsedData?.rawCount || 0}
        mySenderName={mySenderName}
      />

      {/* 3. 본문 영역 */}
      <main className="flex-1 flex flex-col min-h-0">
        {!parsedData ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <FileUpload onFileLoaded={handleFileLoaded} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* 상단 참여자 필터바 */}
            <ParticipantFilter
              senders={parsedData.senders}
              selectedSenders={selectedSenders}
              onToggleSender={handleToggleSender}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              senderCounts={senderCounts}
              mySenderName={mySenderName}
              onSetMySender={setMySenderName}
            />

            {/* 채팅 화면 */}
            <ChatView
              messages={parsedData.messages}
              selectedSenders={selectedSenders}
              mySenderName={mySenderName}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
