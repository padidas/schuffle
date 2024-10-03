import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const numberCharMap: Record<number, string[]> = {
  0: ['A', 'bg-blue-300', 'border-blue-300'],
  1: ['B', 'bg-green-300', 'border-green-300'],
  2: ['C', 'bg-yellow-300', 'border-yellow-300'],
  3: ['D', 'bg-red-300', 'border-red-300'],
  4: ['E', 'bg-orange-300', 'border-orange-300'],
  5: ['F', 'bg-purple-300', 'border-purple-300'],
  6: ['G', 'bg-sky-300', 'border-sky-300'],
  7: ['H', 'bg-pink-300', 'border-pink-300'],
  8: ['I', 'bg-white', 'bordbg-white'],
  9: ['J', 'bg-blue-500', 'border-blue-500'],
  10: ['K', 'bg-green-500', 'border-green-500'],
  11: ['L', 'bg-yellow-500', 'border-yellow-500'],
  12: ['M', 'bg-red-500', 'border-red-500'],
  13: ['N', 'bg-orange-500', 'border-orange-500'],
  14: ['O', 'bg-purple-500', 'border-purple-500'],
  15: ['P', 'bg-sky-500', 'border-sky-500'],
  16: ['Q', 'bg-pink-500', 'border-pink-500']
}

export function getChar(i: number) {
  return numberCharMap[i] ?? i + 1
}
