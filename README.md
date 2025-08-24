# ClipSqueeze - Professional Video Compression Tool

ClipSqueeze is a proprietary, privacy-focused video compression application that runs entirely in your browser. No uploads, no registration, no compromises.

## ⚠️ Proprietary Software

**COPYING, DISTRIBUTION, AND MODIFICATION ARE STRICTLY PROHIBITED.**

This software is protected by copyright laws and international treaties. Unauthorized copying, distribution, or modification will result in legal action.

## 🎬 Features

### Video Compression

- **100% Private & Secure**: All processing happens locally in your browser
- **Lightning Fast**: Powered by WebAssembly and FFmpeg for efficient compression
- **Works Everywhere**: No installation required, works on any modern browser
- **Smart File Limits**: Process files of any size, with automatic MP4 conversion for large non-MP4 files
- **Multiple Presets**: Choose from optimized compression presets or customize settings
- **Format Conversion**: Convert between different video formats (MP4, WebM, AVI, MOV, etc.)
- **Size Safety**: Automatically keeps the original file if compression would increase size
- **Real-time Progress**: Track compression and conversion progress in real-time
- **Batch Processing**: Handle multiple files simultaneously

### Modern Interface

- **Tab-Based Workflow**: Organized into Upload, Settings, Progress, and Final Results tabs
- **Video Previews**: Preview both original and compressed videos side-by-side
- **Theme Support**: Light and dark theme with beautiful green accent colors
- **Collapsible Sidebar**: Space-efficient navigation with expand/collapse functionality
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progress Tracking**: Real-time progress bars and time estimates
- **Download Management**: Easy download of compressed files with proper naming

### Advanced Features

- **Client-Side Processing**: Your files never leave your device
- **Memory Management**: Efficient handling of large video files
- **Error Recovery**: Robust error handling with retry mechanisms
- **History Tracking**: Keep track of your compression history
- **Settings Persistence**: Your preferences are saved locally

## 🚀 Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Navigate to the project directory
cd clipsqueeze

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080` (or the next available port).

## 🛠️ Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React** - Modern UI framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **FFmpeg.wasm** - Video processing engine
- **WebAssembly** - High-performance computing
- **Local Storage** - Job persistence and configuration management
- **next-themes** - Theme management system

## 📹 Supported Formats

- **Input Formats**: MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP, OGV, M4V, QT
- **Output Formats**: MP4, WebM, AVI, MOV
- **File Size**: Unlimited file size support
- **Batch Processing**: Up to 10 files simultaneously

## 💻 Development

```sh
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🚀 Deployment

Build the project and deploy to any static hosting service:

```sh
npm run build
```

The built files will be in the `dist` directory.

## 📄 License

This project is proprietary software. All rights reserved.

**COPYING, DISTRIBUTION, AND MODIFICATION ARE STRICTLY PROHIBITED.**

For licensing inquiries or permission requests, contact: [Contact Information]

---

**By using this Software, you acknowledge that you have read the license and agree to be bound by its terms.**
