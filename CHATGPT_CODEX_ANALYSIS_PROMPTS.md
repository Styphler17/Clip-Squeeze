# ChatGPT Codex Analysis Prompts for Clip-Squeeze Project

## Project Overview
You are analyzing a React TypeScript project called "Clip-Squeeze" - a video compression and repair web application built with:
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Radix UI + Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **Build Tool**: Vite with SWC

## Primary Analysis Tasks

### 1. Code Quality & TypeScript Issues
```
Please analyze the entire Clip-Squeeze project for:
- TypeScript compilation errors and type mismatches
- Unused imports, variables, and functions
- Missing type definitions and interfaces
- Inconsistent type usage across components
- Any 'any' types that should be properly typed
- React component prop type definitions
- Hook usage violations (Rules of Hooks)
- Potential memory leaks in useEffect hooks
```

### 2. React & Component Issues
```
Check all React components for:
- Missing key props in lists and arrays
- Incorrect hook usage (hooks called conditionally or in loops)
- Unnecessary re-renders due to missing dependencies in useEffect
- Missing error boundaries
- Accessibility issues (ARIA labels, semantic HTML)
- Component prop validation
- State management best practices
- Event handler memory leaks
- Missing cleanup in useEffect hooks
```

### 3. Performance & Optimization
```
Analyze the project for performance issues:
- Large bundle size contributors
- Unnecessary re-renders
- Missing React.memo, useMemo, or useCallback optimizations
- Inefficient data fetching patterns
- Memory leaks in event listeners
- Large component trees that could be split
- Unused dependencies in package.json
- Duplicate code that could be extracted to utilities
```

### 4. Security & Best Practices
```
Review the codebase for security concerns:
- XSS vulnerabilities in user input handling
- Unsafe file handling in video compression features
- Missing input validation
- Exposed sensitive information in client-side code
- Insecure API calls or data transmission
- Missing error handling for file operations
- Proper sanitization of user inputs
```

### 5. File Structure & Organization
```
Evaluate the project structure for:
- Consistent file naming conventions
- Proper separation of concerns
- Missing index files for clean imports
- Duplicate utility functions
- Components that could be better organized
- Missing barrel exports
- Inconsistent import/export patterns
```

### 6. Configuration & Build Issues
```
Check configuration files for:
- TypeScript configuration conflicts
- ESLint rule conflicts or missing rules
- Vite configuration optimization
- Missing environment variables
- Build optimization opportunities
- Development vs production configuration differences
- Missing or incorrect path aliases
```

### 7. Video Compression Features
```
Focus on video-related components:
- File upload validation and error handling
- Video processing state management
- Progress tracking implementation
- Error handling for failed compressions
- Memory management for large video files
- Browser compatibility for video operations
- Proper cleanup of video resources
```

### 8. UI/UX Issues
```
Review the user interface for:
- Responsive design issues
- Accessibility compliance (WCAG guidelines)
- Loading states and error states
- User feedback mechanisms
- Form validation and error messages
- Consistent styling patterns
- Mobile responsiveness
```

## Detailed Prompts for Specific Areas

### Prompt 1: TypeScript & Type Safety
```
Please perform a comprehensive TypeScript analysis of the Clip-Squeeze project. Check for:
1. All TypeScript compilation errors
2. Missing type definitions for props, state, and functions
3. Inconsistent type usage across similar components
4. Any 'any' types that should be properly typed
5. Missing interfaces for complex data structures
6. Type safety issues in video processing functions
7. Proper typing for React hooks and event handlers
8. Missing generic types where appropriate

Provide specific code fixes for each issue found.
```

### Prompt 2: React Best Practices
```
Analyze all React components in the Clip-Squeeze project for:
1. Rules of Hooks violations
2. Missing dependencies in useEffect hooks
3. Unnecessary re-renders and performance issues
4. Proper state management patterns
5. Component composition and prop drilling
6. Error boundary implementation
7. Loading and error state handling
8. Memory leak prevention

Provide optimized code examples for problematic components.
```

### Prompt 3: Performance Optimization
```
Review the Clip-Squeeze project for performance bottlenecks:
1. Large bundle size analysis
2. Component optimization opportunities (React.memo, useMemo, useCallback)
3. Inefficient data fetching patterns
4. Memory leaks in video processing
5. Unused code and dependencies
6. Lazy loading opportunities
7. Code splitting recommendations
8. Bundle analysis and optimization

Provide specific optimization strategies and code examples.
```

### Prompt 4: Security & File Handling
```
Analyze the video compression features for security issues:
1. File upload validation and sanitization
2. XSS prevention in user inputs
3. Secure video processing implementation
4. Error handling for malicious files
5. Data privacy in video processing
6. Browser security considerations
7. Input validation patterns
8. Safe file download mechanisms

Provide security improvements and code examples.
```

### Prompt 5: Accessibility & UX
```
Review the Clip-Squeeze UI for accessibility and UX issues:
1. WCAG 2.1 compliance gaps
2. Keyboard navigation support
3. Screen reader compatibility
4. Color contrast issues
5. Focus management
6. Error message accessibility
7. Loading state indicators
8. Mobile responsiveness

Provide accessibility improvements and code examples.
```

### Prompt 6: Code Quality & Refactoring
```
Analyze the codebase for code quality issues:
1. Code smells and anti-patterns
2. Duplicate code that can be extracted
3. Functions that are too long or complex
4. Missing error handling
5. Inconsistent coding patterns
6. Poor variable naming
7. Missing comments for complex logic
8. Overly complex component logic

Provide refactoring suggestions and improved code examples.
```

### Prompt 7: Testing & Quality Assurance
```
Review the project for testing and quality issues:
1. Missing unit tests for critical functions
2. Missing integration tests for user flows
3. Error scenarios not covered
4. Edge cases in video processing
5. Browser compatibility testing gaps
6. Performance testing needs
7. Accessibility testing requirements
8. Security testing considerations

Provide testing strategies and example test cases.
```

### Prompt 8: Build & Deployment Issues
```
Analyze build and deployment configuration:
1. Vite configuration optimization
2. Environment variable management
3. Build size optimization
4. Development vs production differences
5. Missing build scripts
6. Deployment configuration issues
7. Asset optimization
8. Bundle analysis setup

Provide configuration improvements and optimization strategies.
```

## Final Comprehensive Analysis Prompt
```
Please provide a complete analysis of the Clip-Squeeze project covering:

1. **Critical Issues**: Any bugs that prevent the app from working
2. **Type Safety**: All TypeScript and type-related issues
3. **Performance**: Optimization opportunities and bottlenecks
4. **Security**: Vulnerabilities and security improvements
5. **Code Quality**: Code smells, anti-patterns, and refactoring opportunities
6. **User Experience**: Accessibility, responsiveness, and UX issues
7. **Maintainability**: Code organization, documentation, and best practices
8. **Testing**: Missing test coverage and quality assurance
9. **Build & Deployment**: Configuration and optimization issues

For each issue found:
- Provide the specific file and line number
- Explain the problem and its impact
- Provide a complete code fix
- Suggest preventive measures

Prioritize issues by severity (Critical, High, Medium, Low) and provide a summary of the most important fixes needed.

Focus especially on:
- Video compression functionality reliability
- File handling security
- User experience smoothness
- Performance with large video files
- Cross-browser compatibility
- Mobile device support
```

## Additional Context for Codex
- The project uses Vite with SWC for fast builds
- Video compression happens client-side using browser APIs
- The app has multiple pages: video compression, repair, history, settings, etc.
- Uses modern React patterns with hooks and functional components
- Implements a comprehensive UI component library with Radix UI primitives
- Has form validation with React Hook Form and Zod schemas
- Uses TanStack Query for data fetching and caching
- Implements responsive design with Tailwind CSS
- Has comprehensive UI components from shadcn/ui

## Usage Instructions
1. Copy the relevant prompt based on what you want to analyze
2. Paste it into ChatGPT Codex
3. Upload your project files or provide the codebase
4. Request specific fixes and improvements
5. Use the comprehensive analysis prompt for a full project review

## Priority Areas to Focus On
1. **Video Processing**: Core functionality reliability
2. **Type Safety**: TypeScript errors and type definitions
3. **Performance**: Large file handling and memory management
4. **Security**: File upload and processing safety
5. **User Experience**: Loading states, error handling, accessibility
6. **Code Quality**: Maintainability and best practices
7. **Testing**: Coverage for critical user flows
8. **Build Optimization**: Bundle size and performance

Use these prompts systematically to get a thorough analysis and fixes for your Clip-Squeeze project! 