import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, User, LogOut, Heart, ListMusic, Search, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tracks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="comic-nav">
      {/* Speed line accent */}
      <div className="h-1 w-full bg-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white flex items-center justify-center border-[var(--stroke-4)] border-black shadow-[var(--shadow-hard-sm)] transform group-hover:-rotate-6 group-hover:translate-x-2 transition-all">
              <Music className="w-7 h-7 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-widest uppercase" style={{ textShadow: '3px 3px 0 black' }}>
                Pure
              </span>
              <span className="text-lg font-bold text-red-500 tracking-widest uppercase -mt-1" style={{ textShadow: '2px 2px 0 black' }}>
                Dubstep
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="flex items-center w-full bg-black border-4 border-white shadow-[4px_4px_0_black]">
              <div className="pl-3 pr-2 py-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索曲目..."
                className="flex-1 py-3 pr-4 text-sm uppercase tracking-widest font-bold bg-black text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/tracks"
              className="comic-nav-link group"
            >
              <Zap className="w-4 h-4 group-hover:text-red-500" />
              <span>曲目</span>
            </Link>
            <Link
              to="/artists"
              className="comic-nav-link group"
            >
              <span className="group-hover:text-red-500">艺人</span>
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="comic-nav-link group"
                  >
                    <Shield className="w-4 h-4 group-hover:text-red-500" />
                    <span>管理</span>
                  </Link>
                )}
                <Link
                  to="/favorites"
                  className="comic-nav-link"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">收藏</span>
                </Link>
                <Link
                  to="/playlists"
                  className="comic-nav-link"
                >
                  <ListMusic className="w-4 h-4" />
                  <span className="hidden sm:inline">歌单</span>
                </Link>
                <Link
                  to="/profile"
                  className="comic-nav-link"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="comic-nav-link text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="comic-btn comic-btn-primary text-sm px-4 py-2"
              >
                登录
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-2 w-full bg-gradient-to-r from-black via-red-600 to-black" />
    </header>
  );
};

export default Header;
