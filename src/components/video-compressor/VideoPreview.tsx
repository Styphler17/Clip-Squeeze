import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlay, 
  faPause, 
  faExpand, 
  faDownload,
  faFileVideo,
  faCompressArrowsAlt,
  faChartLine,
  faBackward,
  faForward,
  faVolumeMute,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";

interface VideoPreviewProps {
  originalFile: File;
  compressedBlob?: Blob;
  originalSize: number;
  compressedSize?: number;
  onDownload: () => void;
}

export function VideoPreview({ 
  originalFile, 
  compressedBlob, 
  originalSize, 
  compressedSize,
  onDownload 
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<'original' | 'compressed'>('compressed');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');

  // Create URLs only once when component mounts or when files change
  React.useEffect(() => {
    const newOriginalUrl = URL.createObjectURL(originalFile);
    setOriginalUrl(newOriginalUrl);

    if (compressedBlob) {
      const newCompressedUrl = URL.createObjectURL(compressedBlob);
      setCompressedUrl(newCompressedUrl);
    }

    // Cleanup URLs when component unmounts or when files change
    return () => {
      URL.revokeObjectURL(newOriginalUrl);
      if (compressedBlob) {
        URL.revokeObjectURL(compressedUrl);
      }
    };
  }, [originalFile, compressedBlob]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  };

  const seekTo = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
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

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!videoRef.current) return;
      
      switch (event.key) {
        case ' ':
          event.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          event.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          skipBackward();
          break;
        case 'Home':
          event.preventDefault();
          seekTo(0);
          break;
        case 'End':
          event.preventDefault();
          seekTo(duration);
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [duration, skipForward, skipBackward, togglePlay, seekTo, toggleMute]);

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

  const compressionRatio = compressedSize ? ((originalSize - compressedSize) / originalSize * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFileVideo} className="text-video-primary" />
            <span className="truncate">{originalFile.name}</span>
          </div>
          {compressedBlob && (
            <Button
              onClick={onDownload}
              size="sm"
              className="bg-video-success hover:bg-video-success/90"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {originalUrl && (
                      <video
            ref={videoRef}
            src={currentVideo === 'original' ? originalUrl : compressedUrl || originalUrl}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onVolumeChange={handleVolumeChange}
            controls={true}
            key={`${currentVideo}-${originalUrl}`}
          />
          )}
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlay}
                variant="secondary"
                size="lg"
                className="bg-white/90 hover:bg-white text-black"
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white/90 hover:bg-white text-black"
                  >
                    <FontAwesomeIcon icon={faExpand} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-2">
                  <DialogHeader>
                    <DialogTitle className="truncate">{originalFile.name}</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {originalUrl && (
                                              <video
                          src={currentVideo === 'original' ? originalUrl : compressedUrl || originalUrl}
                          className="w-full h-full object-contain"
                          controls={true}
                          key={`dialog-${currentVideo}-${originalUrl}`}
                        />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Custom Video Controls */}
        {duration > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={skipBackward}
                className="flex-1"
              >
                <FontAwesomeIcon icon={faBackward} className="mr-1" />
                -10s
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="flex-1"
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="mr-1" />
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={skipForward}
                className="flex-1"
              >
                <FontAwesomeIcon icon={faForward} className="mr-1" />
                +10s
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="flex-1"
              >
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} className="mr-1" />
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Keyboard: Space (play/pause) • ← → (skip 10s) • M (mute) • Home/End (start/end)
            </div>
          </div>
        )}

        {/* Video Toggle */}
        {compressedBlob && (
          <div className="flex gap-2">
            <Button
              variant={currentVideo === 'original' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentVideo('original')}
              className="flex-1"
            >
              Original
            </Button>
            <Button
              variant={currentVideo === 'compressed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentVideo('compressed')}
              className="flex-1"
            >
              Compressed
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faFileVideo} className="text-muted-foreground" />
              Original
            </div>
            <div className="text-2xl font-bold">{formatBytes(originalSize)}</div>
          </div>
          
          {compressedSize && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faCompressArrowsAlt} className="text-video-primary" />
                Compressed
              </div>
              <div className="text-2xl font-bold text-video-success">
                {formatBytes(compressedSize)}
              </div>
            </div>
          )}
        </div>

        {/* Compression Stats */}
        {compressedSize && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-video-primary" />
                <span className="font-medium">Compression Stats</span>
              </div>
              <Badge variant="secondary" className="bg-video-success/10 text-video-success">
                {compressionRatio.toFixed(1)}% saved
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Size Reduction</div>
                <div className="font-medium">
                  {formatBytes(originalSize - compressedSize)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">New Size Ratio</div>
                <div className="font-medium">
                  {((compressedSize / originalSize) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}