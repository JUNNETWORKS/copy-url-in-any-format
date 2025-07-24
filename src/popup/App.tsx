import React, { useEffect, useState } from 'react';
import { FormatList } from './components/FormatList';
import { FormatStorage } from '../shared/storage';
import { formatUrl } from '../shared/formatters';
import type { Format, PageInfo } from '../shared/types';

export const Popup: React.FC = () => {
  const [formats, setFormats] = useState<Format[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoCopied, setAutoCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current tab info
        const [activeTab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!activeTab || !activeTab.url || !activeTab.title) {
          setError('Unable to get page information');
          setLoading(false);
          return;
        }

        setPageInfo({
          title: activeTab.title,
          url: activeTab.url,
        });

        // Get formats
        const storage = new FormatStorage();
        const loadedFormats = await storage.getFormatsWithDefaults();
        setFormats(loadedFormats);

        // Check for auto-copy format
        const autoCopyFormat = loadedFormats.find((f) => f.autoCopy);
        if (autoCopyFormat) {
          const formattedUrl = formatUrl({
            title: activeTab.title,
            url: activeTab.url,
          }, autoCopyFormat);
          await navigator.clipboard.writeText(formattedUrl);
          setAutoCopied(true);
          // Automatically close popup after 1 second
          setTimeout(() => {
            window.close();
          }, 1000);
        }
      } catch (err) {
        setError('Failed to load formats');
        console.error('Error loading popup data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  if (loading || autoCopied) {
    return (
      <div className="popup-container">
        <div className="loading">
          {autoCopied ? 'Copied!' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (error || !pageInfo) {
    return (
      <div className="popup-container">
        <div className="error">{error || 'Unable to get page information'}</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>Copy URL in any format</h1>
        <button className="settings-button" onClick={openSettings}>
          Settings
        </button>
      </header>
      <main className="popup-main">
        <FormatList formats={formats} pageInfo={pageInfo} />
      </main>
    </div>
  );
};
