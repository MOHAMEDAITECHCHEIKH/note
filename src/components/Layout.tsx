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
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notes Pro
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Professional Edition</div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium ${
                    (item.id === '' ? currentPage === 'home' : currentPage === item.id)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
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
                className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="relative">
                  {isDarkMode ? (
                    <Sun className="w-6 h-6 transform transition-transform group-hover:rotate-12" />
                  ) : (
                    <Moon className="w-6 h-6 transform transition-transform group-hover:-rotate-12" />
                  )}
                </div>
              </motion.button>

              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
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
        <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
          <div className="flex justify-around py-3">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all ${
                  (item.id === '' ? currentPage === 'home' : currentPage === item.id)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
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