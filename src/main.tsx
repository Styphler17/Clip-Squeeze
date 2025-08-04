import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress Chrome's runtime.lastError messages from FFmpeg.wasm
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('runtime.lastError')) {
      return; // Suppress FFmpeg.wasm runtime.lastError messages
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
