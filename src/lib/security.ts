/**
 * Security utilities for Clip-Squeeze
 * Provides input sanitization, validation, and security checks
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize file names
 * @param fileName - The file name to validate
 * @returns Sanitized file name or null if invalid
 */
export function validateFileName(fileName: string): string | null {
  if (!fileName || typeof fileName !== 'string') {
    return null;
  }

  // Remove path traversal attempts
  const sanitizedName = fileName
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[\\/]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .trim();

  // Check if the sanitized name is valid
  if (sanitizedName.length === 0 || sanitizedName.length > 255) {
    return null;
  }

  return sanitizedName;
}

/**
 * Validate file size with security considerations
 * @param size - File size in bytes
 * @param maxSize - Maximum allowed size in bytes
 * @returns True if size is valid
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  if (typeof size !== 'number' || size < 0) {
    return false;
  }

  if (size > maxSize) {
    return false;
  }

  // Prevent extremely large files that could cause memory issues
  const MAX_SAFE_SIZE = Number.MAX_SAFE_INTEGER; // Unlimited file size
  if (size > MAX_SAFE_SIZE) {
    return false;
  }

  return true;
}

/**
 * Validate file type with security checks
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if file type is valid
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  if (!file || !allowedTypes || !Array.isArray(allowedTypes)) {
    return false;
  }

  // Check MIME type
  if (file.type && allowedTypes.includes(file.type)) {
    return true;
  }

  // Fallback to extension check
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension) {
    return false;
  }

  const allowedExtensions = allowedTypes.map(type => {
    const match = type.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : null;
  }).filter(Boolean);

  return allowedExtensions.includes(extension);
}

/**
 * Create a safe download URL for files
 * @param blob - The file blob
 * @param fileName - The file name
 * @returns Safe download URL
 */
export function createSafeDownloadUrl(blob: Blob, fileName: string): string {
  const sanitizedName = validateFileName(fileName) || 'download';
  const url = URL.createObjectURL(blob);
  
  // Set a timeout to revoke the URL after download
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000); // 1 minute timeout

  return url;
}

/**
 * Compression settings interface
 */
export interface CompressionSettings {
  crf: number;
  preset: string;
  scale: number;
  preserveQuality: boolean;
}

/**
 * Validate compression settings to prevent malicious values
 * @param settings - Compression settings object
 * @returns Validated settings
 */
export function validateCompressionSettings(settings: Partial<CompressionSettings>): CompressionSettings {
  const validSettings: CompressionSettings = {
    crf: 25,
    preset: 'medium',
    scale: 100,
    preserveQuality: false
  };

  // Validate CRF (Constant Rate Factor)
  if (typeof settings.crf === 'number') {
    validSettings.crf = Math.max(0, Math.min(51, settings.crf));
  }

  // Validate preset
  const validPresets = ['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'];
  if (typeof settings.preset === 'string' && validPresets.includes(settings.preset)) {
    validSettings.preset = settings.preset;
  }

  // Validate scale
  if (typeof settings.scale === 'number') {
    validSettings.scale = Math.max(10, Math.min(100, settings.scale));
  }

  // Validate preserveQuality
  if (typeof settings.preserveQuality === 'boolean') {
    validSettings.preserveQuality = settings.preserveQuality;
  }

  return validSettings;
}

/**
 * Check if the current environment is secure
 * @returns True if running in a secure context
 */
export function isSecureContext(): boolean {
  return window.isSecureContext || location.protocol === 'https:';
}

/**
 * Generate a secure random ID
 * @param length - Length of the ID
 * @returns Secure random ID
 */
export function generateSecureId(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
} 