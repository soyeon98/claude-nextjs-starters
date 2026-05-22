import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FieldWrapperProps {
  label: string
  htmlFor: string
  error?: string
  description?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function FieldWrapper({
  label,
  htmlFor,
  error,
  description,
  required,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className={cn(error && "text-destructive")}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
