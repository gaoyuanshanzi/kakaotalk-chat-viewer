import type { ChatMessage } from '../types';

/**
 * 텍스트 다운로드 헬퍼
 */
export function downloadFile(content: string | Blob, fileName: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * ① HTML 내보내기 (독립형 Standalone HTML)
 */
export function exportToHtml(messages: ChatMessage[], title: string, mySenderName?: string) {
  // 날짜별 그룹핑
  const groupedByDate: { date: string; messages: ChatMessage[] }[] = [];
  let currentDate = '';
  let currentGroup: ChatMessage[] = [];

  for (const msg of messages) {
    if (msg.dateStr !== currentDate) {
      if (currentGroup.length > 0) {
        groupedByDate.push({ date: currentDate, messages: currentGroup });
      }
      currentDate = msg.dateStr;
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  }
  if (currentGroup.length > 0) {
    groupedByDate.push({ date: currentDate, messages: currentGroup });
  }

  // URL 링크 변환 및 HTML escape 함수
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatMessageBody = (content: string, isImage?: boolean, fileName?: string | null) => {
    if (isImage) {
      return `
        <div class="image-box">
          <svg class="img-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>[사진/이미지: ${escapeHtml(fileName || content.trim())}]</span>
        </div>
      `;
    }

    const escaped = escapeHtml(content);
    // URL 감지
    const withLinks = escaped.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="link">$1</a>'
    );
    return withLinks.replace(/\n/g, '<br/>');
  };

  let chatHtml = '';
  for (const group of groupedByDate) {
    chatHtml += `
      <div class="date-divider">
        <span class="date-badge">--- ${escapeHtml(group.date)} ---</span>
      </div>
    `;

    for (const msg of group.messages) {
      const isMine = mySenderName && msg.sender === mySenderName;
      chatHtml += `
        <div class="msg-wrapper ${isMine ? 'mine' : 'other'}">
          <div class="msg-container">
            ${!isMine ? `<div class="sender-name">${escapeHtml(msg.sender)}</div>` : ''}
            <div class="bubble-row">
              <div class="bubble ${isMine ? 'bubble-mine' : 'bubble-other'}">
                ${formatMessageBody(msg.content, msg.isImage, msg.imageFileName)}
              </div>
              <div class="time-stamp">${escapeHtml(msg.timeStr)}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - 카카오톡 대화록</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #F8F9FA;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard Variable", Pretendard, Roboto, "Segoe UI", sans-serif;
      color: #1e293b;
      line-height: 1.5;
      padding: 24px 16px;
      display: flex;
      justify-content: center;
    }
    .chat-card {
      width: 100%;
      max-width: 760px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      overflow: hidden;
    }
    .header {
      padding: 20px 24px;
      border-bottom: 1px solid #E2E8F0;
      background: #FFFFFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      font-size: 18px;
      font-weight: 700;
      color: #0F172A;
    }
    .header-sub {
      font-size: 13px;
      color: #64748B;
    }
    .chat-body {
      padding: 24px;
      background: #F8F9FA;
      min-height: 500px;
    }
    .date-divider {
      text-align: center;
      margin: 24px 0 16px;
    }
    .date-badge {
      display: inline-block;
      background: #E2E8F0;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 14px;
      border-radius: 9999px;
      letter-spacing: -0.2px;
    }
    .msg-wrapper {
      display: flex;
      margin-bottom: 12px;
      width: 100%;
    }
    .msg-wrapper.mine {
      justify-content: flex-end;
    }
    .msg-wrapper.other {
      justify-content: flex-start;
    }
    .msg-container {
      max-width: 75%;
    }
    .sender-name {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 4px;
    }
    .bubble-row {
      display: flex;
      align-items: flex-end;
      gap: 6px;
    }
    .msg-wrapper.mine .bubble-row {
      flex-direction: row-reverse;
    }
    .bubble {
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14.5px;
      word-break: break-word;
      line-height: 1.55;
    }
    .bubble-other {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      color: #0F172A;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      border-top-left-radius: 3px;
    }
    .bubble-mine {
      background: #EBF5FF;
      border: 1px solid #BFDBFE;
      color: #1E3A8A;
      border-top-right-radius: 3px;
    }
    .time-stamp {
      font-size: 11px;
      color: #94A3B8;
      white-space: nowrap;
      margin-bottom: 2px;
    }
    .image-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #F1F5F9;
      border-radius: 8px;
      font-size: 13px;
      color: #475569;
    }
    .img-icon {
      width: 18px;
      height: 18px;
    }
    .link {
      color: #2563EB;
      text-decoration: underline;
    }
    .link:hover {
      color: #1D4ED8;
    }
  </style>
</head>
<body>
  <div class="chat-card">
    <div class="header">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <div class="header-sub">메시지 총 ${messages.length.toLocaleString()}개</div>
      </div>
      <div class="header-sub">카카오톡 대화 뷰어 내보내기</div>
    </div>
    <div class="chat-body">
      ${chatHtml}
    </div>
  </div>
</body>
</html>`;

  downloadFile(htmlContent, `${title}_대화록.html`, 'text/html;charset=utf-8');
}

/**
 * ② TXT 내보내기
 * 원본 카카오톡 내보내기 형식("일시, 이름 : 내용") 그대로 텍스트 파일 생성
 */
export function exportToTxt(messages: ChatMessage[], title: string) {
  let txtContent = `${title}\n저장한 날짜 : ${new Date().toLocaleString('ko-KR')}\n\n`;

  let currentDate = '';
  for (const msg of messages) {
    if (msg.dateStr !== currentDate) {
      txtContent += `--------------- ${msg.dateStr} ---------------\n`;
      currentDate = msg.dateStr;
    }
    txtContent += `${msg.dateTimeStr}, ${msg.sender} : ${msg.content}\n`;
  }

  downloadFile(txtContent, `${title}_대화록.txt`, 'text/plain;charset=utf-8');
}

/**
 * ③ CSV 내보내기
 * Excel/데이터 분석용. 열 구성: [날짜/시간, 작성자, 메시지 내용]
 * 한글 깨짐 방지를 위한 UTF-8 BOM(\uFEFF) 적용 필수.
 */
export function exportToCsv(messages: ChatMessage[], title: string) {
  const BOM = '\uFEFF';
  let csvContent = BOM;

  // 헤더
  csvContent += '"날짜/시간","작성자","메시지 내용"\n';

  for (const msg of messages) {
    const safeDateTime = msg.dateTimeStr.replace(/"/g, '""');
    const safeSender = msg.sender.replace(/"/g, '""');
    const safeContent = msg.content.replace(/"/g, '""');

    csvContent += `"${safeDateTime}","${safeSender}","${safeContent}"\n`;
  }

  downloadFile(csvContent, `${title}_대화록.csv`, 'text/csv;charset=utf-8');
}

/**
 * ④ Markdown 내보내기
 * 문서 정리 및 Notion/Obsidian 보관용.
 * 날짜별 헤더(## 2026년 8월 15일)와 인용구(> **이름** (시간): 내용) 스타일.
 */
export function exportToMarkdown(messages: ChatMessage[], title: string) {
  let mdContent = `# ${title}\n\n`;
  mdContent += `*내보낸 일시: ${new Date().toLocaleString('ko-KR')} | 총 ${messages.length}개 메시지*\n\n---\n\n`;

  let currentDate = '';
  for (const msg of messages) {
    if (msg.dateStr !== currentDate) {
      mdContent += `\n## 📅 ${msg.dateStr}\n\n`;
      currentDate = msg.dateStr;
    }

    // 줄바꿈이 있는 본문은 인용구 블록(>)으로 깔끔하게 처리
    const formattedContent = msg.content
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : `> ${line}`))
      .join('\n');

    mdContent += `> **${msg.sender}** *(${msg.timeStr})*\n> ${formattedContent}\n>\n`;
  }

  downloadFile(mdContent, `${title}_대화록.md`, 'text/markdown;charset=utf-8');
}
