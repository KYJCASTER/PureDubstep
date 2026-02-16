import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user?.createdAt) {
      setCreatedAt(new Date(user.createdAt).toLocaleDateString('zh-CN'));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <h1 className="text-3xl font-bold text-white">个人中心</h1>

      <div className="comic-panel p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 border-[var(--stroke-4)] border-[var(--ink)] shadow-[var(--shadow-hard-sm)] overflow-hidden bg-gray-800 flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hot)] flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <span className="text-red-400 text-sm px-3 py-1 rounded-full bg-red-900/30">
              {user.role === 'ADMIN' ? '管理员' : '用户'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">用户名</p>
              <p className="text-white">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">邮箱</p>
              <p className="text-white">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">注册时间</p>
              <p className="text-white">{createdAt}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 py-3 rounded-lg font-medium transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
