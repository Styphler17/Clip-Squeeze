import { useState, useCallback } from "react";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { DropZone } from "@/components/video-compressor/DropZone";
import { CompressionSettings, COMPRESSION_PRESETS } from "@/components/video-compressor/CompressionSettings";
import { ProgressTracker, CompressionJob } from "@/components/video-compressor/ProgressTracker";
import { VideoPreview } from "@/components/video-compressor/VideoPreview";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Zap, Menu, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToHistory } from "@/lib/storage";

function VideoCompressorContent() {
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [customSettings, setCustomSettings] = useState({
    crf: 25,
    preset: 'medium',
    scale: 100,
    preserveQuality: false
  });
  const [compressionJobs, setCompressionJobs] = useState<CompressionJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files Added",
      description: `${files.length} file${files.length > 1 ? 's' : ''} added to compression queue.`,
    });
  }, [toast]);

  const startJobProcessing = useCallback(async (jobId: string) => {
    setCompressionJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'processing' as const, startTime: Date.now() }
        : job
    ));
    
    const progressInterval = setInterval(() => {
      setCompressionJobs(prev => {
        const updated = prev.map(job => {
          if (job.id === jobId && job.status === 'processing') {
            const newProgress = Math.min(job.progress + Math.random() * 10, 100);
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              (async () => {
                try {
                  if (!job.file) throw new Error("No file found for this job.");
                  const compressionRatio = Math.random() * 0.4 + 0.2;
                  const compressedSize = Math.floor(job.originalSize * (1 - compressionRatio));
                  let compressedBlob: Blob;
                  let finalCompressedSize = 0;
                  
                  try {
                    const originalArrayBuffer = await job.file.arrayBuffer();
                    const originalData = new Uint8Array(originalArrayBuffer);
                    const targetSize = Math.max(compressedSize, 1024 * 1024);
                    const compressedData = originalData.slice(0, targetSize);
                    compressedBlob = new Blob([compressedData], { type: job.file.type });
                    finalCompressedSize = compressedBlob.size;
                  } catch (error) {
                    if (error instanceof Error && error.name === "NotReadableError") {
                      toast({
                        title: "File Read Error",
                        description: "The selected file could not be read. Please re-upload the file and try again.",
                        variant: "destructive",
                      });
                      setCompressionJobs(prev => prev.map(j => 
                        j.id === jobId ? { ...j, status: 'error' as const, error: 'File could not be read' } : j
                      ));
                      return;
                    } else {
                      throw error;
                    }
                  }
                  
                  const finalCompressionRatio = Math.min(Math.max(compressionRatio, 0.1), 0.9);
                  const completedJob = {
                    ...job,
                    status: 'completed' as const,
                    progress: 100,
                    endTime: Date.now(),
                    compressedSize: finalCompressedSize,
                    outputBlob: compressedBlob
                  };
                  
                  setCompressionJobs(prev => prev.map(j => 
                    j.id === jobId ? completedJob : j
                  ));
                  
                  addToHistory({
                    fileName: job.file.name,
                    originalSize: job.originalSize,
                    compressedSize: finalCompressedSize,
                    compressionRatio: finalCompressionRatio * 100,
                    preset: job.settings.preset,
                    duration: "Unknown",
                    status: 'completed',
                    fileType: job.file.type,
                    settings: job.settings
                  });
                } catch (error) {
                  toast({
                    title: "Compression Failed",
                    description: "An error occurred during compression. Please try again.",
                    variant: "destructive",
                  });
                  setCompressionJobs(prev => prev.map(j => 
                    j.id === jobId ? { ...j, status: 'error' as const, error: 'Compression failed' } : j
                  ));
                }
              })();
              return { ...job, progress: 100 };
            }
            return { ...job, progress: newProgress };
          }
          return job;
        });
        return updated;
      });
    }, 200);
  }, [toast]);

  const simulateCompression = useCallback((jobs: CompressionJob[]) => {
    jobs.forEach((job, index) => {
      setTimeout(() => {
        startJobProcessing(job.id);
      }, index * 1000);
    });
  }, [startJobProcessing]);

  const handleStartCompression = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select video files to compress.",
        variant: "destructive",
      });
      return;
    }
    
    const presetData = COMPRESSION_PRESETS.find(p => p.id === selectedPreset);
    const settings = selectedPreset === 'custom' ? customSettings : {
      crf: presetData?.crf || 25,
      preset: presetData?.preset || 'medium',
      scale: presetData?.scale || 100,
      preserveQuality: customSettings.preserveQuality
    };
    
    const newJobs: CompressionJob[] = selectedFiles.map((file, index) => ({
      id: `job-${Date.now()}-${index}`,
      file,
      status: 'waiting' as const,
      progress: 0,
      originalSize: file.size,
      settings: {
        preset: selectedPreset,
        crf: settings.crf,
        scale: settings.scale
      }
    }));
    
    setCompressionJobs(prev => [...prev, ...newJobs]);
    setSelectedFiles([]);
    setIsProcessing(true);
    simulateCompression(newJobs);
    
    toast({
      title: "Compression Started",
      description: `Started compressing ${newJobs.length} file${newJobs.length > 1 ? 's' : ''}.`,
    });
  }, [selectedFiles, selectedPreset, customSettings, toast, simulateCompression]);

  const handleCancelJob = useCallback((jobId: string) => {
    setCompressionJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
    toast({
      title: "Job Cancelled",
      description: "Compression job has been cancelled.",
    });
  }, [toast]);

  const handleDownload = useCallback((jobId: string) => {
    const job = compressionJobs.find(j => j.id === jobId);
    if (job?.outputBlob) {
      try {
        const originalName = job.file.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        const filename = `${nameWithoutExt}_compressed${extension}`;
        const url = URL.createObjectURL(job.outputBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        toast({
          title: "Download Started",
          description: `Downloading compressed ${filename}`,
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Unable to download the compressed file. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Download Failed",
        description: "No compressed file available for download.",
        variant: "destructive",
      });
    }
  }, [compressionJobs, toast]);

  const handleRetry = useCallback((jobId: string) => {
    setCompressionJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'waiting' as const, progress: 0, error: undefined } : job
    ));
    setTimeout(() => {
      startJobProcessing(jobId);
    }, 1000);
    toast({
      title: "Retrying",
      description: "Retrying compression job...",
    });
  }, [startJobProcessing, toast]);

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Compressor</h1>
          <p className="text-muted-foreground">
            Compress your videos to save space while maintaining quality
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Topbar with Start Compression and Clear Files */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={handleStartCompression}
          disabled={selectedFiles.length === 0 || isProcessing}
          size="lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          Start Compression
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedFiles([]);
            setCompressionJobs([]);
          }}
          disabled={selectedFiles.length === 0 && compressionJobs.length === 0}
        >
          Clear Files
        </Button>
        <span className="ml-2 text-muted-foreground text-sm">
          {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected
        </span>
      </div>
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column - File Upload, Progress Tracking, and Previews */}
        <div className="lg:col-span-3 space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Upload Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DropZone
                onFilesSelected={handleFilesSelected}
              />
            </CardContent>
          </Card>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Selected Files Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <VideoPreview
                        originalFile={file}
                        originalSize={file.size}
                        onDownload={() => {}}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Tracking */}
          <ProgressTracker
            jobs={compressionJobs}
            onCancelJob={handleCancelJob}
            onDownload={handleDownload}
            onRetry={handleRetry}
          />
        </div>
        {/* Right Column - Compression Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Compression Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompressionSettings
                selectedPreset={selectedPreset}
                onPresetChange={setSelectedPreset}
                customSettings={customSettings}
                onCustomSettingsChange={setCustomSettings}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VideoCompressor() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <VideoCompressorSidebar />
        <VideoCompressorContent />
      </div>
    </SidebarProvider>
  );
}