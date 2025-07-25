import { Upload, Settings, Download, Zap, FileVideo, Clock, HardDrive, Cpu, Menu, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: 1,
    title: "Upload Your Video",
    description: "Drag and drop your video file or click to browse. Supports MP4, AVI, MOV, MKV, and more.",
    icon: Upload,
    tips: ["Files up to 5GB are supported", "Multiple files can be processed at once", "All processing happens locally in your browser"]
  },
  {
    step: 2,
    title: "Choose Compression Settings",
    description: "Select from predefined presets or customize your own compression settings.",
    icon: Settings,
    tips: ["Start with 'Balanced' for best results", "Use 'Aggressive' for maximum size reduction", "Custom settings for advanced users"]
  },
  {
    step: 3,
    title: "Start Compression",
    description: "Click compress and watch real-time progress with detailed statistics.",
    icon: Zap,
    tips: ["Processing time varies by file size", "Larger files may take several minutes", "Don't close the browser during compression"]
  },
  {
    step: 4,
    title: "Download Result",
    description: "Download your compressed video with significant size reduction.",
    icon: Download,
    tips: ["Compare original vs compressed file", "Check the quality before saving", "History is saved for future reference"]
  }
];

const presets = [
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

const tips = [
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
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  return (
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
        <h1 className="text-3xl font-bold text-foreground mb-2">How to Use Video Compressor</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to compress your videos efficiently with our step-by-step guide
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

      {/* Step-by-step guide */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Step-by-Step Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
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
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-video-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Quality Presets */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Compression Presets Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
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
      </section>

      <Separator />

      {/* Pro Tips */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Pro Tips & Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <Card key={index}>
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
            </div>
          </CardContent>
        </Card>
      </section>
      </div>
    </div>
  );
}

export default function HowToUse() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <VideoCompressorSidebar />
        <HowToUseContent />
      </div>
    </SidebarProvider>
  );
}