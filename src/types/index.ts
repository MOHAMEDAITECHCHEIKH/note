export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Difficult';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isRevealed?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  isDefault: boolean;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Difficult';

export interface NotesContextType {
  notes: Note[];
  tags: Tag[];
  categories: Category[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}