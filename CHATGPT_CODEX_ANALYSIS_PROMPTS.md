# ChatGPT Codex Analysis Prompts for Clip-Squeeze Project

## Project Overview
You are analyzing a React TypeScript project called "Clip-Squeeze" - a video compression and repair web application built with:
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Radix UI + Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **Build Tool**: Vite with SWC

## Quick Start Prompts

### 1. Immediate Issue Detection
```
Analyze the Clip-Squeeze project and identify:
1. All TypeScript compilation errors (run tsc --noEmit)
2. React runtime errors and console warnings
3. Build failures and dependency issues
4. Critical bugs that prevent the app from working
5. Performance issues causing crashes or freezes

Provide specific file locations, error messages, and immediate fixes for each issue found.
```

### 2. Video Compression Core Issues
```
Focus on the video compression functionality in Clip-Squeeze:
1. Check VideoCompressor.tsx for compression logic errors
2. Verify file upload and processing in DropZone.tsx
3. Test VideoPreview.tsx for display issues
4. Validate ProgressTracker.tsx for progress tracking
5. Check for memory leaks in video processing
6. Verify file size reduction is working correctly
7. Test download functionality for compressed files

Provide fixes for any issues preventing proper video compression.
```

### 3. React Performance & Memory Issues
```
Analyze React components for performance problems:
1. Infinite re-renders and useEffect dependency issues
2. Memory leaks in video processing components
3. Missing cleanup in useEffect hooks
4. Unnecessary re-renders due to missing memoization
5. Event listener memory leaks
6. Large component trees causing performance issues

Fix all performance issues and provide optimized code.
```

## Detailed Analysis Prompts

### Prompt 1: Critical Bug Detection & Fixes
```
Run a comprehensive analysis of the Clip-Squeeze project to find and fix critical bugs:

1. **TypeScript Errors**: Run type checking and fix all compilation errors
2. **React Runtime Errors**: Find and fix "Maximum update depth exceeded", "removeChild on Node", and similar errors
3. **Build Issues**: Check for missing imports, circular dependencies, and build failures
4. **Video Processing Bugs**: Verify compression, file handling, and download functionality
5. **UI/UX Issues**: Fix overlapping elements, broken layouts, and responsive design problems

For each issue found:
- Provide the exact error message and file location
- Explain what's causing the problem
- Provide a complete, working code fix
- Test the fix to ensure it resolves the issue

Focus especially on:
- VideoCompressor.tsx compression logic
- VideoPreview.tsx display issues
- DropZone.tsx file handling
- ProgressTracker.tsx progress tracking
- Any infinite loops or memory leaks
```

### Prompt 2: TypeScript & Type Safety Fixes
```
Perform a comprehensive TypeScript analysis and fix all type-related issues:

1. **Compilation Errors**: Run `tsc --noEmit` and fix all errors
2. **Missing Types**: Add proper type definitions for all functions, props, and state
3. **Any Types**: Replace all `any` types with proper TypeScript types
4. **Interface Issues**: Create missing interfaces and fix type mismatches
5. **Hook Dependencies**: Fix useEffect and useCallback dependency arrays
6. **Event Handlers**: Properly type all event handlers and callbacks

Specific files to check:
- src/pages/VideoCompressor.tsx
- src/components/video-compressor/VideoPreview.tsx
- src/components/video-compressor/DropZone.tsx
- src/components/video-compressor/ProgressTracker.tsx
- src/components/video-compressor/CompressionSettings.tsx

Provide complete type-safe code for each file with issues.
```

### Prompt 3: React Performance Optimization
```
Analyze and optimize React performance in Clip-Squeeze:

1. **Infinite Re-renders**: Find and fix useEffect dependency issues
2. **Memory Leaks**: Check for missing cleanup in video processing
3. **Unnecessary Re-renders**: Add React.memo, useMemo, and useCallback where needed
4. **Event Listeners**: Fix memory leaks in keyboard and video event handlers
5. **Large Components**: Split large components into smaller, optimized pieces
6. **State Management**: Optimize state updates and prevent cascading re-renders

Focus on:
- VideoCompressor.tsx state management
- VideoPreview.tsx video event handling
- ProgressTracker.tsx progress updates
- DropZone.tsx file processing

Provide optimized code that eliminates performance issues.
```

### Prompt 4: Video Processing Reliability
```
Test and fix video compression functionality:

1. **File Upload**: Verify DropZone.tsx handles all file types correctly
2. **Compression Logic**: Check VideoCompressor.tsx compression simulation
3. **Progress Tracking**: Ensure ProgressTracker.tsx shows accurate progress
4. **File Size Reduction**: Verify compressed files are actually smaller
5. **Download Functionality**: Test download of compressed videos
6. **Error Handling**: Add proper error handling for failed compressions
7. **Memory Management**: Prevent memory leaks with large video files

Test scenarios:
- Upload various video formats (MP4, AVI, MOV, etc.)
- Test with different file sizes (small, medium, large)
- Verify compression ratios are realistic
- Test download functionality
- Check error handling for corrupted files

Provide fixes for any issues found in video processing.
```

### Prompt 5: UI/UX Issues & Accessibility
```
Fix UI/UX problems and improve accessibility:

1. **Layout Issues**: Fix overlapping elements and broken layouts
2. **Responsive Design**: Ensure proper mobile and tablet support
3. **Accessibility**: Add ARIA labels, keyboard navigation, and screen reader support
4. **Loading States**: Add proper loading indicators
5. **Error States**: Improve error messages and user feedback
6. **Color Contrast**: Fix any accessibility color issues
7. **Focus Management**: Ensure proper focus handling

Check components:
- VideoCompressor.tsx layout and responsiveness
- VideoPreview.tsx video controls accessibility
- DropZone.tsx drag and drop feedback
- ProgressTracker.tsx progress visualization
- All form components and buttons

Provide improved, accessible code for each component.
```

### Prompt 6: Build & Deployment Issues
```
Analyze and fix build and deployment problems:

1. **Build Errors**: Fix any Vite build failures
2. **Dependency Issues**: Resolve missing or conflicting dependencies
3. **Bundle Size**: Optimize bundle size and code splitting
4. **Environment Variables**: Check for missing environment configuration
5. **Asset Optimization**: Optimize images, fonts, and other assets
6. **Development vs Production**: Fix differences between dev and prod builds

Run these commands and fix issues:
- `npm run build`
- `npm run dev`
- `npx tsc --noEmit`
- `npm audit`

Provide fixes for any build or deployment issues found.
```

## Specific Component Fix Prompts

### VideoCompressor.tsx Issues
```
Analyze and fix VideoCompressor.tsx:

1. **State Management**: Fix infinite re-renders and state update issues
2. **Compression Logic**: Verify file size reduction is working
3. **Tab Navigation**: Fix tab switching and content display
4. **File Processing**: Ensure proper file handling and error management
5. **Memory Leaks**: Fix cleanup in useEffect hooks
6. **Type Safety**: Add proper TypeScript types

Common issues to check:
- Missing dependencies in useCallback/useEffect
- Circular dependencies between functions
- Improper state updates causing re-renders
- Missing error boundaries
- File processing memory leaks

Provide a complete, working version of VideoCompressor.tsx.
```

### VideoPreview.tsx Issues
```
Fix VideoPreview.tsx component:

1. **Video Display**: Ensure videos load and play correctly
2. **Controls**: Fix video player controls and keyboard shortcuts
3. **Picture-in-Picture**: Verify PiP functionality works
4. **Memory Management**: Prevent memory leaks with video elements
5. **Responsive Design**: Fix mobile video display issues
6. **Error Handling**: Add proper error states for failed video loads

Check for:
- Video element cleanup in useEffect
- Event listener memory leaks
- Keyboard shortcut conflicts
- Mobile touch event handling
- Video format compatibility

Provide an optimized VideoPreview.tsx component.
```

### DropZone.tsx Issues
```
Fix DropZone.tsx file upload component:

1. **File Validation**: Ensure proper file type and size validation
2. **Drag & Drop**: Fix drag and drop functionality
3. **Mobile Support**: Improve mobile file selection
4. **Error Handling**: Add proper error messages for invalid files
5. **Progress Feedback**: Add upload progress indicators
6. **Accessibility**: Improve keyboard and screen reader support

Test scenarios:
- Drag and drop various file types
- Mobile file selection
- Large file handling
- Invalid file rejection
- Multiple file selection

Provide an improved DropZone.tsx component.
```

## Testing & Validation Prompts

### Prompt 7: End-to-End Testing
```
Test the complete video compression workflow:

1. **File Upload**: Test uploading various video formats and sizes
2. **Compression Process**: Verify compression simulation works correctly
3. **Progress Tracking**: Check progress bars and status updates
4. **File Size Reduction**: Confirm compressed files are smaller
5. **Download**: Test downloading compressed videos
6. **Error Handling**: Test with corrupted or invalid files
7. **Mobile Experience**: Test on mobile devices

Test cases:
- MP4, AVI, MOV, MKV files
- Small (1MB), medium (50MB), large (500MB) files
- Corrupted video files
- Network interruption during compression
- Multiple simultaneous compressions

Provide fixes for any workflow issues found.
```

### Prompt 8: Browser Compatibility
```
Test and fix browser compatibility issues:

1. **Chrome/Edge**: Test on Chromium-based browsers
2. **Firefox**: Verify Firefox compatibility
3. **Safari**: Test Safari-specific issues
4. **Mobile Browsers**: Test iOS Safari and Chrome Mobile
5. **Video Codecs**: Check video format support across browsers
6. **File API**: Verify File API compatibility
7. **CSS Features**: Check CSS feature support

Common issues:
- Video format compatibility
- File API differences
- CSS Grid/Flexbox support
- Touch event handling
- Picture-in-Picture support

Provide browser-specific fixes and fallbacks.
```

## Final Comprehensive Fix Prompt
```
Provide a complete analysis and fix for the Clip-Squeeze project:

1. **Run All Tests**:
   - `npm run build` - Check for build errors
   - `npx tsc --noEmit` - Check TypeScript errors
   - `npm run dev` - Check for runtime errors
   - Test video compression workflow end-to-end

2. **Fix Critical Issues**:
   - TypeScript compilation errors
   - React runtime errors (infinite loops, memory leaks)
   - Video compression functionality
   - File upload and processing
   - UI/UX problems

3. **Optimize Performance**:
   - Fix unnecessary re-renders
   - Add proper memoization
   - Optimize bundle size
   - Fix memory leaks

4. **Improve Code Quality**:
   - Add proper TypeScript types
   - Fix component prop validation
   - Add error boundaries
   - Improve error handling

5. **Enhance User Experience**:
   - Fix responsive design issues
   - Add proper loading states
   - Improve accessibility
   - Add better error messages

For each issue found:
- Provide the exact error message and location
- Explain the root cause
- Provide a complete, working code fix
- Test the fix to ensure it works

Prioritize fixes by severity:
- **Critical**: App crashes, build failures, core functionality broken
- **High**: Performance issues, memory leaks, major UI problems
- **Medium**: TypeScript errors, accessibility issues, minor UI problems
- **Low**: Code quality, documentation, optimization opportunities

Focus especially on:
- Video compression reliability
- File handling security
- Performance with large files
- Cross-browser compatibility
- Mobile device support
```

## Usage Instructions for Codex

### Step 1: Initial Analysis
```
Upload your Clip-Squeeze project files to ChatGPT Codex and run:

"Please analyze this React TypeScript video compression project for critical issues. Run a comprehensive check for:
1. TypeScript compilation errors
2. React runtime errors
3. Build failures
4. Video compression functionality issues
5. Performance problems

Provide specific file locations, error messages, and immediate fixes for each issue found."
```

### Step 2: Component-Specific Fixes
```
For each problematic component, ask:

"Please analyze and fix [ComponentName].tsx. Focus on:
1. TypeScript errors and missing types
2. React performance issues
3. Memory leaks and cleanup
4. Functionality bugs
5. UI/UX problems

Provide a complete, working version of the component with all issues resolved."
```

### Step 3: End-to-End Testing
```
After fixes, test the complete workflow:

"Please test the complete video compression workflow in this project:
1. File upload functionality
2. Compression process
3. Progress tracking
4. File size reduction
5. Download functionality
6. Error handling

Identify any remaining issues and provide fixes."
```

## Priority Fix Order
1. **Critical**: Build errors, runtime crashes, core functionality
2. **High**: TypeScript errors, performance issues, major UI problems
3. **Medium**: Accessibility, responsive design, error handling
4. **Low**: Code quality, optimization, documentation

Use these prompts systematically to get a fully functional, optimized Clip-Squeeze project! 