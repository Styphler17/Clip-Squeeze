import { Zap, Clock, Award, Gem, Eye, Wrench } from "lucide-react";

export interface CompressionPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  crf: number;
  preset: string;
  scale: number;
  estimatedReduction: string;
  color: string;
}

export const COMPRESSION_PRESETS: CompressionPreset[] = [
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Maximum compression, good for sharing',
    icon: Zap,
    crf: 35,
    preset: 'fast',
    scale: 80,
    estimatedReduction: '70-85%',
    color: 'text-red-500'
  },
  {
    id: 'fast',
    name: 'Fast',
    description: 'Quick processing with decent compression',
    icon: Clock,
    crf: 30,
    preset: 'veryfast',
    scale: 90,
    estimatedReduction: '50-65%',
    color: 'text-orange-500'
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Best balance of size and quality',
    icon: Award,
    crf: 25,
    preset: 'medium',
    scale: 100,
    estimatedReduction: '60-75%',
    color: 'text-blue-500'
  },
  {
    id: 'high-quality',
    name: 'High Quality',
    description: 'Minimal quality loss, moderate compression',
    icon: Gem,
    crf: 20,
    preset: 'slow',
    scale: 100,
    estimatedReduction: '40-55%',
    color: 'text-green-500'
  },
  {
    id: 'lossless',
    name: 'Lossless',
    description: 'No quality loss, minimal compression',
    icon: Eye,
    crf: 15,
    preset: 'veryslow',
    scale: 100,
    estimatedReduction: '10-25%',
    color: 'text-purple-500'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Full control over compression settings',
    icon: Wrench,
    crf: 25,
    preset: 'medium',
    scale: 100,
    estimatedReduction: 'Variable',
    color: 'text-gray-500'
  }
];

// File size constants
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024 * 1024, // 10GB
  MAX_SAFE_SIZE: 10 * 1024 * 1024 * 1024, // 10GB
  MAX_FILES: 10
} as const;

// Supported video formats
export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/avi', 
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/webm',
  'video/3gpp',
  'video/ogg',
  'video/x-matroska'
] as const;

// File extensions
export const SUPPORTED_EXTENSIONS = [
  'mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'ogv', 'm4v', 'qt'
] as const;

// Encoding presets for custom compression settings
export const ENCODING_PRESETS = [
  { value: 'ultrafast', label: 'Ultra Fast', speed: 'Fastest', quality: 'Lower' },
  { value: 'superfast', label: 'Super Fast', speed: 'Very Fast', quality: 'Low' },
  { value: 'veryfast', label: 'Very Fast', speed: 'Fast', quality: 'Medium' },
  { value: 'faster', label: 'Faster', speed: 'Quick', quality: 'Good' },
  { value: 'fast', label: 'Fast', speed: 'Medium', quality: 'Better' },
  { value: 'medium', label: 'Medium', speed: 'Balanced', quality: 'Best' },
  { value: 'slow', label: 'Slow', speed: 'Slow', quality: 'Excellent' },
  { value: 'slower', label: 'Slower', speed: 'Very Slow', quality: 'Outstanding' },
  { value: 'veryslow', label: 'Very Slow', speed: 'Slowest', quality: 'Maximum' }
] as const;

// Resolution scaling options for custom compression settings
export const RESOLUTION_OPTIONS = [
  { value: 50, label: '50% - Very Small' },
  { value: 60, label: '60% - Small' },
  { value: 70, label: '70% - Medium Small' },
  { value: 80, label: '80% - Medium' },
  { value: 90, label: '90% - Medium Large' },
  { value: 100, label: '100% - Original Size' },
  { value: 110, label: '110% - Slightly Larger' },
  { value: 120, label: '120% - Larger' }
] as const; 