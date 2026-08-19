export type ContrastRequirement = 'normal-text' | 'large-text' | 'interface'

export type ContrastResult = {
  ratio: number
  passesAA: boolean
  passesAAA: boolean | null
}

const thresholds: Record<ContrastRequirement, { aa: number; aaa: number | null }> = {
  'normal-text': { aa: 4.5, aaa: 7 },
  'large-text': { aa: 3, aaa: 4.5 },
  interface: { aa: 3, aaa: null },
}

const hexToRgb = (hex: string): [number, number, number] => {
  const normalizedHex = hex.replace('#', '')

  if (!/^[0-9a-f]{6}$/i.test(normalizedHex)) {
    throw new Error(`Invalid six-digit hex color: ${hex}`)
  }

  return [0, 2, 4].map((index) => Number.parseInt(normalizedHex.slice(index, index + 2), 16)) as [number, number, number]
}

const linearizeChannel = (channel: number) => {
  const normalizedChannel = channel / 255
  return normalizedChannel <= 0.04045
    ? normalizedChannel / 12.92
    : ((normalizedChannel + 0.055) / 1.055) ** 2.4
}

export const getRelativeLuminance = (hex: string) => {
  const [red, green, blue] = hexToRgb(hex).map(linearizeChannel)
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
}

export const getContrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = getRelativeLuminance(foreground)
  const backgroundLuminance = getRelativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

export const evaluateContrast = (
  foreground: string,
  background: string,
  requirement: ContrastRequirement,
): ContrastResult => {
  const ratio = getContrastRatio(foreground, background)
  const requirementThresholds = thresholds[requirement]

  return {
    ratio,
    passesAA: ratio >= requirementThresholds.aa,
    passesAAA: requirementThresholds.aaa === null ? null : ratio >= requirementThresholds.aaa,
  }
}
