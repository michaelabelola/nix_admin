import type {PropsWithChildren, ReactNode} from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@suiteonix/ui"

export function SummaryMetric({label, value}: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-medium break-words">{value || "Not set"}</div>
    </div>
  )
}

export function KeyValue({label, value}: { label: string; value?: string | ReactNode | null }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm break-words">{value || "Not set"}</div>
    </div>
  )
}

export function SectionCard({
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
