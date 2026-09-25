import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMPLE_KAKAO_TEXT } from '../utils/sampleData';

interface FileUploadProps {
  onFileLoaded: (text: string, fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileLoaded(text, file.name.replace(/\.[^/.]+$/, ''));
      setLoading(false);
    };
    reader.onerror = () => {
      alert('파일을 읽는 중 오류가 발생했습니다.');
      setLoading(false);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    onFileLoaded(SAMPLE_KAKAO_TEXT, '카카오톡 대화 샘플');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all bg-white ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-1">
            카카오톡 대화 텍스트(.txt) 파일 업로드
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            파일을 이곳으로 드래그하거나 클릭하여 컴퓨터에서 선택하세요.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
            >
              내 PC에서 파일 선택
            </button>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              대화 파일을 분석하고 있습니다...
            </div>
          </div>
        )}
      </div>

      {/* Demo / Sample Button */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">샘플 대화로 즉시 체험하기</div>
            <div className="text-xs text-slate-500">카카오톡 내보내기 파일이 없다면 준비된 예시로 바로 확인해보세요.</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="w-full sm:w-auto px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          샘플 대화 불러오기
        </button>
      </div>

      {/* Guide Info */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
        <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>모든 처리는 브라우저 내부에서 안전하게 실행됩니다.</span>
        </div>
        <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>참여자별 실시간 다중 필터링 지원</span>
        </div>
        <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>HTML, TXT, CSV, MD 다중 포맷 내보내기 지원</span>
        </div>
      </div>
    </div>
  );
};
