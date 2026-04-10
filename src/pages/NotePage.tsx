/**
 * Note Detail Page
 *
 * View and edit a single note
 *
 * CONCEPTS: useParams for route params, useFetch for data loading, form editing
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useForm } from '../hooks/useForm';
import { validateNoteForm } from '../utils/validators';
import { UpdateNoteRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/NotePage.css';

interface EditNoteForm {
  title: string;
  content: string;
  tags: string;
}

/**
 * NotePage Component
 *
 * Shows a single note with edit capability
 *
 * CONCEPT: useParams for URL parameters, conditional rendering, editing mode
 *
 * USAGE:
 * <Route path="/notes/:id" element={
 *   <ProtectedRoute>
 *     <NotePage />
 *   </ProtectedRoute>
 * } />
 */
const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote, isLoading } = useNotes();
  const [isEditing, setIsEditing] = useState(false);

  // Find the note
  // CONCEPT: Array find method, nullability handling
  const note = notes.find((n) => n.id === id);

  /**
   * Form for editing note
   * CONCEPT: useForm hook with dynamic initial values
   */
  const editForm = useForm<EditNoteForm>(
    {
      title: note?.title || '',
      content: note?.content || '',
      tags: note?.tags.join(', ') || '',
    },
    async (values) => {
      if (!note) return;

      const request: UpdateNoteRequest = {
        title: values.title,
        content: values.content,
        tags: values.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      await updateNote(note.id, request);
      setIsEditing(false);
    },
    (values) => validateNoteForm(values.title, values.content)
  );

  /**
   * Update form when note changes
   * CONCEPT: useEffect for sync external data with form
   */
  useEffect(() => {
    if (note) {
      editForm.setFieldValue('title', note.title);
      editForm.setFieldValue('content', note.content);
      editForm.setFieldValue('tags', note.tags.join(', '));
    }
  }, [note?.id]);

  /**
   * Handle delete
   * CONCEPT: Async deletion with confirmation
   */
  const handleDelete = async () => {
    if (!note) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  /**
   * Show loading state
   */
  if (isLoading) {
    return <LoadingSpinner message="Loading note..." />;
  }

  /**
   * Show not found message
   */
  if (!note) {
    return (
      <div className="note-page">
        <div className="note-container">
          <div className="not-found-message">
            <h2>Note not found</h2>
            <p>The note you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="note-page">
      <div className="note-container">
        {/* Header with back button and actions */}
        <div className="note-header">
          <button
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back
          </button>

          <div className="note-actions">
            {!isEditing && (
              <>
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={handleDelete}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Note content - View or Edit mode */}
        {isEditing ? (
          <form className="note-form" onSubmit={editForm.handleSubmit(async () => {
            try {
              const request: UpdateNoteRequest = {
                title: editForm.values.title,
                content: editForm.values.content,
                tags: editForm.values.tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0),
              };

              await updateNote(note.id, request);
              setIsEditing(false);
            } catch (err) {
              console.error('Failed to update note:', err);
            }
          })}>
            {/* Title field */}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={editForm.values.title}
                onChange={editForm.handleChange}
                className={`form-input ${
                  editForm.errors.title ? 'error' : ''
                }`}
              />
              {editForm.errors.title && (
                <span className="error-text">{editForm.errors.title}</span>
              )}
            </div>

            {/* Content field */}
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={editForm.values.content}
                onChange={editForm.handleChange}
                className={`form-textarea ${
                  editForm.errors.content ? 'error' : ''
                }`}
                rows={12}
              />
              {editForm.errors.content && (
                <span className="error-text">{editForm.errors.content}</span>
              )}
            </div>

            {/* Tags field */}
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                type="text"
                name="tags"
                value={editForm.values.tags}
                onChange={editForm.handleChange}
                placeholder="comma-separated tags"
                className="form-input"
              />
            </div>

            {/* Edit buttons */}
            <div className="form-buttons">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={editForm.isSubmitting}
              >
                {editForm.isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          // View mode
          <article className="note-content">
            <h1 className="note-title">{note.title}</h1>

            <div className="note-meta">
              <span className="note-date">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </span>
              {note.updatedAt !== note.createdAt && (
                <span className="note-date">
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {note.tags.length > 0 && (
              <div className="note-tags">
                {note.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="note-text">{note.content}</p>
          </article>
        )}
      </div>
    </div>
  );
};

export default NotePage;
