import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let isLoaded = false;
let isLoading = false;

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  console.log('loadFFmpeg called - checking if already loaded...');
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
    
  } catch (error) {
    console.error('Failed to create FFmpeg instance:', error);
    isLoading = false;
    throw new Error('Failed to initialize video processing library');
  }
  
      try {
      console.log('Loading FFmpeg core files...');
      
      // Check if we can access FFmpeg core files from CDN
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
      
      // Load FFmpeg core with timeout
      console.log('Loading FFmpeg core...');
      
      const loadPromise = ffmpeg.load();
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FFmpeg loading timed out after 30 seconds')), 30000);
      });
      
      await Promise.race([loadPromise, timeoutPromise]);
    
    console.log('FFmpeg core loaded successfully');
    isLoaded = true;
    return ffmpeg;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    
    // Try alternative loading method
    try {
      console.log('Trying alternative loading method...');
      await ffmpeg.load();
      console.log('FFmpeg loaded with alternative method');
      isLoaded = true;
      return ffmpeg;
    } catch (altError) {
      console.error('Alternative loading method also failed:', altError);
      throw new Error(`Failed to load video processing library: ${altError.message}. Please refresh the page and try again.`);
    }
  } finally {
    isLoading = false;
  }
};

export interface ConversionOptions {
  inputFormat: string;
  outputFormat: string;
  crf?: number;
  scale?: number;
  preset?: string;
}

export interface ConversionProgress {
  progress: number;
  message: string;
}

export const compressVideo = async (
  inputBlob: Blob,
  options: ConversionOptions,
  onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> => {
  console.log('Starting video compression with options:', options);
  const ffmpegInstance = await loadFFmpeg();
  console.log('FFmpeg loaded successfully');
  
  if (!ffmpegInstance) {
    throw new Error('FFmpeg instance is not available');
  }
  
  try {
    onProgress?.({ progress: 0, message: 'Preparing video for compression...' });
    
    // Get input format from blob type or default to mp4
    const inputFormat = getFormatFromMimeType(inputBlob.type) || 'mp4';
    const outputFormat = options.outputFormat || inputFormat;
    
    // Write input file
    const inputFileName = `input.${inputFormat}`;
    const outputFileName = `output.${outputFormat}`;
    
    console.log('Writing input file to virtual filesystem...');
    await ffmpegInstance.writeFile(inputFileName, await fetchFile(inputBlob));
    console.log('Input file written successfully');
    onProgress?.({ progress: 10, message: 'Input file loaded...' });
    
    // Build FFmpeg command for compression with optimized settings for speed
    const command = [
      '-i', inputFileName,
      '-c:v', 'libx264', // Use H.264 codec for video
      '-c:a', 'aac',     // Use AAC codec for audio
      '-preset', options.preset || 'veryfast', // Use veryfast as default for speed
      '-crf', options.crf?.toString() || '25', // Slightly higher CRF for faster encoding
      '-threads', '0',   // Use all available CPU threads
      '-movflags', '+faststart', // Optimize for web streaming
      '-tune', 'fastdecode', // Optimize for fast decoding
      '-g', '30',        // Keyframe interval for faster seeking
      '-sc_threshold', '0', // Disable scene change detection for speed
      '-bf', '0',        // Disable B-frames for faster encoding
    ];
    
    // Add scaling if specified
    if (options.scale && options.scale !== 100) {
      const scale = options.scale / 100;
      command.push('-vf', `scale=iw*${scale}:ih*${scale}`);
    }
    
    // Add output format specific options with speed optimizations
    if (outputFormat === 'webm') {
      command.push('-c:v', 'libvpx', '-c:a', 'libopus', '-cpu-used', '4', '-deadline', 'realtime');
    } else if (outputFormat === 'avi') {
      command.push('-c:v', 'libx264', '-c:a', 'mp3', '-preset', 'veryfast');
    } else if (outputFormat === 'mov') {
      command.push('-c:v', 'libx264', '-c:a', 'aac', '-preset', 'veryfast');
    }
    
    command.push(outputFileName);
    
    console.log('FFmpeg command:', command);
    onProgress?.({ progress: 20, message: 'Starting video compression...' });
    
    // Execute compression with progress monitoring
    console.log('Executing FFmpeg command...');
    
    // Add timeout to prevent infinite hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('FFmpeg command timed out after 5 minutes')), 5 * 60 * 1000);
    });
    
    const execPromise = ffmpegInstance.exec(command);
    
    await Promise.race([execPromise, timeoutPromise]);
    console.log('FFmpeg command executed successfully');
    
    onProgress?.({ progress: 80, message: 'Compression complete, preparing output...' });
    
    // Read output file
    console.log('Reading output file from virtual filesystem...');
    const data = await ffmpegInstance.readFile(outputFileName);
    console.log('Output file read successfully, size:', data.byteLength);
    
    // Clean up files
    console.log('Cleaning up temporary files...');
    await ffmpegInstance.deleteFile(inputFileName);
    await ffmpegInstance.deleteFile(outputFileName);
    console.log('Temporary files cleaned up');
    
    onProgress?.({ progress: 90, message: 'Creating final file...' });
    
    // Convert to blob
    console.log('Creating output blob...');
    const outputBlob = new Blob([data], { 
      type: getMimeType(outputFormat) 
    });
    console.log('Output blob created, size:', outputBlob.size);
    
    onProgress?.({ progress: 100, message: 'Compression successful!' });
    console.log('Compression completed successfully!');
    
    return outputBlob;
  } catch (error) {
    console.error('Video compression failed:', error);
    throw new Error('Video compression failed. Please try again.');
  }
};

export const convertVideoFormat = async (
  inputBlob: Blob,
  options: ConversionOptions,
  onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> => {
  // Use the same compression function for format conversion
  return compressVideo(inputBlob, options, onProgress);
};

const getFormatFromMimeType = (mimeType: string): string | null => {
  const mimeToFormat: Record<string, string> = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/x-msvideo': 'avi',
    'video/quicktime': 'mov',
    'video/x-matroska': 'mkv',
    'video/x-flv': 'flv',
    'video/x-ms-wmv': 'wmv',
    'video/x-m4v': 'm4v',
    'video/3gpp': '3gp',
    'video/ogg': 'ogv'
  };
  
  return mimeToFormat[mimeType] || null;
};

const getMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'mkv': 'video/x-matroska',
    'flv': 'video/x-flv',
    'wmv': 'video/x-ms-wmv',
    'm4v': 'video/x-m4v',
    '3gp': 'video/3gpp',
    'ogv': 'video/ogg'
  };
  
  return mimeTypes[format] || 'video/mp4';
};

export const isFormatConversionSupported = (inputFormat: string, outputFormat: string): boolean => {
  const supportedFormats = ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'm4v', '3gp', 'ogv'];
  return supportedFormats.includes(inputFormat.toLowerCase()) && 
         supportedFormats.includes(outputFormat.toLowerCase());
};

export const getConversionProgress = (ffmpegInstance: FFmpeg): number => {
  // This would need to be implemented with progress callbacks
  // For now, return a placeholder
  return 0;
}; 