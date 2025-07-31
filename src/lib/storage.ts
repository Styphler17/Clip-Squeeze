export interface CompressionHistoryItem {
  id: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  preset: string;
  date: string;
  time: string;
  duration: string;
  status: 'completed' | 'cancelled' | 'error';
  fileType: string;
  settings: {
    preset: string;
    crf: number;
    scale: number;
  };
}

export interface AppSettings {
  defaultPreset: string;
  customSettings: {
    crf: number;
    preset: string;
    scale: number;
    preserveQuality: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  autoSaveHistory: boolean;
}

const STORAGE_KEYS = {
  COMPRESSION_HISTORY: 'clipsqueeze-history',
  APP_SETTINGS: 'clipsqueeze-settings',
} as const;

import { sanitizeForCSV } from './utils';

// History Management
export const getCompressionHistory = (): CompressionHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPRESSION_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading compression history:', error);
    return [];
  }
};

export const saveCompressionHistory = (history: CompressionHistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPRESSION_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving compression history:', error);
  }
};

export const addToHistory = (item: Omit<CompressionHistoryItem, 'id' | 'date' | 'time'>): void => {
  const history = getCompressionHistory();
  const now = new Date();
  const newItem: CompressionHistoryItem = {
    ...item,
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
  };
  
  history.unshift(newItem); // Add to beginning
  saveCompressionHistory(history);
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.COMPRESSION_HISTORY);
};

export const exportHistory = (): void => {
  const history = getCompressionHistory();
  const csvContent = [
    ['File Name', 'Original Size (MB)', 'Compressed Size (MB)', 'Compression Ratio (%)', 'Preset', 'Date', 'Time', 'Status'],
    ...history.map(item => [
      sanitizeForCSV(item.fileName),
      (item.originalSize / (1024 * 1024)).toFixed(2),
      (item.compressedSize / (1024 * 1024)).toFixed(2),
      item.compressionRatio.toFixed(1),
      sanitizeForCSV(item.preset),
      sanitizeForCSV(item.date),
      sanitizeForCSV(item.time),
      sanitizeForCSV(item.status)
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `compression-history-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Settings Management
export const getAppSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return stored ? JSON.parse(stored) : {
      defaultPreset: 'balanced',
      customSettings: {
        crf: 25,
        preset: 'medium',
        scale: 100,
        preserveQuality: false
      },
      theme: 'system',
      autoSaveHistory: true
    };
  } catch (error) {
    console.error('Error loading app settings:', error);
    return {
      defaultPreset: 'balanced',
      customSettings: {
        crf: 25,
        preset: 'medium',
        scale: 100,
        preserveQuality: false
      },
      theme: 'system',
      autoSaveHistory: true
    };
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
  }
};

// Statistics
export const getHistoryStats = () => {
  const history = getCompressionHistory();
  const completedJobs = history.filter(item => item.status === 'completed');
  
  const totalCompressions = completedJobs.length;
  const totalSpaceSaved = completedJobs.reduce((sum, item) => sum + (item.originalSize - item.compressedSize), 0);
  const avgCompression = completedJobs.length > 0 
    ? completedJobs.reduce((sum, item) => sum + item.compressionRatio, 0) / completedJobs.length 
    : 0;

  return {
    totalCompressions,
    totalSpaceSaved,
    avgCompression,
    totalJobs: history.length
  };
}; 
