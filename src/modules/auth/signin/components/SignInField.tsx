import { useStore } from '@tanstack/react-form'

import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

type FieldError = string | { message?: string }

type SignInFieldApi = {
  name: string
  store: Parameters<typeof useStore>[0]
  state: {
    value: string
    meta: {
      isTouched: boolean
    }
  }
  handleChange: (value: string) => void
  handleBlur: () => void
}

function getErrorMessage(error: FieldError) {
  return typeof error === 'string' ? error : error.message ?? 'Invalid value'
}

export function SignInField({
  field,
  label,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  field: SignInFieldApi
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  disabled?: boolean
}) {
  const errors = useStore(field.store, (state) => state.meta.errors as FieldError[])

  return (
    <div className="grid gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {field.state.meta.isTouched && errors.length > 0 ? (
        <div className="space-y-1 text-sm text-destructive">
          {errors.map((error) => {
            const message = getErrorMessage(error)
            return <small key={message}>{message}</small>
          })}
        </div>
      ) : null}
    </div>
  )
}
