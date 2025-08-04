import { useState } from "react";
import { Settings, Zap, Clock, Award, Gem, Eye, Wrench, FileVideo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { COMPRESSION_PRESETS, ENCODING_PRESETS, RESOLUTION_OPTIONS, OUTPUT_FORMATS, type CompressionPreset } from "@/lib/constants";

export interface CompressionSettingsProps {
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
  customSettings: {
    crf: number;
    preset: string;
    scale: number;
    preserveQuality: boolean;
    outputFormat: string;
    enableConversion: boolean;
  };
  onCustomSettingsChange: (settings: {
    crf: number;
    preset: string;
    scale: number;
    preserveQuality: boolean;
    outputFormat: string;
    enableConversion: boolean;
  }) => void;
}

export function CompressionSettings({
  selectedPreset,
  onPresetChange,
  customSettings,
  onCustomSettingsChange
}: CompressionSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetSelect = (presetId: string) => {
    onPresetChange(presetId);
    
    if (presetId !== 'custom') {
      const preset = COMPRESSION_PRESETS.find(p => p.id === presetId);
      if (preset) {
        onCustomSettingsChange({
          crf: preset.crf,
          preset: preset.preset,
          scale: preset.scale,
          preserveQuality: customSettings.preserveQuality,
          outputFormat: customSettings.outputFormat,
          enableConversion: customSettings.enableConversion
        });
      }
    }
  };

  const selectedPresetData = COMPRESSION_PRESETS.find(p => p.id === selectedPreset);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-title">
          <Settings className="w-5 h-5 text-video-primary" />
          Compression Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Selection */}
        <div>
          <h3 className="text-responsive-sm font-medium mb-3">Choose a preset:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMPRESSION_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPreset === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={cn(
                    "h-auto p-3 flex flex-col items-center gap-2 transition-smooth",
                    isSelected && "bg-video-primary hover:bg-video-primary-dark text-white"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isSelected ? "bg-white/20" : preset.color
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isSelected ? "text-white" : "text-white"
                    )} />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-button-sm">{preset.name}</div>
                    <div className="text-label opacity-70">{preset.estimatedReduction}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Selected Preset Info */}
        {selectedPresetData && (
          <div className="p-3 bg-video-secondary/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", selectedPresetData.color)}>
                <selectedPresetData.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{selectedPresetData.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {selectedPresetData.estimatedReduction} reduction
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPresetData.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Format Conversion */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileVideo className="w-4 h-4 text-video-accent" />
            <h3 className="text-sm font-medium">Format Conversion</h3>
          </div>
          
          <div className="space-y-3 p-3 bg-video-secondary/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Convert Format</label>
                <p className="text-xs text-muted-foreground">
                  Convert videos to a different format while compressing
                </p>
              </div>
              <Switch
                checked={customSettings.enableConversion}
                onCheckedChange={(checked) => onCustomSettingsChange({
                  ...customSettings,
                  enableConversion: checked
                })}
              />
            </div>

            {customSettings.enableConversion && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Format:</label>
                <Select
                  value={customSettings.outputFormat}
                  onValueChange={(value) => onCustomSettingsChange({
                    ...customSettings,
                    outputFormat: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTPUT_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{format.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {format.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Recommended formats:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• <strong>MP4:</strong> Best compatibility across devices</li>
                    <li>• <strong>WebM:</strong> Smaller files, web optimized</li>
                    <li>• <strong>MOV:</strong> Apple ecosystem friendly</li>
                    <li>• <strong>AVI:</strong> Universal compatibility</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Settings */}
        {selectedPreset === 'custom' && (
          <div className="space-y-4 p-4 bg-video-secondary/30 rounded-lg border">
            <h4 className="font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4 text-video-accent" />
              Custom Settings
            </h4>

            {/* CRF Setting */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Quality (CRF): {customSettings.crf}</label>
                <span className="text-xs text-muted-foreground">
                  {customSettings.crf <= 15 ? 'Excellent' :
                   customSettings.crf <= 23 ? 'Good' :
                   customSettings.crf <= 30 ? 'Average' : 'Low'}
                </span>
              </div>
              <Slider
                value={[customSettings.crf]}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  crf: value[0]
                })}
                min={0}
                max={51}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Best Quality (0)</span>
                <span>Smallest Size (51)</span>
              </div>
            </div>

            {/* Encoding Preset */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Encoding Speed:</label>
              <Select
                value={customSettings.preset}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  preset: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENCODING_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{preset.label}</span>
                        <div className="text-xs text-muted-foreground ml-4">
                          Speed: {preset.speed} • Quality: {preset.quality}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resolution Scaling */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Scaling:</label>
              <Select
                value={customSettings.scale.toString()}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  scale: parseInt(value)
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format:</label>
              <Select
                value={customSettings.outputFormat}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  outputFormat: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTPUT_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{format.label}</span>
                        <div className="text-xs text-muted-foreground ml-4">
                          {format.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Enable Conversion */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Enable Conversion</label>
                <p className="text-xs text-muted-foreground">
                  Convert the output to the selected format
                </p>
              </div>
              <Switch
                checked={customSettings.enableConversion}
                onCheckedChange={(checked) => onCustomSettingsChange({
                  ...customSettings,
                  enableConversion: checked
                })}
              />
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {showAdvanced && (
            <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Preserve Quality</label>
                  <p className="text-xs text-muted-foreground">
                    Skip compression for already compressed videos
                  </p>
                </div>
                <Switch
                  checked={customSettings.preserveQuality}
                  onCheckedChange={(checked) => onCustomSettingsChange({
                    ...customSettings,
                    preserveQuality: checked
                  })}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}