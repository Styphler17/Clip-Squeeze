import { useCallback, useState, memo } from "react";
import { Upload, FileVideo, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_VIDEO_FORMATS, FILE_SIZE_LIMITS } from "@/lib/constants";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
}

// File signatures for additional security validation
const FILE_SIGNATURES = {
  'mp4': [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // ftyp
  'avi': [0x52, 0x49, 0x46, 0x46], // RIFF
  'mov': [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70], // ftyp
  'mkv': [0x1A, 0x45, 0xDF, 0xA3], // EBML
  'wmv': [0x30, 0x26, 0xB2, 0x75], // ASF
  'flv': [0x46, 0x4C, 0x56, 0x01], // FLV
  'webm': [0x1A, 0x45, 0xDF, 0xA3], // EBML (same as MKV)
  '3gp': [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // ftyp
  'ogv': [0x4F, 0x67, 0x67, 0x53], // OggS
  'm4v': [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // ftyp
  'qt': [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70]  // ftyp
};

// Enhanced file validation with security checks
const validateFileSignature = async (file: File): Promise<boolean> => {
  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check against known file signatures
    for (const [, signature] of Object.entries(FILE_SIGNATURES)) {
      if (signature.every((byte, index) => bytes[index] === byte)) {
        return true;
      }
    }
    
    // If no signature matches, check file extension as fallback
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? Object.keys(FILE_SIGNATURES).includes(extension) : false;
  } catch (error) {
    console.warn('File signature validation failed:', error);
    // Don't fail on signature validation - use extension as fallback
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? Object.keys(FILE_SIGNATURES).includes(extension) : false;
  }
};

export const DropZone = memo(({ 
  onFilesSelected, 
  maxFiles = 10, 
  maxFileSize = 10 * 1024 * 1024 * 1024, // 10GB
  disabled = false,
  className 
}: DropZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateFiles = useCallback(async (files: FileList): Promise<{ valid: File[], errors: string[] }> => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    setIsValidating(true);

    try {
      for (const file of Array.from(files)) {
        // Security: Check file name for potentially malicious patterns
        const fileName = file.name.toLowerCase();
        if (fileName.includes('..') || fileName.includes('\\') || fileName.includes('/')) {
          newErrors.push(`${file.name}: Invalid file name`);
          continue;
        }

        // Check file type - simplified validation
        const extension = file.name.split('.').pop()?.toLowerCase();
        const isValidExtension = extension && /^(mp4|avi|mov|mkv|wmv|flv|webm|3gp|ogv|m4v|qt)$/i.test(extension);
        const isValidMimeType = SUPPORTED_VIDEO_FORMATS.includes(file.type as typeof SUPPORTED_VIDEO_FORMATS[number]);
        
        if (!isValidMimeType && !isValidExtension) {
          newErrors.push(`${file.name}: Unsupported format`);
          continue;
        }

        // Check file size
        if (file.size > maxFileSize) {
          const sizeMB = Math.round(file.size / (1024 * 1024));
          const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
          newErrors.push(`${file.name}: File too large (${sizeMB}MB > ${maxSizeMB}MB)`);
          continue;
        }

        // Security: Check for empty files
        if (file.size === 0) {
          newErrors.push(`${file.name}: File is empty`);
          continue;
        }

        validFiles.push(file);
      }

      // Check total file count
      if (validFiles.length > maxFiles) {
        newErrors.push(`Too many files selected. Maximum ${maxFiles} files allowed.`);
        return { valid: [], errors: newErrors };
      }
    } catch (error) {
      console.error('File validation error:', error);
      newErrors.push('An error occurred while validating files. Please try again.');
    } finally {
      setIsValidating(false);
    }

    return { valid: validFiles, errors: newErrors };
  }, [maxFiles, maxFileSize]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || isValidating) return;
    
    const files = e.dataTransfer.files;
    if (files?.length) {
      const { valid, errors } = await validateFiles(files);
      setErrors(errors);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  }, [onFilesSelected, disabled, validateFiles, isValidating]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setIsValidating(true);
      try {
        const { valid, errors } = await validateFiles(files);
        setErrors(errors);
        if (valid.length > 0) {
          onFilesSelected(valid);
        }
      } catch (error) {
        console.error('File input error:', error);
        setErrors(['An error occurred while processing files. Please try again.']);
      } finally {
        setIsValidating(false);
      }
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [onFilesSelected, validateFiles]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-smooth cursor-pointer",
          "hover:border-video-primary hover:bg-drop-zone-bg/50",
          {
            "border-drop-zone-active bg-video-primary/5": dragActive,
            "border-drop-zone-border bg-drop-zone-bg": !dragActive,
            "opacity-50 cursor-not-allowed": disabled,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area"
        aria-describedby="dropzone-description"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
              document.getElementById('file-input')?.click();
            }
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="video/*,.mp4,.avi,.mov,.mkv,.wmv,.flv,.webm,.3gp,.ogv,.m4v,.qt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
          aria-label="Select video files"
          title="Select video files to compress"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-smooth",
            dragActive ? "bg-video-primary text-white" : 
            isValidating ? "bg-video-primary text-white animate-pulse" :
            "bg-video-secondary text-muted-foreground"
          )}>
            {isValidating ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : dragActive ? (
              <Upload className="w-8 h-8" />
            ) : (
              <FileVideo className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isValidating ? "Processing files..." :
               dragActive ? "Drop your videos here" : 
               "Select or drop video files"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Supports MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP, OGV, M4V, QT
            </p>
            <p id="dropzone-description" className="text-xs text-muted-foreground">
              Maximum {maxFiles} files • Up to {Math.round(maxFileSize / (1024 * 1024 * 1024))}GB per file
            </p>
          </div>

          {!disabled && !isValidating && (
            <div className="flex items-center gap-2 text-video-primary">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Click to browse or drag & drop</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-video-danger/10 border border-video-danger/20 rounded-md">
              <AlertCircle className="w-4 h-4 text-video-danger mt-0.5 flex-shrink-0" />
              <span className="text-sm text-video-danger">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Supported Formats Info */}
      <div className="mt-4 p-3 bg-video-info/10 border border-video-info/20 rounded-md">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-video-info mt-0.5 flex-shrink-0" />
          <div className="text-sm text-video-info">
            <div className="font-medium mb-1">Supported Formats:</div>
            <div className="text-xs opacity-80">
              MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP, OGV, M4V, QT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});