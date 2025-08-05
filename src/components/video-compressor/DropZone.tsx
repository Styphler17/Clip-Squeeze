import { useCallback, useState, memo } from "react";
import { Upload, FileVideo, AlertCircle, CheckCircle, Cloud, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
}

export const DropZone = memo(({ 
  onFilesSelected, 
  maxFiles = 10, 
  maxFileSize = 10 * 1024 * 1024 * 1024, // 10GB
  disabled = false,
  className 
}: DropZoneProps) => {
  const isMobile = useIsMobile();
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: FileList): { valid: File[], errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    setIsValidating(true);

    try {
      for (const file of Array.from(files)) {
        // Basic file name validation
        const fileName = file.name.toLowerCase();
        if (fileName.includes('..') || fileName.includes('\\') || fileName.includes('/')) {
          newErrors.push(`${file.name}: Invalid file name`);
          continue;
        }

        // More lenient file type validation for mobile
        const extension = file.name.split('.').pop()?.toLowerCase();
        const hasVideoExtension = extension && /^(mp4|avi|mov|mkv|wmv|flv|webm|3gp|ogv|m4v|qt|m4a|mpg|mpeg|ts|mts|m2ts)$/i.test(extension);
        const hasVideoMimeType = file.type.startsWith('video/') || 
                                file.type === 'application/octet-stream' ||
                                file.type === '' ||
                                file.type === 'application/mp4' ||
                                file.type === 'application/x-m4v' ||
                                file.type === 'video/*';
        
        // On mobile, be more lenient with file type validation
        if (isMobile) {
          // Accept files with video extensions or if they have a size > 1MB (likely video files)
          if (!hasVideoExtension && !hasVideoMimeType && file.size < 1024 * 1024) {
            newErrors.push(`${file.name}: Unsupported format`);
            continue;
          }
        } else {
          // Desktop validation - stricter
          if (!hasVideoExtension && !hasVideoMimeType) {
            newErrors.push(`${file.name}: Unsupported format`);
            continue;
          }
        }

        // Check file size
        if (file.size > maxFileSize) {
          const sizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(1);
          newErrors.push(`${file.name}: File too large (${sizeGB}GB > 10GB)`);
          continue;
        }

        // Check for empty files
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
  }, [maxFiles, maxFileSize, isMobile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    console.log('Processing files...');
    const { valid, errors } = validateFiles(files);
    console.log('Validation result - valid:', valid.length, 'errors:', errors.length);
    
    setErrors(errors);
    
    if (valid.length > 0) {
      console.log('Calling onFilesSelected with', valid.length, 'files');
      onFilesSelected(valid);
      
      // Simulate upload progress for visual feedback
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 50);
      
      // Clean up interval after 5 seconds to prevent memory leaks
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 5000);
    }
  }, [validateFiles, onFilesSelected]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Button clicked');
    if (inputRef.current) {
      console.log('Triggering file input click');
      inputRef.current.click();
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event triggered');
    if (e.target.files && e.target.files.length > 0) {
      console.log('Files selected:', e.target.files.length, 'FileList');
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTime < 500) {
      return; // Debounce rapid clicks
    }
    setLastClickTime(now);
    
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, [lastClickTime]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSupportedFormats = () => {
    return ['MP4', 'AVI', 'MOV', 'MKV', 'WMV', 'FLV', 'WebM', '3GP', 'OGV', 'M4V'];
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative group dropzone-enhanced",
          "border-2 border-dashed rounded-lg p-8",
          "transition-all duration-300 ease-out",
          "bg-gradient-to-br from-background to-muted/20",
          dragActive && "drag-active",
          isHovered && "border-primary/50 bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          "animate-in"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Drop video files here or click to browse"
                  onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (inputRef.current) {
                inputRef.current.click();
              }
            }
          }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
        </div>

        {/* Upload Progress Overlay */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="loading-spinner mb-4" />
              <p className="text-sm text-muted-foreground">Processing files...</p>
              <div className="w-32 h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-4">
          {/* Enhanced Icon */}
          <div className="relative mx-auto w-16 h-16">
            <div className={cn(
              "absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center",
              "transition-all duration-300",
              dragActive && "scale-110 bg-primary/20",
              isHovered && "scale-105"
            )}>
              <Upload className={cn(
                "w-8 h-8 text-primary transition-all duration-300",
                dragActive && "animate-bounce",
                isHovered && "scale-110"
              )} />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-2 -right-2">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-accent-foreground" />
              </div>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center animate-pulse delay-300">
                <FileVideo className="w-3 h-3 text-secondary-foreground" />
              </div>
            </div>
          </div>

          {/* Enhanced Text */}
          <div className="space-y-2">
            <h3 className="text-responsive-lg font-semibold text-foreground">
              {dragActive ? 'Drop your videos here' : 'Upload Video Files'}
            </h3>
            <p className="text-responsive-sm text-muted-foreground max-w-md mx-auto">
              Drag and drop your video files here, or{' '}
              <span className="text-primary font-medium underline decoration-dotted underline-offset-4">
                click to browse
              </span>
            </p>
          </div>

          {/* Enhanced Button */}
          <Button
            onClick={handleButtonClick}
            disabled={disabled || isValidating}
            className={cn(
              "btn-enhanced mobile-enhanced",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "px-6 py-3 rounded-lg font-medium",
              "transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isValidating && "loading-pulse"
            )}
            size="lg"
          >
            {isValidating ? (
              <>
                <div className="loading-spin w-4 h-4 mr-2" />
                Validating...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 mr-2" />
                Choose Files
              </>
            )}
          </Button>

          {/* Enhanced File Info */}
          <div className="space-y-3 pt-4">
            {/* Supported Formats */}
            <div className="flex flex-wrap justify-center gap-2">
              {getSupportedFormats().slice(0, 6).map((format) => (
                <Badge 
                  key={format} 
                  variant="secondary" 
                  className="badge-enhanced text-xs px-2 py-1"
                >
                  {format}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{getSupportedFormats().length - 6} more
              </Badge>
            </div>

            {/* File Limits */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
              <p>Maximum files: {maxFiles}</p>
            </div>
          </div>
        </div>

                 {/* Hidden File Input */}
         <input
           ref={inputRef}
           type="file"
           multiple
           accept="video/*,.mp4,.avi,.mov,.mkv,.wmv,.flv,.webm,.3gp,.ogv,.m4v,.qt,.m4a,.mpg,.mpeg,.ts,.mts,.m2ts"
           onChange={handleFileInput}
           className="hidden"
           disabled={disabled}
           aria-label="Select video files"
           title="Select video files to upload"
         />
      </div>

      {/* Enhanced Error Display */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2 animate-in">
          {errors.map((error, index) => (
            <div
              key={index}
              className="error-enhanced flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {uploadProgress === 100 && (
        <div className="mt-4 animate-in">
          <div className="success-enhanced flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-green-500">Files uploaded successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
});

DropZone.displayName = 'DropZone';