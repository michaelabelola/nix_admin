import type { ReactNode } from "react"

import { Input } from "#/components/ui/input.tsx"
import { CountryCombobox } from "#/modules/location/components/CountryCombobox.tsx"
import { StateCombobox } from "#/modules/location/components/StateCombobox.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx"
import { Textarea } from "#/components/ui/textarea.tsx"

import { StepField } from "./PropertyRegistrationFormParts.tsx"

type FormLike = {
  Field: any
  handleSubmit: () => void | Promise<void>
}

type FieldValidators = {
  onChange?: (input: { value: string }) => string | undefined
}

export function RegistrationForm({
  form,
  children,
  className = "grid gap-6",
}: {
  form: FormLike
  children: ReactNode
  className?: string
}) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      {children}
    </form>
  )
}

export function RegistrationInputField({
  form,
  name,
  label,
  description,
  placeholder,
  type = "text",
  validators,
}: {
  form: FormLike
  name: string
  label: string
  description?: string
  placeholder?: string
  type?: string
  validators?: FieldValidators
}) {
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <StepField
          label={label}
          description={description}
          error={field.state.meta.errors[0]?.message}
        >
          <Input
            type={type}
            value={field.state.value ?? ""}
            placeholder={placeholder}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        </StepField>
      )}
    </form.Field>
  )
}

export function RegistrationTextareaField({
  form,
  name,
  label,
  description,
  placeholder,
  rows = 6,
  validators,
}: {
  form: FormLike
  name: string
  label: string
  description?: string
  placeholder?: string
  rows?: number
  validators?: FieldValidators
}) {
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <StepField
          label={label}
          description={description}
          error={field.state.meta.errors[0]?.message}
        >
          <Textarea
            rows={rows}
            value={field.state.value ?? ""}
            placeholder={placeholder}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        </StepField>
      )}
    </form.Field>
  )
}

export function RegistrationSelectField({
  form,
  name,
  label,
  description,
  placeholder,
  options,
}: {
  form: FormLike
  name: string
  label: string
  description?: string
  placeholder?: string
  options: string[]
}) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <StepField label={label} description={description}>
          <Select value={field.state.value} onValueChange={field.handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StepField>
      )}
    </form.Field>
  )
}

export function RegistrationFileField({
  form,
  name,
  label,
  description,
  accept,
}: {
  form: FormLike
  name: string
  label: string
  description?: string
  accept?: string
}) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <StepField label={label} description={description}>
          <Input
            type="file"
            accept={accept}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.files?.[0] ?? null)}
          />
          {field.state.value ? (
            <p className="text-sm text-muted-foreground">
              Selected file: {field.state.value.name}
            </p>
          ) : null}
        </StepField>
      )}
    </form.Field>
  )
}

export function RegistrationCountryComboboxField({
  form,
  name,
  label,
  description,
  validators,
}: {
  form: FormLike
  name: string
  label: string
  description?: string
  validators?: FieldValidators
}) {
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <StepField
          label={label}
          description={description}
          error={field.state.meta.errors[0]?.message}
        >
          <CountryCombobox
            label={undefined}
            value={field.state.value ?? ""}
            onValueChange={field.handleChange}
          />
        </StepField>
      )}
    </form.Field>
  )
}

export function RegistrationStateComboboxField({
  form,
  name,
  countryFieldName,
  label,
  description,
  validators,
}: {
  form: FormLike
  name: string
  countryFieldName: string
  label: string|boolean
  description?: string
  validators?: FieldValidators
}) {
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <form.Subscribe selector={(state: any) => state.values[countryFieldName]}>
          {(countryIso2: string) => (
            <StepField
              label={label}
              description={description}
              error={field.state.meta.errors[0]?.message}
            >
              <StateCombobox
                label={undefined}
                countryIso2={countryIso2}
                value={field.state.value ?? ""}
                onValueChange={field.handleChange}
              />
            </StepField>
          )}
        </form.Subscribe>
      )}
    </form.Field>
  )
}
