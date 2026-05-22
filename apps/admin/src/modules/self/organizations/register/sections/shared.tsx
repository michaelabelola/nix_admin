import {useEffect, useState} from "react"

import {Input} from "@suiteonix/ui"

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
    value,
    onChange,
    previewClassName = "aspect-video",
}: {
    label: string
    description: string
    value?: File | null
    onChange: (file: File | null) => void
    previewClassName?: string
}) {
    const previewUrl = useObjectUrl(value)

    return (
        <label className="grid gap-2 rounded-lg border border-dashed p-4">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm text-muted-foreground">{description}</span>
            {previewUrl ? (
                <span className={`overflow-hidden rounded-lg border bg-muted ${previewClassName}`}>
                    <img
                        src={previewUrl}
                        alt={`${label} preview`}
                        className="h-full w-full object-cover"
                    />
                </span>
            ) : null}
            <Input
                type="file"
                accept="image/*"
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />
        </label>
    )
}

export function dateInputValue(value: string | Date) {
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return value
}

function useObjectUrl(file?: File | null) {
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!file) {
            setUrl(null)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setUrl(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    return url
}
