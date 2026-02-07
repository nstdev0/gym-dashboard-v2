import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeEmptyParams(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
