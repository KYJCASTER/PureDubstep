import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Subscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('请输入邮箱地址');
      return;
    }

    if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(email)) {
      setStatus('error');
      setMessage('请输入有效的邮箱地址');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8080/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || '订阅成功！');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || '订阅失败，请重试');
      }
    } catch (error) {
      setStatus('error');
      setMessage('网络错误，请稍后重试');
    }
  };

  return (
    <div className="comic-panel p-6 border-4 border-black shadow-[8px_8px_0_black]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-red-600 border-4 border-black flex items-center justify-center shadow-[4px_4px_0_black]">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
            订阅更新
          </h3>
          <p className="text-gray-400 text-sm">
            获取最新Dubstep音乐资讯
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-3 p-4 bg-green-900/30 border-2 border-green-500">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="text-green-400 font-bold">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入您的邮箱..."
                className="comic-input"
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="comic-btn comic-btn-primary px-6 flex items-center gap-2"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  订阅
                </>
              )}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-500 text-sm font-bold">{message}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default Subscribe;
