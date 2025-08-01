import { useCallback, useState } from "react";
import { Upload, FileVideo, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
}

const SUPPORTED_FORMATS = [
  'video/mp4',
  'video/avi', 
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/webm',
  'video/3gpp',
  'video/ogg',
  'video/x-matroska'
];

export function DropZone({ 
  onFilesSelected, 
  maxFiles = 10, 
  maxFileSize = 5 * 1024 * 1024 * 1024, // 5GB
  disabled = false,
  className 
}: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = useCallback((files: FileList): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!SUPPORTED_FORMATS.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|wmv|flv|webm|3gp|ogv|m4v|qt)$/i)) {
        newErrors.push(`${file.name}: Unsupported format`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
        newErrors.push(`${file.name}: File too large (${sizeMB}MB > ${maxSizeMB}MB)`);
        return;
      }

      validFiles.push(file);
    });

    // Check total file count
    if (validFiles.length > maxFiles) {
      newErrors.push(`Too many files selected. Maximum ${maxFiles} files allowed.`);
      return { valid: [], errors: newErrors };
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files?.length) {
      const { valid, errors } = validateFiles(files);
      setErrors(errors);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  }, [onFilesSelected, disabled, validateFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const { valid, errors } = validateFiles(files);
      setErrors(errors);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [onFilesSelected, validateFiles]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer",
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
            dragActive ? "bg-video-primary text-white" : "bg-video-secondary text-muted-foreground"
          )}>
            {dragActive ? <Upload className="w-8 h-8" /> : <FileVideo className="w-8 h-8" />}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {dragActive ? "Drop your videos here" : "Select or drop video files"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Supports MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP, OGV, M4V, QT
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum {maxFiles} files • Up to {Math.round(maxFileSize / (1024 * 1024 * 1024))}GB per file
            </p>
          </div>

          {!disabled && (
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
}