import { useState, useCallback, useRef, useEffect } from "react";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { VideoRepairSEO } from "@/components/SEO";
import { DropZone } from "@/components/video-compressor/DropZone";
import { VideoPreview } from "@/components/video-compressor/VideoPreview";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  Menu, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  RotateCcw,
<<<<<<< HEAD
  FileVideo,
=======
  FileVideo
>>>>>>> 6f15866 (latest fixes)
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepairJob {
  id: string;
  file: File;
  status: 'waiting' | 'analyzing' | 'repairing' | 'completed' | 'error' | 'cancelled';
  progress: number;
  startTime?: number;
  endTime?: number;
  originalSize: number;
  repairedSize?: number;
  outputBlob?: Blob;
  error?: string;
  issues: {
    durationMismatch: boolean;
    metadataCorruption: boolean;
    containerIssues: boolean;
    playbackIssues: boolean;
  };
  repairType: 'metadata' | 'container' | 'full' | 'extract';
}

function VideoRepairContent() {
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const progressIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      progressIntervalsRef.current.forEach((interval) => clearInterval(interval));
      progressIntervalsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const hasActiveJobs = repairJobs.some(
      job => job.status === 'analyzing' || job.status === 'repairing' || job.status === 'waiting'
    );
    if (!hasActiveJobs) {
      setIsProcessing(false);
    }
  }, [repairJobs]);
  type RepairType = 'metadata' | 'container' | 'full' | 'extract';
  const [selectedRepairType, setSelectedRepairType] = useState<RepairType>('metadata');

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files Added",
      description: `${files.length} file${files.length > 1 ? 's' : ''} added to repair queue.`,
    });
  }, [toast]);

  const analyzeVideoFile = useCallback(async (_file: File): Promise<RepairJob['issues']> => {
    // Simulate video analysis
    await new Promise(resolve => setTimeout(resolve, 500)); // Faster analysis
    
    // Simulate finding issues based on file properties
    const issues = {
      durationMismatch: Math.random() > 0.5, // 50% chance of duration mismatch
      metadataCorruption: Math.random() > 0.7, // 30% chance of metadata corruption
      containerIssues: Math.random() > 0.6, // 40% chance of container issues
      playbackIssues: Math.random() > 0.4, // 60% chance of playback issues
    };
    
    return issues;
  }, []);

  const startRepairJob = useCallback(async (jobId: string) => {
    setRepairJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'analyzing' as const, startTime: Date.now() }
        : job
    ));

    const job = repairJobs.find(j => j.id === jobId);
    if (!job) return;

    // Analyze the video file
    const issues = await analyzeVideoFile(job.file);
    
    setRepairJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, status: 'repairing' as const, issues, progress: 10 }
        : j
    ));

    // Simulate repair process
    const progressInterval = setInterval(() => {
      setRepairJobs(prev => {
        const updated = prev.map(job => {
          if (job.id === jobId && job.status === 'repairing') {
            const newProgress = Math.min(job.progress + Math.random() * 40 + 20, 100); // Faster progress

            if (newProgress >= 100) {
              // Clear the interval immediately to prevent memory leaks
              clearInterval(progressInterval);
              progressIntervalsRef.current.delete(jobId);

              // Simulate repair completion
              setTimeout(async () => {
                try {
                  // Create a "repaired" version of the file
                  const arrayBuffer = await job.file.arrayBuffer();
                  const repairedBlob = new Blob([arrayBuffer], { type: job.file.type });
                  
                  const completedJob = {
                    ...job,
                    status: 'completed' as const,
                    progress: 100,
                    endTime: Date.now(),
                    repairedSize: repairedBlob.size,
                    outputBlob: repairedBlob
                  };
                  
                  setRepairJobs(prev => prev.map(j => 
                    j.id === jobId ? completedJob : j
                  ));
                  
                  toast({
                    title: "Repair Completed",
                    description: `Successfully repaired ${job.file.name}`,
                  });
                } catch (error) {
                  setRepairJobs(prev => prev.map(j => 
                    j.id === jobId ? { ...j, status: 'error' as const, error: 'Repair failed' } : j
                  ));
                  
                  toast({
                    title: "Repair Failed",
                    description: "An error occurred during repair. Please try again.",
                    variant: "destructive",
                  });
                }
              }, 300); // Faster completion
              
              return { ...job, progress: 100 };
            }
            return { ...job, progress: newProgress };
          }
          return job;
        });
        return updated;
      });
    }, 100); // Faster interval
<<<<<<< HEAD
    progressIntervalsRef.current.set(jobId, progressInterval);
=======

    // Store the interval ID for cleanup
    return progressInterval;
>>>>>>> 6f15866 (latest fixes)
  }, [repairJobs, analyzeVideoFile, toast]);

  const handleStartRepair = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select video files to repair.",
        variant: "destructive",
      });
      return;
    }
    
    const newJobs: RepairJob[] = selectedFiles.map((file, index) => ({
      id: `repair-${Date.now()}-${index}`,
      file,
      status: 'waiting' as const,
      progress: 0,
      originalSize: file.size,
      issues: {
        durationMismatch: false,
        metadataCorruption: false,
        containerIssues: false,
        playbackIssues: false,
      },
      repairType: selectedRepairType
    }));
    
    setRepairJobs(prev => [...prev, ...newJobs]);
    setSelectedFiles([]);
    setIsProcessing(true);
    
    // Start processing jobs with delays and track timeouts for cleanup
    const timeouts: NodeJS.Timeout[] = [];
    newJobs.forEach((job, index) => {
      const timeout = setTimeout(() => {
        startRepairJob(job.id);
      }, index * 2000);
      timeouts.push(timeout);
    });
    
    // Store timeouts for potential cleanup
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
    
    toast({
      title: "Repair Started",
      description: `Started repairing ${newJobs.length} file${newJobs.length > 1 ? 's' : ''}.`,
    });
  }, [selectedFiles, selectedRepairType, toast, startRepairJob]);

  const handleCancelJob = useCallback((jobId: string) => {
    const interval = progressIntervalsRef.current.get(jobId);
    if (interval) {
      clearInterval(interval);
      progressIntervalsRef.current.delete(jobId);
    }
    setRepairJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
    toast({
      title: "Job Cancelled",
      description: "Repair job has been cancelled.",
    });
  }, [toast]);

  const handleDownload = useCallback((jobId: string) => {
    const job = repairJobs.find(j => j.id === jobId);
    if (job?.outputBlob) {
      try {
        const originalName = job.file.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        const filename = `${nameWithoutExt}_repaired${extension}`;
        const url = URL.createObjectURL(job.outputBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup with proper timeout management
        const cleanupTimeout = setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        
        // Store timeout for potential cleanup
        return () => {
          clearTimeout(cleanupTimeout);
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
          URL.revokeObjectURL(url);
        };
        
        toast({
          title: "Download Started",
          description: `Downloading repaired ${filename}`,
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Unable to download the repaired file. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [repairJobs, toast]);

  const handleRetry = useCallback((jobId: string) => {
    setRepairJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'waiting' as const, progress: 0, error: undefined } : job
    ));
    
    const retryTimeout = setTimeout(() => {
      startRepairJob(jobId);
    }, 1000);
    
    // Return cleanup function
    return () => clearTimeout(retryTimeout);
    
    toast({
      title: "Retrying",
      description: "Retrying repair job...",
    });
  }, [startRepairJob, toast]);

  const handleClearFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const getStatusIcon = (status: RepairJob['status']) => {
    switch (status) {
      case 'waiting': return <Clock className="w-4 h-4" />;
      case 'analyzing': return <Eye className="w-4 h-4" />;
      case 'repairing': return <Wrench className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <RotateCcw className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: RepairJob['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'analyzing': return 'bg-blue-500';
      case 'repairing': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-2 lg:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Video Repair</h1>
            <p className="text-muted-foreground">
              Fix corrupted videos, metadata issues, and playback problems
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

        {/* Topbar */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
        <Button
          onClick={handleStartRepair}
          disabled={selectedFiles.length === 0 || isProcessing}
          size="lg"
          className={selectedFiles.length > 0 ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <Wrench className="w-4 h-4 mr-2" />
          Start Repair
        </Button>
        <Button
          variant="outline"
          onClick={handleClearFiles}
          disabled={selectedFiles.length === 0}
        >
          Clear Files
        </Button>
        <span className="ml-2 text-muted-foreground text-sm">
          {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected
        </span>
      </div>
      </div>
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column - File Upload, Progress Tracking, and Previews */}
        <div className="lg:col-span-3 space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileVideo className="w-5 h-5" />
                Upload Videos to Repair
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
<<<<<<< HEAD
                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="border rounded-lg p-4"
                    >
=======
                    <div key={`${file.name}-${file.size}-${index}`} className="border rounded-lg p-4">
>>>>>>> 6f15866 (latest fixes)
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-xs lg:text-base truncate max-w-[50%]">{file.name}</span>
                        <span className="text-xs lg:text-sm text-muted-foreground flex-shrink-0">
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

          {/* Repair Progress */}
          {repairJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Repair Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairJobs.map((job) => {
                    const isActive = job.status === 'analyzing' || job.status === 'repairing';
                    const isCompleted = job.status === 'completed';
                    const isError = job.status === 'error';
                    const isCancelled = job.status === 'cancelled';

                    return (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(job.status)} text-white`}>
                              {getStatusIcon(job.status)}
                            </div>
                            <div>
                              <h4 className="font-medium">{job.file.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {job.status === 'waiting' && 'Waiting to start...'}
                                {job.status === 'analyzing' && 'Analyzing video file...'}
                                {job.status === 'repairing' && 'Repairing video...'}
                                {job.status === 'completed' && 'Repair completed successfully'}
                                {job.status === 'error' && 'Repair failed'}
                                {job.status === 'cancelled' && 'Repair cancelled'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <Button
                                size="sm"
                                onClick={() => handleDownload(job.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
                            {isError && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetry(job.id)}
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Retry
                              </Button>
                            )}
                            {isActive && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelJob(job.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {!isError && !isCancelled && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{Math.round(job.progress)}%</span>
                              {isActive && job.startTime && (
                                <span>ETA: Calculating...</span>
                              )}
                            </div>
                            <Progress value={job.progress} className="h-2" />
                          </div>
                        )}

                        {/* Error Message */}
                        {isError && job.error && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            {job.error}
                          </div>
                        )}

                        {/* Issues Found */}
                        {job.issues && (job.issues.durationMismatch || job.issues.metadataCorruption || job.issues.containerIssues || job.issues.playbackIssues) && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium mb-2">Issues Found:</h5>
                            <div className="flex flex-wrap gap-2">
                              {job.issues.durationMismatch && (
                                <Badge variant="destructive">Duration Mismatch</Badge>
                              )}
                              {job.issues.metadataCorruption && (
                                <Badge variant="destructive">Metadata Corruption</Badge>
                              )}
                              {job.issues.containerIssues && (
                                <Badge variant="destructive">Container Issues</Badge>
                              )}
                              {job.issues.playbackIssues && (
                                <Badge variant="destructive">Playback Issues</Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Completion Stats */}
                        {isCompleted && job.repairedSize && (
                          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Original: {(job.originalSize / (1024 * 1024)).toFixed(2)} MB</span>
                            <span>Repaired: {(job.repairedSize / (1024 * 1024)).toFixed(2)} MB</span>
                          </div>
                        )}

                        {/* Video Preview for Completed Jobs */}
                        {isCompleted && job.outputBlob && (
                          <div className="mt-4">
                            <VideoPreview
                              originalFile={job.file}
                              compressedBlob={job.outputBlob}
                              originalSize={job.originalSize}
                              compressedSize={job.repairedSize}
                              onDownload={() => handleDownload(job.id)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Repair Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Repair Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Repair Type</h4>
                <div className="space-y-2">
                  {[
                    { value: 'metadata', label: 'Metadata Fix', description: 'Fix duration and metadata issues' },
                    { value: 'container', label: 'Container Repair', description: 'Rebuild video container' },
                    { value: 'full', label: 'Full Repair', description: 'Complete video reconstruction' },
                    { value: 'extract', label: 'Extract & Rebuild', description: 'Extract streams and rebuild' }
                  ].map((type) => (
                    <div
                      key={type.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRepairType === type.value
                          ? 'border-video-primary bg-video-primary/5'
                          : 'border-border hover:border-video-primary/50'
                      }`}
                      onClick={() => setSelectedRepairType(type.value as RepairType)}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Common Issues Fixed</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>Duration mismatch (metadata vs actual)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>Playback lag and stuttering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>Corrupted video containers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>Broken metadata headers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VideoRepair() {
  return (
    <SidebarProvider>
      <VideoRepairSEO />
      <div className="flex min-h-screen w-full bg-background">
        <VideoCompressorSidebar />
        <VideoRepairContent />
      </div>
    </SidebarProvider>
  );
} 