import { describe, expect, it } from 'vitest'
import { evaluateContrast, getContrastRatio, getRelativeLuminance } from './contrast'

describe('WCAG contrast utilities', () => {
  it('calculates luminance for the color extremes', () => {
    expect(getRelativeLuminance('#000000')).toBe(0)
    expect(getRelativeLuminance('#FFFFFF')).toBe(1)
  })

  it('calculates the canonical black and white ratio', () => {
    expect(getContrastRatio('#000000', '#FFFFFF')).toBe(21)
    expect(getContrastRatio('#FFFFFF', '#000000')).toBe(21)
  })

  it('evaluates normal, large, and interface thresholds independently', () => {
    expect(evaluateContrast('#777777', '#FFFFFF', 'normal-text').passesAA).toBe(false)
    expect(evaluateContrast('#777777', '#FFFFFF', 'large-text').passesAA).toBe(true)
    expect(evaluateContrast('#777777', '#FFFFFF', 'interface').passesAAA).toBeNull()
  })

  it('rejects invalid color values', () => {
    expect(() => getContrastRatio('#FFF', '#000000')).toThrow('Invalid six-digit hex color')
  })
})
