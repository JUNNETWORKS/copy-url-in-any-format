import React, { useState } from 'react';
import type { Format, PageInfo } from '../../shared/types';
import { formatUrl } from '../../shared/formatters';

interface FormatListProps {
  formats: Format[];
  pageInfo: PageInfo;
}

export const FormatList: React.FC<FormatListProps> = ({
  formats,
  pageInfo,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

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
    } catch (error) {
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

  return (
    <div className="format-list">
      {formats.map((format) => {
        const preview =
          hoveredId === format.id ? formatUrl(pageInfo, format) : null;
        const isCopied = copiedId === format.id;
        const hasError = errorId === format.id;

        return (
          <div key={format.id} className="format-item">
            <button
              className="format-button"
              onClick={() => handleCopy(format)}
              onMouseEnter={() => setHoveredId(format.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="format-name">{format.name}</span>
              {isCopied && <span className="status">Copied!</span>}
              {hasError && <span className="status error">Failed to copy</span>}
            </button>
            {preview && <div className="preview">{preview}</div>}
          </div>
        );
      })}
    </div>
  );
};
