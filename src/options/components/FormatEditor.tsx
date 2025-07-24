import React, { useState, useEffect } from 'react';
import type { Format } from '../../shared/types';
import { formatUrl } from '../../shared/formatters';

interface FormatEditorProps {
  format?: Format;
  onSave: (
    format: Omit<Format, 'id' | 'createdAt' | 'updatedAt'> & Partial<Format>
  ) => void;
  onCancel: () => void;
}

export const FormatEditor: React.FC<FormatEditorProps> = ({
  format,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(format?.name || '');
  const [template, setTemplate] = useState(format?.template || '');
  const [error, setError] = useState<string | null>(null);

  const examplePageInfo = {
    title: 'Example Page',
    url: 'https://example.com',
  };

  useEffect(() => {
    setName(format?.name || '');
    setTemplate(format?.template || '');
    setError(null);
  }, [format]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!template.trim()) {
      setError('Template is required');
      return;
    }

    const formatData: Omit<Format, 'id' | 'createdAt' | 'updatedAt'> &
      Partial<Format> = {
      name: name.trim(),
      template: template.trim(),
    };

    if (format?.id) {
      formatData.id = format.id;
      formatData.createdAt = format.createdAt;
    }

    onSave(formatData);
  };

  const preview = template
    ? formatUrl(examplePageInfo, {
        id: '',
        name: '',
        template,
        createdAt: 0,
        updatedAt: 0,
      })
    : '';

  return (
    <form className="format-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="format-name">Name</label>
        <input
          id="format-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Markdown, HTML"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="format-template">Template</label>
        <textarea
          id="format-template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="e.g., [{title}]({url})"
          rows={3}
        />
      </div>

      {preview && (
        <div className="preview-section">
          <label>Preview:</label>
          <code className="preview">{preview}</code>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" className="save-button">
          Save
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
