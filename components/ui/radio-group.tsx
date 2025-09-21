"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("grid gap-2", className)} {...props}>
      {children}
    </div>
  )
}

interface RadioGroupItemProps {
  value: string
  checked?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  id?: string
}

const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  className,
  value,
  checked,
  onChange,
  disabled,
  id,
  ...props
}) => {
  return (
    <input
      id={id}
      type="radio"
      value={value}
      checked={checked}
      disabled={disabled}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }