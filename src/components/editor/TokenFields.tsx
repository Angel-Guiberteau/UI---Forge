import { useId, useState } from 'react'

type ColorFieldProps = {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
}

const hexPattern = /^#[0-9a-f]{6}$/i

export const ColorField = ({
  label,
  description,
  value,
  onChange,
}: ColorFieldProps) => {
  const labelId = useId()
  const [draftValue, setDraftValue] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  const commitValue = () => {
    const nextValue = draftValue ?? value

    if (hexPattern.test(nextValue)) {
      const normalizedValue = nextValue.toUpperCase()
      setHasError(false)
      setDraftValue(null)

      if (normalizedValue !== value.toUpperCase()) {
        onChange(normalizedValue)
      }

      return
    }

    setDraftValue(null)
    setHasError(true)
  }

  return (
    <div className="token-field token-field--color" role="group" aria-labelledby={labelId}>
      <label className="color-swatch" aria-label={`Choose ${label} color`}>
        <input
          type="color"
          value={value}
          onChange={(event) => {
            setDraftValue(null)
            setHasError(false)
            onChange(event.target.value.toUpperCase())
          }}
        />
        <span style={{ backgroundColor: value }} aria-hidden="true" />
      </label>
      <span className="token-field__copy">
        <strong id={labelId}>{label}</strong>
        <small>{description}</small>
      </span>
      <label className="color-value">
        <span className="visually-hidden">{label} hexadecimal value</span>
        <input
          value={draftValue ?? value}
          aria-invalid={hasError}
          onFocus={() => {
            setDraftValue(value)
            setHasError(false)
          }}
          onChange={(event) => setDraftValue(event.target.value)}
          onBlur={commitValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur()
            }
          }}
        />
      </label>
      {hasError && <span className="token-field__error" role="alert">Use a six-digit hex value.</span>}
    </div>
  )
}

type RangeFieldProps = {
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
}

export const RangeField = ({
  label,
  description,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: RangeFieldProps) => {
  const labelId = useId()
  const normalizedValue = Math.min(max, Math.max(min, value))

  return (
    <div className="token-field token-field--range">
      <span className="token-field__copy">
        <strong id={labelId}>{label}</strong>
        <small>{description}</small>
      </span>
      <label className="number-value">
        <span className="visually-hidden">{label} value</span>
        <input
          type="number"
          aria-label={`${label} value`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => {
            const nextValue = Number(event.target.value)

            if (Number.isFinite(nextValue)) {
              onChange(Math.min(max, Math.max(min, nextValue)))
            }
          }}
        />
        {unit && <span>{unit}</span>}
      </label>
      <input
        className="range-input"
        type="range"
        aria-labelledby={labelId}
        min={min}
        max={max}
        step={step}
        value={normalizedValue}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

type SelectFieldProps = {
  label: string
  description: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
}

export const SelectField = ({
  label,
  description,
  value,
  options,
  onChange,
}: SelectFieldProps) => {
  const selectId = useId()

  return (
    <label className="token-field token-field--select" htmlFor={selectId}>
      <span className="token-field__copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}
