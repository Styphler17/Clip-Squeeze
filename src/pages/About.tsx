import { Shield, Zap, Globe, Download, Code, Users, Star, Github, Menu, Play, BarChart3, CheckCircle, Eye, Settings, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "100% Private & Secure",
    description: "All processing happens locally in your browser. No files are uploaded to any server, ensuring complete privacy."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by WebAssembly and FFmpeg for efficient video compression without quality compromise."
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "No installation required. Works on any modern browser across Windows, Mac, Linux, and mobile devices."
  },
  {
    icon: Download,
    title: "Enhanced File Support",
    description: "Process files up to 10GB with support for all major video formats and codecs."
  },
  {
    icon: Eye,
    title: "Video Previews",
    description: "Preview videos before compression and compare original vs compressed results side-by-side."
  },
  {
    icon: BarChart3,
    title: "Tab-Based Interface",
    description: "Intuitive tab navigation with Upload, Settings, Progress, and Final Results for streamlined workflow."
  }
];

const techStack = [
  { name: "React", description: "Modern UI framework" },
  { name: "TypeScript", description: "Type-safe development" },
  { name: "Tailwind CSS", description: "Responsive styling" },
  { name: "FFmpeg.wasm", description: "Video processing engine" },
  { name: "WebAssembly", description: "High-performance computing" },
  { name: "Vite", description: "Fast build tool" }
];

const supportedFormats = [
  "MP4", "AVI", "MOV", "MKV", "WMV", 
  "FLV", "WebM", "3GP", "OGV", "M4V", "QT",
  "M4A", "MPG", "MPEG", "TS", "MTS", "M2TS"
];

const stats = [
  { label: "Supported Formats", value: "15+" },
  { label: "Max File Size", value: "Unlimited" },
  { label: "Compression Presets", value: "6" },
  { label: "Privacy Level", value: "100%" }
];

function AboutContent() {
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
        <h1 className="text-lg font-semibold">About</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">About ClipSqueeze</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A professional, privacy-focused video compression tool with an intuitive tab-based interface. 
          Preview, compress, and compare videos entirely in your browser.
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Shield className="w-3 h-3 mr-1" />
            Privacy First
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Client-Side Only
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Code className="w-3 h-3 mr-1" />
            Open Source
          </Badge>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-video-primary hover:bg-video-primary-dark"
          >
            <Play className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Our Video Compressor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-video-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-video-primary" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Statistics */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">By the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-video-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Technology Stack */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Built With Modern Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Interface Features */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Modern Interface Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-video-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5 text-video-primary" />
                Upload Tab
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Drag & drop interface with video previews and format validation</p>
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
              <p className="text-sm text-muted-foreground">Configure compression presets and custom settings</p>
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
              <p className="text-sm text-muted-foreground">Real-time progress tracking with job management</p>
            </CardContent>
          </Card>

          <Card className="border-video-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-video-primary" />
                Results Tab
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Side-by-side comparison and download options</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Supported Formats */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Supported Video Formats</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Our compressor supports all major video formats and codecs:
            </p>
            <div className="flex flex-wrap gap-2">
              {supportedFormats.map((format) => (
                <Badge key={format} variant="outline" className="text-sm">
                  {format}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Privacy & Security */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Privacy & Security</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-video-success mt-0.5" />
              <div>
                <h3 className="font-semibold">No Data Collection</h3>
                <p className="text-muted-foreground text-sm">We don't track, store, or analyze your usage data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-video-success mt-0.5" />
              <div>
                <h3 className="font-semibold">Local Processing Only</h3>
                <p className="text-muted-foreground text-sm">All video processing happens on your device using WebAssembly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-video-success mt-0.5" />
              <div>
                <h3 className="font-semibold">No File Uploads</h3>
                <p className="text-muted-foreground text-sm">Your videos never leave your computer, ensuring complete privacy.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>



        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            Built with ❤️ for privacy-conscious users who value quality and performance.
          </p>
        </div>
      </div>
    </div>
    </main>
  );
}

export default function About() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <VideoCompressorSidebar />
        <AboutContent />
      </div>
    </SidebarProvider>
  );
}