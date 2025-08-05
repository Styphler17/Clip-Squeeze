import React, { useState, useRef, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlay, 
  faPause, 
  faDownload,
  faFileVideo,
  faCompressArrowsAlt,
  faChartLine,
  faBackward,
  faForward,
  faVolumeMute,
  faVolumeUp,
  faWindowMaximize,
  faFileAlt,
  faCheckCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  originalFile: File;
  compressedBlob?: Blob;
  originalSize: number;
  compressedSize?: number;
  onDownload: () => void;
}

export const VideoPreview = memo(({ 
  originalFile, 
  compressedBlob, 
  originalSize, 
  compressedSize,
  onDownload 
}: VideoPreviewProps) => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<'original' | 'compressed'>(
    compressedBlob ? 'compressed' : 'original'
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isInPiP, setIsInPiP] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');

  // Check if Picture-in-Picture is supported (with SSR safety)
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  
  React.useEffect(() => {
    // Check PiP support only after component mounts (client-side)
    const checkPiPSupport = () => {
      try {
        return document.pictureInPictureEnabled || 
          ('webkitSupportsPresentationMode' in document && 
           typeof (document as Document & { webkitSupportsPresentationMode?: () => boolean }).webkitSupportsPresentationMode === 'function');
      } catch (error) {
        console.warn('Error checking PiP support:', error);
        return false;
      }
    };
    
    setIsPiPSupported(checkPiPSupport());
  }, []);

  const handlePictureInPicture = useCallback(async () => {
    if (!videoRef.current || typeof document === 'undefined') return;
    
    try {
      if (document.pictureInPictureElement) {
        // Exit PiP if already in PiP mode
        await document.exitPictureInPicture();
      } else {
        // Enter PiP mode
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.warn('Picture-in-Picture failed:', error);
      // Fallback: try to make the video fullscreen
      try {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        } else if ('webkitRequestFullscreen' in videoRef.current) {
          await (videoRef.current as HTMLVideoElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen?.();
        }
      } catch (fullscreenError) {
        console.warn('Fullscreen fallback also failed:', fullscreenError);
      }
    }
  }, []);

  // Create URLs only once when component mounts or when files change
  React.useEffect(() => {
    const newOriginalUrl = URL.createObjectURL(originalFile);
    setOriginalUrl(newOriginalUrl);

    let newCompressedUrl: string | undefined;
    if (compressedBlob) {
      newCompressedUrl = URL.createObjectURL(compressedBlob);
      setCompressedUrl(newCompressedUrl);
    }

    // Cleanup URLs when component unmounts or when files change
    return () => {
      try {
        URL.revokeObjectURL(newOriginalUrl);
        if (newCompressedUrl) {
          URL.revokeObjectURL(newCompressedUrl);
        }
      } catch (error) {
        console.warn('Error revoking object URLs:', error);
      }
    };
  }, [originalFile, compressedBlob]);

  // Handle PiP state changes
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const handlePiPChange = () => {
      setIsInPiP(!!document.pictureInPictureElement);
    };

    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, []);



  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  }, []);

  const handleVolumeChange = useCallback(() => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  }, []);



  const skipForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  }, [duration]);

  const skipBackward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (event.key) {
        case ' ':
        case 'k':
          event.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          event.preventDefault();
          skipForward();
          break;
        case 'm':
          event.preventDefault();
          toggleMute();
          break;
        case 'f':
          event.preventDefault();
          handlePictureInPicture();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipBackward, skipForward, toggleMute, handlePictureInPicture]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = () => {
    if (!compressedSize) return null;
    const ratio = ((originalSize - compressedSize) / originalSize) * 100;
    return Math.round(ratio);
  };

  const compressionRatio = getCompressionRatio();

  return (
    <Card className="card-enhanced animate-in overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-title flex items-center gap-2">
            <FontAwesomeIcon icon={faFileVideo} className="text-primary" />
            <span>Video Preview</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {compressedBlob && (
              <Badge 
                variant="secondary" 
                className="badge-enhanced animate-scale"
              >
                <FontAwesomeIcon icon={faCompressArrowsAlt} className="w-3 h-3 mr-1" />
                Compressed
              </Badge>
            )}
            {compressionRatio && (
              <Badge 
                variant="default" 
                className="badge-enhanced animate-scale"
              >
                <FontAwesomeIcon icon={faChartLine} className="w-3 h-3 mr-1" />
                {compressionRatio}% smaller
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player Container */}
        <div className="relative video-player-enhanced group">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="text-center">
                <div className="loading-spinner mb-4" />
                <p className="text-sm text-muted-foreground">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <FontAwesomeIcon 
                  icon={faExclamationTriangle} 
                  className="w-8 h-8 text-destructive mb-2" 
                />
                <p className="text-sm text-destructive">Failed to load video</p>
              </div>
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            className={cn(
              "w-full rounded-lg transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
            style={{ aspectRatio: 'auto', minHeight: '200px', maxHeight: '400px' }}
            controls={true}
            muted={isMuted}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onError={handleError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={handleVolumeChange}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            src={currentVideo === 'original' ? originalUrl : compressedUrl}
            aria-label={`${currentVideo} video preview`}
          />

          {/* Enhanced Custom Controls Overlay */}
          <div className={cn(
            "video-controls-enhanced",
            showControls && "opacity-100"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={togglePlay}
                  size="sm"
                  variant="secondary"
                  className="btn-enhanced mobile-enhanced"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </Button>
                
                <Button
                  onClick={skipBackward}
                  size="sm"
                  variant="secondary"
                  className="btn-enhanced mobile-enhanced"
                  aria-label="Skip backward 10 seconds"
                >
                  <FontAwesomeIcon icon={faBackward} />
                </Button>
                
                <Button
                  onClick={skipForward}
                  size="sm"
                  variant="secondary"
                  className="btn-enhanced mobile-enhanced"
                  aria-label="Skip forward 10 seconds"
                >
                  <FontAwesomeIcon icon={faForward} />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  size="sm"
                  variant="secondary"
                  className="btn-enhanced mobile-enhanced"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                </Button>

                {isPiPSupported && (
                  <Button
                    onClick={handlePictureInPicture}
                    size="sm"
                    variant="secondary"
                    className="btn-enhanced mobile-enhanced"
                    aria-label={isInPiP ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}
                  >
                    <FontAwesomeIcon icon={faWindowMaximize} />
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="progress-enhanced h-1 w-full">
                <div 
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Selection Tabs */}
        {compressedBlob && (
          <div className="flex gap-2">
            <Button
              variant={currentVideo === 'original' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentVideo('original')}
              className="btn-enhanced mobile-enhanced flex-1"
            >
              <FontAwesomeIcon icon={faFileAlt} className="w-3 h-3 mr-2" />
              Original
            </Button>
            <Button
              variant={currentVideo === 'compressed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentVideo('compressed')}
              className="btn-enhanced mobile-enhanced flex-1"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-2" />
              Compressed
            </Button>
          </div>
        )}

        {/* File Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="w-3 h-3" />
              File Details
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Name:</span> {originalFile.name}</p>
              <p><span className="font-medium">Size:</span> {formatBytes(originalSize)}</p>
              <p><span className="font-medium">Type:</span> {originalFile.type || 'Unknown'}</p>
            </div>
          </div>

          {compressedBlob && compressedSize && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faCompressArrowsAlt} className="w-3 h-3" />
                Compression Results
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-medium">New Size:</span> {formatBytes(compressedSize)}</p>
                <p><span className="font-medium">Saved:</span> {formatBytes(originalSize - compressedSize)}</p>
                {compressionRatio && (
                  <p><span className="font-medium">Reduction:</span> {compressionRatio}%</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Download Button */}
        {compressedBlob && (
          <Button
            onClick={onDownload}
            className="btn-enhanced mobile-enhanced w-full"
            size="lg"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
            Download Compressed Video
          </Button>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-2">Keyboard Shortcuts:</p>
          <div className="grid grid-cols-2 gap-2">
            <span>Space/K - Play/Pause</span>
            <span>←/→ - Skip 10s</span>
            <span>M - Mute/Unmute</span>
            <span>F - Picture-in-Picture</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

VideoPreview.displayName = 'VideoPreview';
