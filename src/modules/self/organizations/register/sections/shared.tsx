import {Input} from "#/components/ui/input.tsx"

export function TextField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    label: string
    value: string | number
    onChange: (value: string) => void
    type?: string
    placeholder?: string
}) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-medium">{label}</span>
            <Input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    )
}

export function FileField({
    label,
    description,
    onChange,
}: {
    label: string
    description: string
    onChange: (file: File | null) => void
}) {
    return (
        <label className="grid gap-2 rounded-lg border border-dashed p-4">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm text-muted-foreground">{description}</span>
            <Input
                type="file"
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />
        </label>
    )
}

export function dateInputValue(value: string | Date) {
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return value
}
