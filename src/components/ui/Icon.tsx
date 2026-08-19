export type IconName =
  | 'check'
  | 'desktop'
  | 'moon'
  | 'palette'
  | 'preview'
  | 'redo'
  | 'sun'
  | 'tablet'
  | 'mobile'
  | 'undo'

type IconProps = {
  name: IconName
  size?: number
}

const iconPaths: Record<IconName, React.ReactNode> = {
  check: <path d="m5 12 4 4L19 6" />,
  desktop: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  mobile: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  moon: <path d="M20.3 15.4A9 9 0 0 1 8.6 3.7 9 9 0 1 0 20.3 15.4Z" />,
  palette: <><path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.3-3c-.7-.8-.1-2 1-2H18a3 3 0 0 0 3-3 10 10 0 0 0-9-10Z" /><path d="M7.5 10h.01M10 6.5h.01M15 7.5h.01" /></>,
  preview: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  redo: <><path d="m15 7 4 4-4 4" /><path d="M5 17v-2a4 4 0 0 1 4-4h10" /></>,
  sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  tablet: <><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M10.5 18h3" /></>,
  undo: <><path d="m9 7-4 4 4 4" /><path d="M19 17v-2a4 4 0 0 0-4-4H5" /></>,
}

export const Icon = ({ name, size = 18 }: IconProps) => (
  <svg
    className="icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {iconPaths[name]}
  </svg>
)
