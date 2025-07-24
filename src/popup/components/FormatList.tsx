import React, { useState } from 'react';
import type { Format, PageInfo } from '../../shared/types';
import { formatUrl } from '../../shared/formatters';

interface FormatListProps {
  formats: Format[];
  pageInfo: PageInfo;
  autoCopiedFormatId?: string | null;
}

export const FormatList: React.FC<FormatListProps> = ({
  formats,
  pageInfo,
  autoCopiedFormatId,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(autoCopiedFormatId || null);
  const [copiedId, setCopiedId] = useState<string | null>(autoCopiedFormatId || null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCopy = async (format: Format) => {
    const formattedText = formatUrl(pageInfo, format);

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedId(format.id);
      setErrorId(null);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      setErrorId(format.id);
      setCopiedId(null);

      // Reset after 2 seconds
      setTimeout(() => {
        setErrorId(null);
      }, 2000);
    }
  };

  if (formats.length === 0) {
    return <div className="empty-state">No formats available</div>;
  }

  const previewFormat = formats.find(f => f.id === (hoveredId || selectedId));
  const previewText = previewFormat ? formatUrl(pageInfo, previewFormat) : '';

  return (
    <div>
      <div className="preview-box">
        <div className="preview-label">Preview:</div>
        <div className="preview-content">
          {previewText || 'Select a format to preview'}
        </div>
      </div>
      <div className="format-list">
        {formats.map((format) => {
          const isCopied = copiedId === format.id;
          const hasError = errorId === format.id;
          const isSelected = selectedId === format.id;

          return (
            <div key={format.id} className="format-item">
              <button
                className={`format-button ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedId(format.id);
                  handleCopy(format);
                }}
                onMouseEnter={() => setHoveredId(format.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span className="format-name">{format.name}</span>
                {isCopied && <span className="status">Copied!</span>}
                {hasError && <span className="status error">Failed to copy</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
