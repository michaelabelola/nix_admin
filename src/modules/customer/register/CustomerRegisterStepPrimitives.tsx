import type {ElementType, ReactNode} from "react"

export function RegisterStepInsight({
    icon: Icon,
    title,
    children,
}: {
    icon: ElementType
    title: string
    children: ReactNode
}) {
    return (
        <div className="flex items-start gap-4 rounded-xl border bg-muted/30 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5"/>
            </div>
            <div>
                <div className="font-medium">{title}</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{children}</p>
            </div>
        </div>
    )
}

export function RegisterStepGrid({children}: { children: ReactNode }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {children}
        </div>
    )
}
