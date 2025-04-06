import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, parseISO } from "date-fns"; 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



