import type {PropsWithChildren, ReactNode} from "react";

import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card.tsx";

export function SummaryMetric({label, value}: { label: string; value?: string | null }) {
    return (
        <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-2 text-base font-medium wrap-break-word">{value || "Not set"}</div>
        </div>
    )
}

export function KeyValue({label, value}: { label: string; value?: string | ReactNode | null }) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="text-sm wrap-break-word">{value || "Not set"}</div>
        </div>
    )
}

export function EmptyState({title, description}: { title: string; description: string }) {
    return (
        <div
            className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
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
        <div className={""}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </div>
    )
}
