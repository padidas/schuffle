import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const numberCharMap: Record<number, string[]> = {
  0: ['A', 'bg-blue-300'],
  1: ['B', 'bg-green-300'],
  2: ['C', 'bg-yellow-300'],
  3: ['D', 'bg-red-300'],
  4: ['E', 'bg-orange-300'],
  5: ['F', 'bg-purple-300'],
  6: ['G', 'bg-sky-300'],
  7: ['H', 'bg-pink-300'],
  8: ['I', 'bg-white'],
  9: ['J', 'bg-blue-500'],
  10: ['K', 'bg-green-500'],
  11: ['L', 'bg-yellow-500'],
  12: ['M', 'bg-red-500'],
  13: ['N', 'bg-orange-500'],
  14: ['O', 'bg-purple-500'],
  15: ['P', 'bg-sky-500'],
  16: ['Q', 'bg-pink-500']
}

export function getChar(i: number) {
  return numberCharMap[i] ?? i + 1
}
