export const PREVIEW_SCENARIOS = ['ready', 'loading', 'empty', 'error'] as const

export type PreviewScenario = (typeof PREVIEW_SCENARIOS)[number]

export type SpecimenView = 'overview' | 'projects' | 'team'
