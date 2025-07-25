# ClipSqueeze - Video Compression Made Simple

ClipSqueeze is a professional, privacy-focused video compression tool that runs entirely in your browser. No uploads, no registration, no compromises.

## Features

- **100% Private & Secure**: All processing happens locally in your browser
- **Lightning Fast**: Powered by WebAssembly and FFmpeg for efficient compression
- **Works Everywhere**: No installation required, works on any modern browser
- **No Size Limits**: Process files up to 5GB with support for all major formats
- **Multiple Presets**: Choose from optimized compression presets or customize settings

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd clipsqueeze

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080` (or the next available port).

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React** - Modern UI framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **FFmpeg.wasm** - Video processing engine
- **WebAssembly** - High-performance computing

## Supported Formats

- MP4, AVI, MOV, MKV, WMV
- FLV, WebM, 3GP, OGV, M4V, QT

## Development

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

## Deployment

Build the project and deploy to any static hosting service:

```sh
npm run build
```

The built files will be in the `dist` directory.

## License

This project is open source and available under the MIT License.
