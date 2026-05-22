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
        <div className="rounded-md bg-background/70 p-3">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 break-words text-base font-medium">{value}</div>
        </div>
    )
}

export function KeyValue({label, value}: { label: string; value?: string | ReactNode | null }) {
    return (
        <div className="grid gap-1 py-2 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="min-w-0 break-words text-sm font-medium text-foreground">{value || "Not set"}</dd>
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
