import { describe, it, expect } from 'vitest'
import { isValidNumberString } from '@/lib/validateLevelInput'

describe('HelloWorld', () => {
  it('validates level correctly', () => {
    expect(isValidNumberString(1)).toBeTruthy()
    expect(isValidNumberString(2)).toBeTruthy()
    expect(isValidNumberString(3)).toBeTruthy()
    expect(isValidNumberString(4)).toBeTruthy()
    expect(isValidNumberString(5)).toBeTruthy()
    expect(isValidNumberString(22)).toBeFalsy()
    expect(isValidNumberString(-1)).toBeFalsy()
    expect(isValidNumberString(0)).toBeFalsy()
    expect(isValidNumberString(-5)).toBeFalsy()
  })
})
