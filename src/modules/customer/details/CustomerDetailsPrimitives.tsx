import type {PropsWithChildren, ReactNode} from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card.tsx"

export function SummaryMetric({label, value}: { label: string; value?: string | null }) {
    return (
        <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-2 break-words text-base font-medium">{value || "Not set"}</div>
        </div>
    )
}

export function KeyValue({label, value}: { label: string; value?: string | ReactNode | null }) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="break-words text-sm">{value || "Not set"}</div>
        </div>
    )
}

export function EmptyState({title, description}: { title: string; description: string }) {
    return (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
            <div className="font-medium">{title}</div>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

export function DefinitionCard({
    title,
    description,
    children,
}: PropsWithChildren<{
    title: string
    description: string
}>) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
