import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, RotateCcw, Download, Trash2, Menu, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useToast } from "@/hooks/use-toast";
import { getAppSettings, saveAppSettings, clearHistory, exportHistory, getCompressionHistory } from "@/lib/storage";
import { COMPRESSION_PRESETS } from "@/components/video-compressor/CompressionSettings";

function SettingsPageContent() {
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    defaultPreset: 'balanced',
    customSettings: {
      crf: 25,
      preset: 'medium',
      scale: 100,
      preserveQuality: false
    },
    theme: 'system' as 'light' | 'dark' | 'system',
    autoSaveHistory: true
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
      theme: 'system' as const,
      autoSaveHistory: true
    };
    setSettings(defaultSettings);
    saveAppSettings(defaultSettings);
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

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
    // Apply theme change
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
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
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your ClipSqueeze preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compression Settings */}
          <Card>
            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
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
                <Label htmlFor="auto-save">Auto-save History</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-save"
                    checked={settings.autoSaveHistory}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSaveHistory: checked }))}
                  />
                  <Label htmlFor="auto-save">Automatically save compression history</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
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
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          <Card>
            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSaveSettings}
                  className="justify-start"
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
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <VideoCompressorSidebar />
        <SettingsPageContent />
      </div>
    </SidebarProvider>
  );
} 