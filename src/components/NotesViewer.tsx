import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Calendar, 
  Tag, 
  FolderOpen,
  Search,
  Filter,
  SortAsc,
  BookOpen,
  X,
  FilterX,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { DifficultyLevel } from '../types';
import NoteModal from './NoteModal';

export default function NotesViewer() {
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote, tags, categories } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [showFullContent, setShowFullContent] = useState<Set<string>>(new Set());

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    Difficult: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700'
  };

  const difficultyOptions = {
    Easy: { color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600' },
    Medium: { color: 'bg-amber-500', hoverColor: 'hover:bg-amber-600' },
    Difficult: { color: 'bg-rose-500', hoverColor: 'hover:bg-rose-600' }
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedTags.length > 0;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedTags([]);
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || note.difficulty === selectedDifficulty;
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => note.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { Easy: 1, Medium: 2, Difficult: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
        // Also remove from full content when collapsing
        setShowFullContent(prevContent => {
          const newContentSet = new Set(prevContent);
          newContentSet.delete(noteId);
          return newContentSet;
        });
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const toggleFullContent = (noteId: string) => {
    setShowFullContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const updateDifficulty = (noteId: string, difficulty: DifficultyLevel) => {
    updateNote(noteId, { difficulty });
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#6B7280';
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const openNoteModal = (note: any) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeNoteModal = () => {
    setSelectedNote(null);
    setIsModalOpen(false);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full text-sm font-semibold text-blue-800 dark:text-blue-200 mb-8 shadow-lg backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Intelligent Notes Management
            </motion.div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                  Notes Viewer
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Discover, organize, and manage your knowledge with advanced filtering and elegant design
                </p>
              </div>
              
              {/* Enhanced View Mode Toggle */}
              <div className="flex items-center space-x-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <motion.button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-semibold ${
                    viewMode === 'cards' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Grid className="w-5 h-5" />
                  <span className="hidden sm:inline">Cards</span>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-semibold ${
                    viewMode === 'table' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <List className="w-5 h-5" />
                  <span className="hidden sm:inline">Table</span>
                </motion.button>
              </div>
            </div>

            {/* Enhanced Filter Status Indicator */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      Active Filters
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Showing {filteredNotes.length} of {notes.length} notes
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterX className="w-5 h-5" />
                  <span>Clear All</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Enhanced Filters and Search */}
          <motion.div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg hover:shadow-xl"
                />
              </div>

              {/* Enhanced Category Filter */}
              <div className="relative group">
                <FolderOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhanced Difficulty Filter */}
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>

              {/* Enhanced Sort */}
              <div className="relative group">
                <SortAsc className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>

            {/* Enhanced Tag Filters */}
            <div>
              <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Filter by Tags
              </label>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <motion.button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-5 py-3 rounded-xl border-2 transition-all font-semibold shadow-lg hover:shadow-xl ${
                      selectedTags.includes(tag.name)
                        ? 'text-white border-transparent transform scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    style={selectedTags.includes(tag.name) ? { backgroundColor: tag.color } : {}}
                    whileHover={{ scale: selectedTags.includes(tag.name) ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tag.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notes Display */}
          {viewMode === 'cards' ? (
            /* Enhanced Card View with Smart Expansion */
            <div className="grid gap-8">
              <AnimatePresence>
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, layout: { duration: 0.3 } }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-3xl transition-all cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                      <div className="flex-1">
                        <motion.h3 
                          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words leading-tight"
                          onClick={() => toggleNoteExpansion(note.id)}
                          whileHover={{ scale: 1.01 }}
                        >
                          {note.title}
                        </motion.h3>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                            <FolderOpen className="w-4 h-4 mr-2" />
                            <span className="font-medium">{note.category}</span>
                          </div>
                        </div>

                        {/* Enhanced Tags */}
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6 max-w-full">
                            {note.tags.map((tagName) => (
                              <motion.span
                                key={tagName}
                                className="px-3 py-2 rounded-xl text-sm font-semibold text-white shadow-lg break-all"
                                style={{ backgroundColor: getTagColor(tagName) }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {tagName}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {/* Smart Content Preview */}
                        <div className="mb-6">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-wrap-anywhere">
                            {expandedNotes.has(note.id) 
                              ? (showFullContent.has(note.id) ? note.content : truncateContent(note.content, 300))
                              : truncateContent(note.content, 150)
                            }
                          </p>
                          
                          {/* Smart Show More/Less Buttons */}
                          {note.content.length > 150 && (
                            <div className="mt-4 flex items-center space-x-3">
                              {!expandedNotes.has(note.id) ? (
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNoteExpansion(note.id);
                                  }}
                                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                  <span>Expand Note</span>
                                </motion.button>
                              ) : (
                                <div className="flex items-center space-x-3">
                                  {note.content.length > 300 && !showFullContent.has(note.id) && (
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFullContent(note.id);
                                      }}
                                      className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Show More</span>
                                    </motion.button>
                                  )}
                                  
                                  {showFullContent.has(note.id) && (
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFullContent(note.id);
                                      }}
                                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <EyeOff className="w-4 h-4" />
                                      <span>Show Less</span>
                                    </motion.button>
                                  )}
                                  
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleNoteExpansion(note.id);
                                    }}
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                    <span>Collapse</span>
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex items-center space-x-3 sm:ml-6 flex-shrink-0">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            openNoteModal(note);
                          }}
                          className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition-all shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View full note"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/note/${note.id}`);
                          }}
                          className="p-3 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-xl transition-all shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit note"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="p-3 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-xl transition-all shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete note"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Enhanced Difficulty Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Difficulty:</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-lg ${difficultyColors[note.difficulty]}`}>
                          {note.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 flex-wrap">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Update:</span>
                        {(['Easy', 'Medium', 'Difficult'] as DifficultyLevel[]).map((level) => (
                          <motion.button
                            key={level}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateDifficulty(note.id, level);
                            }}
                            className={`w-10 h-10 rounded-xl ${difficultyOptions[level].color} ${difficultyOptions[level].hoverColor} transition-all shadow-lg hover:shadow-xl ${
                              note.difficulty === level ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : ''
                            }`}
                            whileHover={{ scale: note.difficulty === level ? 1.1 : 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            title={`Set difficulty to ${level}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Enhanced Table View */
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900">
                    <tr>
                      <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="hidden md:table-cell px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="hidden lg:table-cell px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="hidden sm:table-cell px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredNotes.map((note, index) => (
                        <motion.tr
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                          onClick={() => openNoteModal(note)}
                        >
                          <td className="px-8 py-6">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white break-words max-w-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {note.title}
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-8 py-6">
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {note.category}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-lg ${difficultyColors[note.difficulty]}`}>
                              {note.difficulty}
                            </span>
                          </td>
                          <td className="hidden lg:table-cell px-8 py-6">
                            <div className="flex flex-wrap gap-1">
                              {note.tags.slice(0, 2).map((tagName) => (
                                <span
                                  key={tagName}
                                  className="inline-flex px-2 py-1 text-xs font-semibold text-white rounded-full shadow-lg"
                                  style={{ backgroundColor: getTagColor(tagName) }}
                                >
                                  {tagName}
                                </span>
                              ))}
                              {note.tags.length > 2 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 rounded-full">
                                  +{note.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-8 py-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/note/${note.id}`);
                                }}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Edit note"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Delete note"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Enhanced Empty State */}
          {filteredNotes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <BookOpen className="w-16 h-16 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-xl max-w-2xl mx-auto">
                {notes.length === 0 
                  ? 'Create your first note to begin your knowledge journey!' 
                  : 'Try adjusting your search or filter criteria to discover what you\'re looking for.'
                }
              </p>
              {notes.length === 0 && (
                <motion.button
                  onClick={() => navigate('/add-note')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-3xl font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Your First Note
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Enhanced Stats */}
          {notes.length > 0 && (
            <motion.div
              className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 shadow-2xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <motion.div 
                  className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{filteredNotes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    {hasActiveFilters ? 'Filtered' : 'Total'} Notes
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {filteredNotes.filter(n => n.difficulty === 'Easy').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Easy</div>
                </motion.div>
                <motion.div 
                  className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {filteredNotes.filter(n => n.difficulty === 'Medium').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Medium</div>
                </motion.div>
                <motion.div 
                  className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-rose-600 mb-2">
                    {filteredNotes.filter(n => n.difficulty === 'Difficult').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Difficult</div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Note Modal */}
        <NoteModal 
          note={selectedNote}
          isOpen={isModalOpen}
          onClose={closeNoteModal}
        />
      </div>
    </div>
  );
}