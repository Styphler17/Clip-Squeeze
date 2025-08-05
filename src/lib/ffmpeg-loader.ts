import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let isLoaded = false;
let isLoading = false;

export const loadFFmpeg = async (retryCount = 0): Promise<FFmpeg> => {
  console.log(`loadFFmpeg called - checking if already loaded... (attempt ${retryCount + 1})`);
  if (ffmpeg && isLoaded) {
    console.log('FFmpeg already loaded, returning existing instance');
    return ffmpeg;
  }

  if (isLoading) {
    console.log('FFmpeg is currently loading, waiting...');
    // Wait for the current loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpeg && isLoaded) {
      console.log('FFmpeg loaded while waiting, returning instance');
      return ffmpeg;
    }
  }

  console.log('Starting FFmpeg loading process...');
  isLoading = true;
  
  try {
    ffmpeg = new FFmpeg();
    
    // Configure FFmpeg to use the correct core files
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg log:', message);
    });
    
    ffmpeg.on('progress', ({ progress, time }) => {
      console.log('FFmpeg progress:', progress, time);
    });
    
    console.log('Loading FFmpeg core files...');
    
    // Check if we can access FFmpeg core files
    try {
      console.log('Checking FFmpeg core files availability...');
      // Try to access the core files from CDN first
      const cdnCoreResponse = await fetch('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js');
      const cdnWasmResponse = await fetch('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm');
      
      if (cdnCoreResponse.ok && cdnWasmResponse.ok) {
        console.log('FFmpeg core files are accessible from CDN');
      } else {
        console.log('CDN files not accessible, trying local files...');
        const localCoreResponse = await fetch('/ffmpeg-core.js');
        const localWasmResponse = await fetch('/ffmpeg-core.wasm');
        
        if (!localCoreResponse.ok || !localWasmResponse.ok) {
          throw new Error('FFmpeg core files not found');
        }
        console.log('FFmpeg core files are accessible locally');
      }
    } catch (fetchError) {
      console.error('Failed to access FFmpeg core files:', fetchError);
      throw new Error('FFmpeg core files are not accessible. Please check your internet connection and try again.');
    }
    
    // Try multiple loading strategies with much shorter timeouts
    const loadingStrategies = [
      // Strategy 1: Try with 5s timeout (very fast)
      async () => {
        console.log('Strategy 1: Trying with 5s timeout...');
        if (!ffmpeg) throw new Error('FFmpeg instance is null');
        const loadPromise = ffmpeg.load();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Loading timed out after 5 seconds')), 5000);
        });
        return Promise.race([loadPromise, timeoutPromise]);
      },
      
      // Strategy 2: Try with 10s timeout
      async () => {
        console.log('Strategy 2: Trying with 10s timeout...');
        if (!ffmpeg) throw new Error('FFmpeg instance is null');
        const loadPromise = ffmpeg.load();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Loading timed out after 10 seconds')), 10000);
        });
        return Promise.race([loadPromise, timeoutPromise]);
      },
      
      // Strategy 3: Try with 20s timeout
      async () => {
        console.log('Strategy 3: Trying with 20s timeout...');
        if (!ffmpeg) throw new Error('FFmpeg instance is null');
        const loadPromise = ffmpeg.load();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Loading timed out after 20 seconds')), 20000);
        });
        return Promise.race([loadPromise, timeoutPromise]);
      },
      
      // Strategy 4: Try without timeout (last resort)
      async () => {
        console.log('Strategy 4: Trying without timeout (last resort)...');
        if (!ffmpeg) throw new Error('FFmpeg instance is null');
        return ffmpeg.load();
      }
    ];

    let lastError: Error | null = null;
    
    for (let i = 0; i < loadingStrategies.length; i++) {
      try {
        console.log(`Attempting loading strategy ${i + 1}...`);
        await loadingStrategies[i]();
        console.log(`FFmpeg core loaded successfully with strategy ${i + 1}`);
        isLoaded = true;
        return ffmpeg;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Strategy ${i + 1} failed:`, lastError.message);
        
        // If this isn't the last strategy, create a new FFmpeg instance
        if (i < loadingStrategies.length - 1) {
          console.log('Creating new FFmpeg instance for next strategy...');
          ffmpeg = new FFmpeg();
          ffmpeg.on('log', ({ message }) => {
            console.log('FFmpeg log:', message);
          });
          ffmpeg.on('progress', ({ progress, time }) => {
            console.log('FFmpeg progress:', progress, time);
          });
        }
      }
    }

    // All strategies failed
    throw lastError || new Error('All loading strategies failed');

  } catch (error) {
    console.error('All FFmpeg loading strategies failed:', error);
    
    // Retry with shorter delays (max 5 retries)
    if (retryCount < 5) {
      const delay = Math.min(500 * (retryCount + 1), 2000); // 500ms, 1s, 1.5s, 2s, 2s
      console.log(`Retrying FFmpeg loading in ${delay}ms (attempt ${retryCount + 1}/5)...`);
      
      isLoading = false;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return loadFFmpeg(retryCount + 1);
    }
    
    // Final fallback: try one more time with a completely fresh approach
    console.log('All strategies failed, trying final fallback...');
    try {
      isLoading = false;
      ffmpeg = null;
      isLoaded = false;
      
      // Wait a bit before final attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return loadFFmpeg(retryCount + 1);
    } catch (finalError) {
      throw new Error(`Failed to load video processing library after ${retryCount + 1} attempts: ${error instanceof Error ? error.message : String(error)}. Please check your internet connection and refresh the page.`);
    }
  } finally {
    isLoading = false;
  }
};

export { fetchFile, toBlobURL }; 