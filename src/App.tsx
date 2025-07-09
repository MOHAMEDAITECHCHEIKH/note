import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AddNote from './components/AddNote';
import TagsManager from './components/TagsManager';
import CategoriesManager from './components/CategoriesManager';
import NotesViewer from './components/NotesViewer';
import NoteDetails from './components/NoteDetails';

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <Router>
          <Routes>
            {/* Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="add-note" element={<AddNote />} />
              <Route path="tags" element={<TagsManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="notes" element={<NotesViewer />} />
            </Route>
            
            {/* Full-screen route for note details */}
            <Route path="/note/:id" element={<NoteDetails />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;