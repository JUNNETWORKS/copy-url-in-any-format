import React, { useEffect, useState } from 'react';
import { FormatEditor } from './components/FormatEditor';
import { FormatStorage } from '../shared/storage';
import type { Format } from '../shared/types';

export const Options: React.FC = () => {
  const [formats, setFormats] = useState<Format[]>([]);
  const [editingFormat, setEditingFormat] = useState<Format | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const storage = new FormatStorage();

  useEffect(() => {
    loadFormats();
  }, []);

  const loadFormats = async () => {
    try {
      const loadedFormats = await storage.getFormats();
      setFormats(loadedFormats);
    } catch (error) {
      console.error('Failed to load formats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (format: Omit<Format, 'id' | 'createdAt' | 'updatedAt'> & Partial<Format>) => {
    try {
      await storage.saveFormat(format);
      await loadFormats();
      setEditingFormat(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save format:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteFormat(id);
      await loadFormats();
    } catch (error) {
      console.error('Failed to delete format:', error);
    }
  };

  const handleCancel = () => {
    setEditingFormat(null);
    setIsAdding(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>Copy URL in any format - Settings</h1>
      </header>

      <main className="options-main">
        <section className="formats-section">
          <div className="section-header">
            <h2>Formats</h2>
            {!isAdding && !editingFormat && (
              <button
                className="add-button"
                onClick={() => setIsAdding(true)}
              >
                Add New Format
              </button>
            )}
          </div>

          {(isAdding || editingFormat) && (
            <FormatEditor
              format={editingFormat || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          <div className="formats-list">
            {formats.map((format) => (
              <div key={format.id} className="format-item">
                <div className="format-info">
                  <h3>{format.name}</h3>
                  <code className="format-template">{format.template}</code>
                </div>
                <div className="format-actions">
                  <button
                    className="edit-button"
                    onClick={() => setEditingFormat(format)}
                    aria-label={`Edit ${format.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => {
                      if (window.confirm('Are you sure?')) {
                        handleDelete(format.id);
                      }
                    }}
                    aria-label={`Delete ${format.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h2>Available Variables</h2>
          <ul>
            <li><code>{'{title}'}</code> - The page title</li>
            <li><code>{'{url}'}</code> - The page URL</li>
          </ul>
        </section>
      </main>
    </div>
  );
};