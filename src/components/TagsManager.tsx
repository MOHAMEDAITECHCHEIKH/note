import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Check, X, Star, AlertCircle } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

export default function TagsManager() {
  const { tags, addTag, updateTag, deleteTag } = useNotes();
  const [newTagName, setNewTagName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  const tagColors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'
  ];

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      setError('Tag name is required');
      return;
    }

    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      setError('Tag already exists');
      return;
    }

    const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];
    addTag({
      name: newTagName.trim(),
      isDefault: false,
      color: randomColor
    });

    setNewTagName('');
    setError('');
  };

  const handleEditTag = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setError('');
  };

  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      setError('Tag name is required');
      return;
    }

    if (tags.some(tag => tag.id !== editingId && tag.name.toLowerCase() === editingName.toLowerCase())) {
      setError('Tag already exists');
      return;
    }

    updateTag(editingId!, { name: editingName.trim() });
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  const handleDeleteTag = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (tag?.isDefault) {
      setError('Cannot delete default tag');
      return;
    }
    deleteTag(id);
  };

  const toggleDefault = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;

    // If setting as default, remove default from others
    if (!tag.isDefault) {
      tags.forEach(t => {
        if (t.isDefault) {
          updateTag(t.id, { isDefault: false });
        }
      });
    }

    updateTag(id, { isDefault: !tag.isDefault });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags Manager</h1>
          <p className="text-gray-600">Organize your notes with custom tags and labels</p>
        </div>

        {/* Add New Tag */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Add New Tag
          </h2>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Enter tag name..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </motion.p>
              )}
            </div>
            <motion.button
              onClick={handleAddTag}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Tag</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tags List */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Tags</h2>
          
          <div className="space-y-4">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.div
                  key={tag.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    
                    {editingId === tag.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="font-medium text-gray-900">{tag.name}</span>
                        {tag.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {editingId === tag.id ? (
                      <>
                        <motion.button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => toggleDefault(tag.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            tag.isDefault
                              ? 'text-yellow-600 hover:bg-yellow-100'
                              : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-600'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={tag.isDefault ? 'Remove as default' : 'Set as default'}
                        >
                          <Star className={`w-4 h-4 ${tag.isDefault ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleEditTag(tag.id, tag.name)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteTag(tag.id)}
                          disabled={tag.isDefault}
                          className={`p-2 rounded-lg transition-colors ${
                            tag.isDefault
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-100'
                          }`}
                          whileHover={{ scale: tag.isDefault ? 1 : 1.1 }}
                          whileTap={{ scale: tag.isDefault ? 1 : 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {tags.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No tags yet. Create your first tag above!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}