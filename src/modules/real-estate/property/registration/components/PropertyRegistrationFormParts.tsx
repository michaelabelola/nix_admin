import type {ReactNode} from "react"

import {Alert, AlertDescription, AlertTitle} from "#/components/ui/alert.tsx"
import {Label} from "#/components/ui/label.tsx"
import {cn} from "#/lib/utils.ts";

export function required(value: string, label: string) {
    if (!value.trim()) {
        return `${label} is required`
    }

    return undefined
}

export function toNullableString(value?: string | null) {
    const normalized = value?.trim() ?? ""
    return normalized ? normalized : null
}

export function toNullableNumber(value?: string | number | null) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null
    }

    const normalized = value?.trim() ?? ""
    if (!normalized) return null

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
}

export function splitTagIds(value: string) {
    return [...new Set(value.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean))]
}

export function StepField({
                              label,
                              description,
                              error,
                              children,
                              fullWidth = false
                          }: {
    label: string
    description?: string
    error?: string
    fullWidth?: boolean
    children: ReactNode
}) {
    return (
        <div className={cn("grid gap-2",fullWidth ? "w-full" : "")}>
            <Label className="text-sm font-medium">{label}</Label>
            {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
            {children}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    )
}

export function StepMutationError({
                                      title = "Request failed",
                                      message,
                                  }: {
    title?: string
    message?: string
}) {
    if (!message) return null

    return (
        <Alert variant="destructive">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}
