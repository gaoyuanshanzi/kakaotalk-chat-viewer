import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle, Shield } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // ID: "admin", PW: "123jesus"
    if (username.trim() === 'admin' && password === '123jesus') {
      sessionStorage.setItem('kakaoviewer_auth', 'authenticated');
      onLoginSuccess();
    } else {
      setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Top Accent Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <Shield className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">관리자 인증</h2>
          <p className="text-xs text-slate-300 mt-1">카카오톡 대화 뷰어에 접근하려면 로그인하세요.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              아이디
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow active:scale-[0.99] disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>로그인하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};
