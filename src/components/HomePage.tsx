import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Tag, 
  FolderOpen, 
  Plus, 
  Eye,
  Star,
  ArrowRight,
  Layers,
  Zap,
  Shield,
  Users,
  BarChart3,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { notes, tags, categories } = useNotes();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const features = [
    {
      icon: Plus,
      title: "Smart Note Creation",
      description: "Create rich notes with AI-powered categorization and intelligent tagging",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      action: () => navigate('/add-note')
    },
    {
      icon: Tag,
      title: "Advanced Tags System",
      description: "Organize with intelligent tagging and custom color-coded labels",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50",
      action: () => navigate('/tags')
    },
    {
      icon: FolderOpen,
      title: "Smart Categories",
      description: "Structure your knowledge with AI-powered categorization",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
      action: () => navigate('/categories')
    },
    {
      icon: Eye,
      title: "Interactive Viewer",
      description: "View, edit, and manage notes with advanced filtering and search",
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-50 to-red-50",
      action: () => navigate('/notes')
    }
  ];

  const stats = [
    { 
      label: "Total Notes", 
      value: notes.length.toString(), 
      icon: BookOpen,
      color: "from-blue-500 to-cyan-600",
      change: "+12%"
    },
    { 
      label: "Active Tags", 
      value: tags.length.toString(), 
      icon: Tag,
      color: "from-purple-500 to-pink-600",
      change: "+8%"
    },
    { 
      label: "Categories", 
      value: categories.length.toString(), 
      icon: Layers,
      color: "from-emerald-500 to-teal-600",
      change: "+5%"
    },
    { 
      label: "Easy Notes", 
      value: notes.filter(n => n.difficulty === 'Easy').length.toString(), 
      icon: Star,
      color: "from-amber-500 to-orange-600",
      change: "+15%"
    }
  ];

  const recentNotes = notes.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full text-sm font-semibold text-blue-800 dark:text-blue-200 mb-8 shadow-lg backdrop-blur-sm"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Professional Note-Taking Platform
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8 leading-tight">
                Your Notes,
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent block">
                  Perfected
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
                The most advanced note-taking platform with intelligent organization, 
                powerful AI features, and beautiful design for modern professionals.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-16">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  onClick={() => navigate('/add-note')}
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-12 py-6 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3 text-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Creating</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/notes')}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-gray-700 dark:text-gray-200 px-12 py-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Notes
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 shadow-xl`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">{stat.label}</div>
                      <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-32 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {' '}Stay Organized
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Powerful features designed to make note-taking effortless, intelligent, and enjoyable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-3xl bg-white dark:bg-gray-800 border-2 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer group ${
                  activeFeature === index 
                    ? 'border-blue-300 dark:border-blue-500 shadow-3xl scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={feature.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-8 transform transition-transform duration-500 group-hover:scale-110 shadow-2xl`}>
                    <feature.icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">{feature.description}</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold group-hover:text-blue-700 dark:group-hover:text-blue-300 text-lg">
                    <span>Get Started</span>
                    <ChevronRight className="w-6 h-6 ml-2 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Notes Section */}
      {recentNotes.length > 0 && (
        <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Recent
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Notes
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Your latest notes at a glance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {recentNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate('/notes')}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {note.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      note.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      note.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {note.difficulty}
                    </span>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.button
                onClick={() => navigate('/notes')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Notes
              </motion.button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Benefits Section */}
      <section className="py-32 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
                Why Choose
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Notes Pro?
                </span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast Performance",
                    description: "Instant search and retrieval across all your notes with advanced indexing"
                  },
                  {
                    icon: Shield,
                    title: "Enterprise Security",
                    description: "Your data is encrypted and stored locally with complete privacy protection"
                  },
                  {
                    icon: Target,
                    title: "AI-Powered Organization",
                    description: "Smart categorization and tagging with machine learning algorithms"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-6 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl transform rotate-3 shadow-2xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Plus className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">Create New Note</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">Work</div>
                    <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">Ideas</div>
                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">Personal</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-12">
              Ready to Transform Your Notes?
            </h2>
            <p className="text-2xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed">
              Join thousands of professionals who have revolutionized their note-taking with our advanced platform
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <motion.button
                onClick={() => navigate('/add-note')}
                className="bg-white text-blue-600 px-12 py-6 rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Note
              </motion.button>
              <motion.button
                onClick={() => navigate('/notes')}
                className="bg-transparent text-white px-12 py-6 rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 font-bold text-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Features
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}