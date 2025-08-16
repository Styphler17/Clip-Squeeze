import { Upload, Settings, Download, Zap, FileVideo, Clock, HardDrive, Cpu, Menu, Play, BarChart3, CheckCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useNavigate } from "react-router-dom";

const compressionSteps = [
  {
    step: 1,
    title: "Upload Your Video",
    description: "Use the Upload tab to drag and drop your video files or click to browse. Supports MP4, AVI, MOV, MKV, and more.",
    icon: Upload,
    tips: ["Files of any size are supported", "Multiple files can be processed at once", "Preview your videos before compression", "All processing happens locally in your browser"]
  },
  {
    step: 2,
    title: "Configure Settings",
    description: "Switch to the Settings tab to choose from predefined presets or customize your own compression settings.",
    icon: Settings,
    tips: ["Start with 'Balanced' for best results", "Use 'Aggressive' for maximum size reduction", "Custom settings for advanced users", "Enable format conversion if needed"]
  },
  {
    step: 3,
    title: "Monitor Progress",
    description: "Click 'Start Compression' and switch to the Progress tab to watch real-time compression with detailed statistics.",
    icon: Zap,
    tips: ["Processing time varies by file size", "Larger files may take several minutes", "Don't close the browser during compression", "Cancel jobs if needed"]
  },
  {
    step: 4,
    title: "Review & Download",
    description: "Check the Final Results tab to compare original vs compressed videos and download your results.",
    icon: Download,
    tips: ["Side-by-side video previews", "Compare file sizes and quality", "Download compressed files", "History is saved for future reference"]
  }
];



const compressionPresets = [
  {
    name: "Aggressive",
    description: "Maximum compression, good for sharing",
    reduction: "70-85%",
    quality: "Good",
    useCase: "Social media, email sharing"
  },
  {
    name: "Fast",
    description: "Quick processing with decent compression",
    reduction: "50-65%",
    quality: "Good",
    useCase: "Quick sharing, draft versions"
  },
  {
    name: "Balanced",
    description: "Best balance of size and quality",
    reduction: "60-75%",
    quality: "Very Good",
    useCase: "General use, recommended"
  },
  {
    name: "High Quality",
    description: "Minimal quality loss, moderate compression",
    reduction: "40-55%",
    quality: "Excellent",
    useCase: "Professional work, archiving"
  },
  {
    name: "Lossless",
    description: "No quality loss, minimal compression",
    reduction: "10-25%",
    quality: "Perfect",
    useCase: "Master copies, editing"
  },
  {
    name: "Custom",
    description: "Full control over compression settings",
    reduction: "Variable",
    quality: "Variable",
    useCase: "Advanced users, specific needs"
  }
];



const compressionTips = [
  {
    icon: FileVideo,
    title: "Large File Processing",
    content: "For files over 1GB, expect longer processing times. Consider using 'Fast' preset for quicker results."
  },
  {
    icon: Clock,
    title: "Long Video Processing",
    content: "Videos over 30 minutes may take significant time. Process during low activity periods for best performance."
  },
  {
    icon: HardDrive,
    title: "Storage Optimization",
    content: "Free up browser cache if processing fails. Large files need sufficient temporary storage space."
  },
  {
    icon: Cpu,
    title: "Performance Tips",
    content: "Close other browser tabs during compression. More CPU cores = faster processing speeds."
  }
];



function HowToUseContent() {
  const { toggleSidebar, state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const navigate = useNavigate();

  return (
    <main className={`flex-1 transition-all duration-300 ${
      isCollapsed 
        ? 'lg:ml-16 xl:ml-16 2xl:ml-16' 
        : 'lg:ml-64 xl:ml-72 2xl:ml-80'
    }`}>
      <div className="flex-1 flex flex-col">
      {/* Mobile header */}
      <header className="h-14 border-b bg-background flex items-center px-4 lg:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">How To Use</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 space-y-8">
        <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">How to Use Clip-Squeeze</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to compress your videos efficiently with our powerful compression tools
        </p>
        <div className="mt-4">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-video-primary hover:bg-video-primary-dark"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Compressing
          </Button>
        </div>
      </div>

      {/* Video Compression Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-video-primary" />
          Video Compression with Tab Interface
        </h2>
        <p className="text-muted-foreground mb-6">
          Our intuitive tab-based interface makes video compression simple and organized. Navigate through Upload, Settings, Progress, and Final Results tabs for a streamlined workflow.
        </p>
        
        {/* Tab Interface Overview */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Tab Interface Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-video-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload className="w-5 h-5 text-video-primary" />
                  Upload Tab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Upload and preview your video files</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Drag & drop interface</p>
                  <p>• File preview with details</p>
                  <p>• Multiple file support</p>
                  <p>• Format validation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-video-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-video-primary" />
                  Settings Tab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Configure compression settings and presets</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Predefined presets</p>
                  <p>• Custom settings</p>
                  <p>• Format conversion</p>
                  <p>• Quality controls</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-video-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-video-primary" />
                  Progress Tab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Monitor compression progress in real-time</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Live progress tracking</p>
                  <p>• Job management</p>
                  <p>• Cancel/retry options</p>
                  <p>• Status updates</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-video-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-video-primary" />
                  Final Results Tab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Review and download compressed videos</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Side-by-side previews</p>
                  <p>• Size comparison</p>
                  <p>• Download options</p>
                  <p>• Compression stats</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compression Step-by-step guide */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Step-by-Step Compression Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compressionSteps.map((step) => (
              <Card key={step.step} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-video-primary text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <step.icon className="w-5 h-5" />
                        {step.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <div className="space-y-2">
                    {step.tips.map((tip, index) => (
                      <div key={`${step.step}-tip-${index}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-video-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compression Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Compression Presets Explained</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compressionPresets.map((preset) => (
              <Card key={preset.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{preset.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{preset.reduction} smaller</Badge>
                    <Badge variant="outline">{preset.quality}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{preset.description}</p>
                  <div className="text-sm">
                    <span className="font-medium">Best for:</span>
                    <span className="text-muted-foreground ml-1">{preset.useCase}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Pro Tips */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Pro Tips & Best Practices</h2>
        
        {/* Compression Tips */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-video-primary">Compression Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compressionTips.map((tip, index) => (
              <Card key={`compression-tip-${tip.title}-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tip.icon className="w-5 h-5 text-video-primary" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Preview Features */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-video-primary">Video Preview Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-video-primary" />
                  Upload Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Preview your videos before compression to ensure you've selected the right files.</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• See video thumbnails and details</p>
                  <p>• Check file sizes and formats</p>
                  <p>• Verify video quality</p>
                  <p>• Remove unwanted files</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-video-primary" />
                  Results Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Compare original and compressed videos side-by-side in the Final Results tab.</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Side-by-side video previews</p>
                  <p>• File size comparisons</p>
                  <p>• Quality assessment</p>
                  <p>• Download both versions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </section>

      {/* Technical Information */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Technical Information</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Supported Formats</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• MP4, AVI, MOV, MKV, WMV</p>
                  <p>• FLV, WebM, 3GP, OGV, M4V</p>
                  <p>• QT and other common formats</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Processing Details</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• 100% client-side processing</p>
                  <p>• No file uploads to servers</p>
                  <p>• WebAssembly-powered compression</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">File Size Limits</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Unlimited file size support</p>
                  <p>• Multiple files can be processed</p>
                  <p>• Fast processing with WebAssembly</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Security & Privacy</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Files never leave your device</p>
                  <p>• No data collection or tracking</p>
                  <p>• Original files are preserved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      </div>
    </div>
    </main>
  );
}

export default function HowToUse() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <VideoCompressorSidebar />
        <HowToUseContent />
      </div>
    </SidebarProvider>
  );
}