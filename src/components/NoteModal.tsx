import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, FolderOpen, Edit, Trash2, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Note } from '../types';
import { useNotes } from '../context/NotesContext';

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NoteModal({ note, isOpen, onClose }: NoteModalProps) {
  const navigate = useNavigate();
  const { deleteNote, tags } = useNotes();

  if (!note) return null;

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
    Difficult: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
  };

  const handleEdit = () => {
    onClose();
    navigate(`/note/${note.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      deleteNote(note.id);
      onClose();
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#6B7280';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Enhanced Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex-1 pr-6">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
                    {note.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl shadow-lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl shadow-lg">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl shadow-lg">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      <span className="font-medium">{note.category}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-7 h-7" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Note Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-blue-500" />
                    Content
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-3xl p-8 shadow-inner border border-gray-200/50 dark:border-gray-600/50">
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed text-lg break-words overflow-wrap-anywhere">
                      {note.content}
                    </p>
                  </div>
                </div>

                {/* Properties Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Difficulty */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6">Difficulty Level</h3>
                    <div className="flex items-center">
                      <span className={`inline-flex px-6 py-3 rounded-xl text-base font-bold border-2 shadow-xl ${difficultyColors[note.difficulty]}`}>
                        {note.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6">Tags</h3>
                    {note.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {note.tags.map((tagName) => (
                          <motion.span
                            key={tagName}
                            className="px-4 py-2 rounded-xl text-base font-semibold text-white shadow-xl"
                            style={{ backgroundColor: getTagColor(tagName) }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {tagName}
                          </motion.span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-base italic bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl shadow-lg">
                        No tags assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 p-8 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50 rounded-b-3xl">
                <motion.button
                  onClick={handleEdit}
                  className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all shadow-xl hover:shadow-2xl font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit className="w-6 h-6" />
                  <span>Edit Note</span>
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-6 h-6" />
                  <span>Delete Note</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}