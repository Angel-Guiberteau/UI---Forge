type ForgeMarkProps = {
  compact?: boolean
}

export const ForgeMark = ({ compact = false }: ForgeMarkProps) => (
  <span className="forge-mark" data-compact={compact} aria-hidden="true">
    <span />
    <span />
    <span />
  </span>
)
