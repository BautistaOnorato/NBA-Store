// "use client"

import { cn } from "@/lib/utils"

interface ColorCircleProps {
  value: string
  className?: string
}

const ColorCircle: React.FC<ColorCircleProps> = ({ value, className }) => {
  return (
    <div className={cn("rounded-full border p-4", className)} style={{ backgroundColor: value }} />
  )
}

export default ColorCircle