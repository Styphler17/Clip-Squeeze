import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitizeForCSV = (value: string): string =>
  /^[=+\-@]/.test(value) ? `'${value}` : value
