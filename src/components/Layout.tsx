import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Tag, FolderOpen, Home, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const currentPage = location.pathname.slice(1) || 'home';

  const navItems = [
    { id: '', label: 'Home', icon: Home, path: '/' },
    { id: 'add-note', label: 'Add Note', icon: Plus, path: '/add-note' },
    { id: 'tags', label: 'Tags', icon: Tag, path: '/tags' },
    { id: 'categories', label: 'Categories', icon: FolderOpen, path: '/categories' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-all duration-500">
      {/* Enhanced Navigation */}
      <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Notes Pro
                </span>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Professional Edition</div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex space-x-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-semibold ${
                    (item.id === '' ? currentPage === 'home' : currentPage === item.id)
                      ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-600 text-white shadow-xl'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="relative p-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all group shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="relative">
                  {isDarkMode ? (
                    <Sun className="w-7 h-7 transform transition-transform group-hover:rotate-12" />
                  ) : (
                    <Moon className="w-7 h-7 transform transition-transform group-hover:-rotate-12" />
                  )}
                </div>
              </motion.button>

              <motion.button 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all shadow-xl hover:shadow-2xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/add-note')}
              >
                Quick Add
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-lg">
          <div className="flex justify-around py-3">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-4 px-5 rounded-xl transition-all ${
                  (item.id === '' ? currentPage === 'home' : currentPage === item.id)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-7 h-7 mb-2" />
                <span className="text-xs font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}