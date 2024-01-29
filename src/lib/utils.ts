import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function locationSanitizer(location: string | null) {
  if(!location) return null
  const sanitizedNames = [
    'San Francisco',
    'New York',
    'Remote',
    'Seattle',
    'Los Angeles',
    'Mountain View'
  ]
  if(sanitizedNames.some(sanitizedName => location.includes(sanitizedName))) { 
    return sanitizedNames.find(sanitizedName => location.includes(sanitizedName))

  }
  return location
}