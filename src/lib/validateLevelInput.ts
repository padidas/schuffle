import { z } from 'zod'

// Define a Zod schema that parses a string to a number and checks if it's between 1 and 5
const numberSchema = z.number().min(1).max(5)

// Function to validate the string and check if it represents a number between 1 and 5
export function isValidNumberString(input?: number): boolean {
  const result = numberSchema.safeParse(input) // Safely parse the input
  return result.success // Return true if parsing and validation succeed, otherwise false
}
