import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, RotateCcw, Download, Trash2, Menu, Moon, Sun, Monitor, Palette, Database, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useToast } from "@/hooks/use-toast";
import { getAppSettings, saveAppSettings, clearHistory, exportHistory, getCompressionHistory } from "@/lib/storage";
import { COMPRESSION_PRESETS } from "@/lib/constants";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function SettingsPageContent() {
  const { toggleSidebar, state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    defaultPreset: 'balanced',
    customSettings: {
      crf: 25,
      preset: 'medium',
      scale: 100,
      preserveQuality: false
    },
    autoSaveHistory: true,
    enableNotifications: true,
    autoCompress: false,
    qualityPreference: 'balanced' as 'quality' | 'balanced' | 'size'
  });

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = getAppSettings();
      setSettings(savedSettings);
    };
    loadSettings();
  }, []);

  const handleSaveSettings = () => {
    saveAppSettings(settings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      defaultPreset: 'balanced',
      customSettings: {
        crf: 25,
        preset: 'medium',
        scale: 100,
        preserveQuality: false
      },
      autoSaveHistory: true,
      enableNotifications: true,
      autoCompress: false,
      qualityPreference: 'balanced' as const
    };
    setSettings(defaultSettings);
    saveAppSettings(defaultSettings);
    setTheme('system');
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults.",
    });
  };

  const handleExportData = () => {
    const history = getCompressionHistory();
    if (history.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There's no data to export.",
        variant: "destructive",
      });
      return;
    }
    exportHistory();
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleClearData = () => {
    clearHistory();
    toast({
      title: "Data Cleared",
      description: "All compression history has been cleared.",
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

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
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-video-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-video-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">
                Configure your ClipSqueeze preferences and appearance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Privacy First
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Client-Side Only
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compression Settings */}
          <Card className="border-video-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-video-primary" />
                Compression Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-preset">Default Preset</Label>
                <Select
                  value={settings.defaultPreset}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, defaultPreset: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPRESSION_PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality-preference">Quality Preference</Label>
                <Select
                  value={settings.qualityPreference}
                  onValueChange={(value: 'quality' | 'balanced' | 'size') => 
                    setSettings(prev => ({ ...prev, qualityPreference: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Best Quality</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="size">Smallest Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-save">Auto-save History</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-save"
                    checked={settings.autoSaveHistory}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSaveHistory: checked }))}
                  />
                  <Label htmlFor="auto-save" className="text-sm">Automatically save compression history</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-compress">Auto-compress on Upload</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-compress"
                    checked={settings.autoCompress}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCompress: checked }))}
                  />
                  <Label htmlFor="auto-compress" className="text-sm">Start compression immediately after file upload</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="border-video-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-video-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => handleThemeChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
                    className="px-3"
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                  <Label htmlFor="notifications" className="text-sm">Show toast notifications for actions</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-video-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-video-primary" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your compression history and export your data
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearData}
                  className="justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-video-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-video-primary" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Save your current settings or reset to defaults
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSaveSettings}
                  className="justify-start bg-video-primary hover:bg-video-primary-dark"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  className="justify-start"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Current Theme Preview */}
        <Card className="border-video-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-video-primary" />
              Current Theme Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Background</Label>
                <div className="h-12 rounded-lg bg-background border-2 border-border"></div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Foreground</Label>
                <div className="h-12 rounded-lg bg-foreground border-2 border-border"></div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary</Label>
                <div className="h-12 rounded-lg bg-video-primary border-2 border-border"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </main>
  );
}

export default function Settings() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <VideoCompressorSidebar />
        <SettingsPageContent />
      </div>
    </SidebarProvider>
  );
} 