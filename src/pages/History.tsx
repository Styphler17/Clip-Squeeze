import { useState, useEffect, useMemo } from "react";
import { Search, Download, Trash2, Calendar, FileVideo, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  getCompressionHistory, 
  clearHistory, 
  exportHistory, 
  getHistoryStats,
  type CompressionHistoryItem 
} from "@/lib/storage";

function HistoryContent() {
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<CompressionHistoryItem[]>([]);
  const [stats, setStats] = useState({ totalCompressions: 0, totalSpaceSaved: 0, avgCompression: 0 });

  useEffect(() => {
    const loadHistory = () => {
      const historyData = getCompressionHistory();
      setHistory(historyData);
      setStats(getHistoryStats());
    };
    
    loadHistory();
    
    // Listen for storage changes
    const handleStorageChange = () => loadHistory();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Memoize filtered history to prevent unnecessary recalculations
  const filteredHistory = useMemo(() => 
    history.filter(item =>
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    ), [history, searchTerm]
  );

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setStats({ totalCompressions: 0, totalSpaceSaved: 0, avgCompression: 0 });
    toast({
      title: "History Cleared",
      description: "All compression history has been cleared.",
    });
  };

  const handleExportHistory = () => {
    if (history.length === 0) {
      toast({
        title: "No History to Export",
        description: "There's no compression history to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportHistory();
    toast({
      title: "History Exported",
      description: "Compression history has been exported as CSV.",
    });
  };

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
        <h1 className="text-lg font-semibold">History</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compression History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your video compression history
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportHistory}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleClearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compressions</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-primary">{stats.totalCompressions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Space Saved</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-success">
              {(stats.totalSpaceSaved / (1024 * 1024 * 1024)).toFixed(1)} GB
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Compression</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-warning">{stats.avgCompression.toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* History Table */}
      {filteredHistory.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Original Size</TableHead>
                  <TableHead>Compressed Size</TableHead>
                  <TableHead>Saved</TableHead>
                  <TableHead>Preset</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.fileName}</TableCell>
                    <TableCell>{(item.originalSize / (1024 * 1024)).toFixed(1)} MB</TableCell>
                    <TableCell>{(item.compressedSize / (1024 * 1024)).toFixed(1)} MB</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-video-success/10 text-video-success">
                        {item.compressionRatio.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.preset}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {item.date} {item.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-video-success text-white">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No compression history found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No results match your search." : "Start compressing videos to see your history here."}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

export default function History() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <VideoCompressorSidebar />
        <HistoryContent />
      </div>
    </SidebarProvider>
  );
}