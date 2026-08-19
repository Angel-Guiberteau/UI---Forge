import { describe, expect, it } from 'vitest'
import { evaluateContrast } from '../features/accessibility/contrast'
import { THEME_MODES } from '../features/theme/theme.types'
import { themePresets } from './theme-presets'

describe('theme presets', () => {
  it('gives every preset an accessible semantic foundation in both modes', () => {
    const failures: string[] = []

    themePresets.forEach((preset) => {
      THEME_MODES.forEach((mode) => {
        const { colors } = preset.themes[mode]
        const textPairs = [
          [colors.text, colors.background],
          [colors.text, colors.surface],
          [colors.textMuted, colors.background],
          [colors.textMuted, colors.surface],
          [colors.background, colors.primary],
          [colors.primary, colors.background],
        ] as const

        textPairs.forEach(([foreground, background]) => {
          if (!evaluateContrast(foreground, background, 'normal-text').passesAA) {
            failures.push(`${preset.name} ${mode}: ${foreground} on ${background}`)
          }
        })

        if (!evaluateContrast(colors.border, colors.background, 'interface').passesAA) {
          failures.push(`${preset.name} ${mode}: border ${colors.border} on ${colors.background}`)
        }
      })
    })

    expect(failures).toEqual([])
  })
})
