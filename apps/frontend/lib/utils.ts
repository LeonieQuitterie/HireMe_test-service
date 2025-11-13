import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getScoreColor(score: number): string {
  if (score < 6) return "text-destructive"
  if (score < 8) return "text-warning"
  return "text-success"
}

export function getScoreBgColor(score: number): string {
  if (score < 6) return "bg-destructive/10"
  if (score < 8) return "bg-warning/10"
  return "bg-success/10"
}
