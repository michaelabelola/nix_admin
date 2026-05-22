import {AlertTriangle} from "lucide-react"

import {Dropdown, type DropdownOption} from "#/components/Dropdown.tsx"
import {Checkbox} from "@suiteonix/ui"
import {Input} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"
import {Textarea} from "@suiteonix/ui"
import type {ErrorFieldType} from "@suiteonix/server"

function FieldErrorMessage({error}: { error?: string }) {
  if (!error) return null

  return <p className="text-sm text-destructive">{error}</p>
}

export function AccountCreateTextField({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldErrorMessage error={error}/>
    </div>
  )
}

export function AccountCreateTextareaField({
  id,
  label,
  value,
  placeholder,
  error,
  description,
  rows = 4,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  error?: string
  description?: string
  rows?: number
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      <FieldErrorMessage error={error}/>
    </div>
  )
}

export function AccountCreateSelectField({
  id,
  label,
  value,
  options,
  placeholder,
  emptyLabel,
  error,
  disabled,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: DropdownOption[]
  placeholder: string
  emptyLabel: string
  error?: string
  disabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Dropdown
        name={id}
        value={value || undefined}
        options={options}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        disabled={disabled}
        onValueChange={onChange}
      />
      <FieldErrorMessage error={error}/>
    </div>
  )
}

export function AccountCreateCheckboxField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 rounded-lg border p-4">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span className="space-y-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
    </label>
  )
}

export function AccountCreateServerErrors({errors}: { errors: ErrorFieldType[] }) {
  if (!errors.length) return null

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 text-destructive"/>
        <div className="space-y-1">
          <p className="font-medium text-destructive">We couldn’t create the account yet.</p>
          <ul className="space-y-1 text-destructive/90">
            {errors.map((entry) => {
              const [field, message] = Object.entries(entry)[0] ?? []
              if (!field || !message) return null
              return <li key={`${field}-${message}`}>{message}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
