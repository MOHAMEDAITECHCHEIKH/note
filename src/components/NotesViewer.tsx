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
  Star
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

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
    Difficult: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
  };

  const difficultyOptions = {
    Easy: { color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    Medium: { color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
    Difficult: { color: 'bg-red-500', hoverColor: 'hover:bg-red-600' }
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

  const toggleReveal = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { isRevealed: !note.isRevealed });
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8">
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
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Smart Notes Management
            </motion.div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  Notes Viewer
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  View, manage, and organize all your notes with advanced filtering
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <motion.button
                  onClick={() => setViewMode('cards')}
                  className={`p-3 rounded-lg transition-all ${
                    viewMode === 'cards' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('table')}
                  className={`p-3 rounded-lg transition-all ${
                    viewMode === 'table' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Filter Status Indicator */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
                    Filters active - Showing {filteredNotes.length} of {notes.length} notes
                  </span>
                </div>
                <motion.button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-semibold bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterX className="w-4 h-4" />
                  <span>Clear All</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Enhanced Filters and Search */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FolderOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Filter by Tags
              </label>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <motion.button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all font-medium ${
                      selectedTags.includes(tag.name)
                        ? 'text-white border-transparent shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    style={selectedTags.includes(tag.name) ? { backgroundColor: tag.color } : {}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notes Display */}
          {viewMode === 'cards' ? (
            /* Enhanced Card View */
            <div className="grid gap-8">
              <AnimatePresence>
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1"
                    onClick={() => openNoteModal(note)}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {note.title}
                        </h3>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FolderOpen className="w-4 h-4 mr-2" />
                            {note.category}
                          </div>
                        </div>

                        {/* Tags */}
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {note.tags.map((tagName) => (
                              <span
                                key={tagName}
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                                style={{ backgroundColor: getTagColor(tagName) }}
                              >
                                {tagName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-6">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReveal(note.id);
                          }}
                          className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={note.isRevealed ? 'Hide content' : 'Show content'}
                        >
                          {note.isRevealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/note/${note.id}`);
                          }}
                          className="p-3 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-xl transition-colors shadow-lg"
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
                          className="p-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete note"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Content */}
                    <AnimatePresence>
                      {note.isRevealed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-inner">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Difficulty Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Difficulty:</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${difficultyColors[note.difficulty]}`}>
                          {note.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Update:</span>
                        {(['Easy', 'Medium', 'Difficult'] as DifficultyLevel[]).map((level) => (
                          <motion.button
                            key={level}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateDifficulty(note.id, level);
                            }}
                            className={`w-10 h-10 rounded-xl ${difficultyOptions[level].color} ${difficultyOptions[level].hoverColor} transition-colors shadow-lg ${
                              note.difficulty === level ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : ''
                            }`}
                            whileHover={{ scale: 1.1 }}
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
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
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
                      <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                          onClick={() => openNoteModal(note)}
                        >
                          <td className="px-8 py-6">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {note.title}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {note.category}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${difficultyColors[note.difficulty]}`}>
                              {note.difficulty}
                            </span>
                          </td>
                          <td className="px-8 py-6">
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
                          <td className="px-8 py-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/note/${note.id}`);
                                }}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg shadow-lg"
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
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg shadow-lg"
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
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <BookOpen className="w-16 h-16 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {notes.length === 0 
                  ? 'Create your first note to get started on your journey!' 
                  : 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                }
              </p>
              {notes.length === 0 && (
                <motion.button
                  onClick={() => navigate('/add-note')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl font-semibold text-lg"
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
              className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-xl border border-blue-200/50 dark:border-blue-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{filteredNotes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {hasActiveFilters ? 'Filtered' : 'Total'} Notes
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {filteredNotes.filter(n => n.difficulty === 'Easy').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Easy</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {filteredNotes.filter(n => n.difficulty === 'Medium').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Medium</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {filteredNotes.filter(n => n.difficulty === 'Difficult').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Difficult</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Note Modal */}
        <NoteModal 
          note={selectedNote}
          isOpen={isModalOpen}
          onClose={closeNoteModal}
        />
      </div>
    </div>
  );
}