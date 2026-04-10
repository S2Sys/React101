/**
 * Dashboard Page
 *
 * Main page showing all notes with search and create functionality
 *
 * CONCEPTS: useNotes context, search/filter, list rendering, modal
 */

import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { useDebounce } from '../hooks/useDebounce';
import { useForm } from '../hooks/useForm';
import { validateNoteForm } from '../utils/validators';
import { CreateNoteRequest } from '../types';
import NoteCard from '../components/NoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/DashboardPage.css';

interface CreateNoteForm {
  title: string;
  content: string;
  tags: string;
}

/**
 * DashboardPage Component
 *
 * Shows all user notes with search, filter, and create capabilities
 *
 * CONCEPT: Multiple hooks (useNotes, useDebounce, useForm), state management, list rendering
 *
 * USAGE:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 */
const DashboardPage: React.FC = () => {
  const { notes, filteredNotes, isLoading, error, createNote, deleteNote, setSearchTerm } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  /**
   * Debounce search input to avoid filtering on every keystroke
   * CONCEPT: useDebounce for performance optimization
   */
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  /**
   * Update search term in context when debounced value changes
   * CONCEPT: useEffect-like behavior with hook dependencies
   */
  React.useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  /**
   * Form for creating new note
   * CONCEPT: useForm hook for form state management
   */
  const createForm = useForm<CreateNoteForm>(
    { title: '', content: '', tags: '' },
    async (values) => {
      const request: CreateNoteRequest = {
        title: values.title,
        content: values.content,
        tags: values.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      await createNote(request);
      createForm.resetForm();
      setIsCreateModalOpen(false);
    },
    (values) => validateNoteForm(values.title, values.content)
  );

  /**
   * Handle deleting a note
   * CONCEPT: Async error handling in event handler
   */
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  /**
   * Show loading state
   * CONCEPT: Conditional rendering based on loading state
   */
  if (isLoading && notes.length === 0) {
    return <LoadingSpinner message="Loading your notes..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header with title and create button */}
        <div className="dashboard-header">
          <h1>📚 My Notes</h1>
          <button
            className="create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ New Note
          </button>
        </div>

        {/* Search bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search notes by title, content, or tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <span className="search-results-count">
              Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Notes grid */}
        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="no-notes-message">
              <p>
                {searchInput
                  ? 'No notes found matching your search'
                  : 'No notes yet. Create your first note to get started!'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Note</h2>
              <button
                className="close-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Create form */}
            <form onSubmit={createForm.handleSubmit(async () => {
              try {
                const request: CreateNoteRequest = {
                  title: createForm.values.title,
                  content: createForm.values.content,
                  tags: createForm.values.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
                };

                await createNote(request);
                createForm.resetForm();
                setIsCreateModalOpen(false);
              } catch (err) {
                console.error('Failed to create note:', err);
              }
            })}>
              {/* Title field */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={createForm.values.title}
                  onChange={createForm.handleChange}
                  onBlur={createForm.handleBlur}
                  placeholder="Enter note title"
                  className={`form-input ${
                    createForm.errors.title ? 'error' : ''
                  }`}
                />
                {createForm.touched.title && createForm.errors.title && (
                  <span className="error-text">{createForm.errors.title}</span>
                )}
              </div>

              {/* Content field */}
              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={createForm.values.content}
                  onChange={createForm.handleChange}
                  onBlur={createForm.handleBlur}
                  placeholder="Enter note content..."
                  className={`form-textarea ${
                    createForm.errors.content ? 'error' : ''
                  }`}
                  rows={6}
                />
                {createForm.touched.content && createForm.errors.content && (
                  <span className="error-text">
                    {createForm.errors.content}
                  </span>
                )}
              </div>

              {/* Tags field */}
              <div className="form-group">
                <label htmlFor="tags" className="form-label">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  name="tags"
                  value={createForm.values.tags}
                  onChange={createForm.handleChange}
                  placeholder="e.g., work, important, todo"
                  className="form-input"
                />
              </div>

              {/* Buttons */}
              <div className="modal-buttons">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={
                    createForm.isSubmitting ||
                    !createForm.isDirty
                  }
                >
                  {createForm.isSubmitting ? 'Creating...' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
