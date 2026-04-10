/**
 * Note Card Component
 *
 * Displays a single note in card format
 *
 * CONCEPTS: React components, props, destructuring, conditional rendering
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../types';
import { formatDate, truncateString } from '../utils/helpers';
import '../styles/NoteCard.css';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

/**
 * NoteCard Component
 *
 * Renders a note as a clickable card with preview
 *
 * CONCEPT: Component props, event handling, data display
 *
 * USAGE:
 * <NoteCard note={note} onDelete={handleDelete} />
 */
const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  /**
   * Handle delete button click
   * CONCEPT: Event handling, preventing default, callback invocation
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <Link to={`/notes/${note.id}`} className="note-card-link">
      <article className="note-card">
        <div className="note-card-header">
          <h3 className="note-title">{note.title}</h3>
          {onDelete && (
            <button className="delete-btn" onClick={handleDelete} title="Delete note">
              🗑️
            </button>
          )}
        </div>

        <p className="note-content">{truncateString(note.content, 100)}</p>

        <div className="note-meta">
          <div className="note-tags">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="tag">+{note.tags.length - 3}</span>
            )}
          </div>
          <span className="note-date">{formatDate(note.createdAt)}</span>
        </div>
      </article>
    </Link>
  );
};

export default NoteCard;
