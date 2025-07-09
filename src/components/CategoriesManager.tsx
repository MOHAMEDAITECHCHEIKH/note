import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Check, X, FolderOpen, AlertCircle } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

export default function CategoriesManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useNotes();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const categoryColors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'
  ];

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setError('Category already exists');
      return;
    }

    const randomColor = categoryColors[Math.floor(Math.random() * categoryColors.length)];
    addCategory({
      name: newCategory.name.trim(),
      description: newCategory.description.trim() || 'No description provided',
      color: randomColor
    });

    setNewCategory({ name: '', description: '' });
    setError('');
  };

  const handleEditCategory = (id: string, name: string, description: string) => {
    setEditingId(id);
    setEditingData({ name, description });
    setError('');
  };

  const handleSaveEdit = () => {
    if (!editingData.name.trim()) {
      setError('Category name is required');
      return;
    }

    if (categories.some(cat => cat.id !== editingId && cat.name.toLowerCase() === editingData.name.toLowerCase())) {
      setError('Category already exists');
      return;
    }

    updateCategory(editingId!, {
      name: editingData.name.trim(),
      description: editingData.description.trim() || 'No description provided'
    });
    setEditingId(null);
    setEditingData({ name: '', description: '' });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ name: '', description: '' });
    setError('');
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.name === 'Uncategorized') {
      setError('Cannot delete default category');
      return;
    }
    deleteCategory(id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories Manager</h1>
          <p className="text-gray-600">Organize your notes into meaningful categories</p>
        </div>

        {/* Add New Category */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Add New Category
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => {
                  setNewCategory(prev => ({ ...prev, name: e.target.value }));
                  setError('');
                }}
                placeholder="Enter category name..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </motion.p>
            )}

            <div className="flex justify-end">
              <motion.button
                onClick={handleAddCategory}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Category</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Categories List */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Categories</h2>
          
          <div className="grid gap-6">
            <AnimatePresence>
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                >
                  {editingId === category.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          value={editingData.name}
                          onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editingData.description}
                          onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Check className="w-4 h-4" />
                          <span>Save</span>
                        </motion.button>
                        <motion.button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          <FolderOpen 
                            className="w-6 h-6"
                            style={{ color: category.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          onClick={() => handleEditCategory(category.id, category.name, category.description)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category.name === 'Uncategorized'}
                          className={`p-2 rounded-lg transition-colors ${
                            category.name === 'Uncategorized'
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-100'
                          }`}
                          whileHover={{ scale: category.name === 'Uncategorized' ? 1 : 1.1 }}
                          whileTap={{ scale: category.name === 'Uncategorized' ? 1 : 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No categories yet. Create your first category above!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}