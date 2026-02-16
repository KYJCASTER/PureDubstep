import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 halftone">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-1)]/20 to-[var(--accent-2)]/20" />

      <div className="relative w-full max-w-md">
        <div className="comic-panel p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hot)] border-[var(--stroke-4)] border-[var(--ink)] shadow-[var(--shadow-hard)] flex items-center justify-center">
              <Music className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white text-center mb-2 uppercase tracking-wide" style={{ textShadow: '2px 2px 0 var(--ink)' }}>
            注册
          </h1>
          <p className="text-center text-[var(--text-muted)] mb-6 uppercase tracking-wider text-sm">
            创建您的账户
          </p>

          {error && (
            <div className="mb-6 p-4 border-[var(--stroke-3)] border-[var(--danger)] bg-[var(--danger)]/20 text-[var(--danger)] font-bold text-center uppercase text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="comic-label">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="comic-input"
                placeholder="输入用户名"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="comic-label">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="comic-input"
                placeholder="输入邮箱"
                required
              />
            </div>

            <div>
              <label className="comic-label">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="comic-input"
                placeholder="输入密码"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="comic-label">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="comic-input"
                placeholder="再次输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="comic-btn comic-btn-primary w-full py-4 text-lg"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <p className="text-center text-[var(--text-muted)] mt-6 uppercase tracking-wider text-sm">
            已有账户？{' '}
            <Link to="/login" className="text-[var(--accent-2)] font-bold hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
