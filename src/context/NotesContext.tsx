import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, Tag, Category, NotesContextType } from '../types';

const NotesContext = createContext<NotesContextType | undefined>(undefined);

type Action =
  | { type: 'ADD_NOTE'; payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_TAG'; payload: Omit<Tag, 'id'> }
  | { type: 'UPDATE_TAG'; payload: { id: string; updates: Partial<Tag> } }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'LOAD_DATA'; payload: { notes: Note[]; tags: Tag[]; categories: Category[] } };

interface State {
  notes: Note[];
  tags: Tag[];
  categories: Category[];
}

const initialState: State = {
  notes: [],
  tags: [
    { id: '1', name: 'Untagged', isDefault: true, color: '#6B7280' },
    { id: '2', name: 'Work', isDefault: false, color: '#3B82F6' },
    { id: '3', name: 'Personal', isDefault: false, color: '#10B981' },
    { id: '4', name: 'Ideas', isDefault: false, color: '#8B5CF6' }
  ],
  categories: [
    { id: '1', name: 'Uncategorized', description: 'Default category for new notes', color: '#6B7280' },
    { id: '2', name: 'Work Projects', description: 'Professional and work-related notes', color: '#3B82F6' },
    { id: '3', name: 'Learning', description: 'Educational content and study materials', color: '#F59E0B' },
    { id: '4', name: 'Personal', description: 'Personal thoughts and ideas', color: '#10B981' }
  ]
};

function notesReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_NOTE':
      const newNote: Note = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return { ...state, notes: [...state.notes, newNote] };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates, updatedAt: new Date() }
            : note
        )
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };

    case 'ADD_TAG':
      const newTag: Tag = { ...action.payload, id: uuidv4() };
      return { ...state, tags: [...state.tags, newTag] };

    case 'UPDATE_TAG':
      return {
        ...state,
        tags: state.tags.map(tag =>
          tag.id === action.payload.id
            ? { ...tag, ...action.payload.updates }
            : tag
        )
      };

    case 'DELETE_TAG':
      return {
        ...state,
        tags: state.tags.filter(tag => tag.id !== action.payload),
        notes: state.notes.map(note => ({
          ...note,
          tags: note.tags.filter(tagName => {
            const tagToDelete = state.tags.find(t => t.id === action.payload);
            return tagToDelete ? tagName !== tagToDelete.name : true;
          })
        }))
      };

    case 'ADD_CATEGORY':
      const newCategory: Category = { ...action.payload, id: uuidv4() };
      return { ...state, categories: [...state.categories, newCategory] };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.updates }
            : category
        )
      };

    case 'DELETE_CATEGORY':
      const defaultCategory = state.categories.find(c => c.name === 'Uncategorized');
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        notes: state.notes.map(note => {
          const categoryToDelete = state.categories.find(c => c.id === action.payload);
          return categoryToDelete && note.category === categoryToDelete.name
            ? { ...note, category: defaultCategory?.name || 'Uncategorized' }
            : note;
        })
      };

    case 'LOAD_DATA':
      return action.payload;

    default:
      return state;
  }
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('notesProData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        const notes = parsedData.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        dispatch({
          type: 'LOAD_DATA',
          payload: { ...parsedData, notes }
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('notesProData', JSON.stringify(state));
  }, [state]);

  const contextValue: NotesContextType = {
    notes: state.notes,
    tags: state.tags,
    categories: state.categories,
    addNote: (note) => dispatch({ type: 'ADD_NOTE', payload: note }),
    updateNote: (id, updates) => dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } }),
    deleteNote: (id) => dispatch({ type: 'DELETE_NOTE', payload: id }),
    addTag: (tag) => dispatch({ type: 'ADD_TAG', payload: tag }),
    updateTag: (id, updates) => dispatch({ type: 'UPDATE_TAG', payload: { id, updates } }),
    deleteTag: (id) => dispatch({ type: 'DELETE_TAG', payload: id }),
    addCategory: (category) => dispatch({ type: 'ADD_CATEGORY', payload: category }),
    updateCategory: (id, updates) => dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } }),
    deleteCategory: (id) => dispatch({ type: 'DELETE_CATEGORY', payload: id })
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}