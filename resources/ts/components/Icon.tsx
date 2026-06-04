import React from 'react'

interface IconProps {
  name: string
  filled?: boolean
  size?: number
}

const Icon = ({ name, filled = false, size }: IconProps) => (
  <span
    className="material-symbols-outlined"
    style={{
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}`,
      fontSize: size ? `${size}px` : undefined,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
    }}
  >
    {name}
  </span>
)

export default Icon
