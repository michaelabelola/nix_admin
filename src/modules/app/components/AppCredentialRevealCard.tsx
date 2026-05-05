import {BookOpen, Copy, ExternalLink} from "lucide-react"
import {toast} from "sonner"

import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import type {AppModel} from "#/modules/app/model.ts"

function getApiDocsUrl() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    if (!baseUrl) return "/docs"
    return new URL("/docs", baseUrl).toString()
}

function copyValue(value: string, label: string) {
    void navigator.clipboard.writeText(value)
    toast.success(`${label} copied.`)
}

function CredentialValue({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="min-w-0 space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
            <code className="block break-all rounded-md bg-muted px-3 py-2 text-xs">{value}</code>
        </div>
    )
}

export function AppCredentialRevealCard({
    appId,
    entityId,
    token,
    title = "Generated token",
}: {
    appId: AppModel.AppID
    entityId: string
    token: string
    title?: string
}) {
    const docsUrl = getApiDocsUrl()

    return (
        <Card className="border-success/40">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Copy this token now. It may not be shown again.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid min-w-0 gap-4">
                <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                    <CredentialValue label="Token" value={token}/>
                    <CredentialValue label="App ID" value={appId}/>
                    <CredentialValue label="Entity ID" value={entityId}/>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => copyValue(token, "Token")}>
                            <Copy className="size-4"/>
                            Copy token
                        </Button>
                        <Button variant="outline" onClick={() => copyValue(appId, "App ID")}>
                            <Copy className="size-4"/>
                            Copy app ID
                        </Button>
                        <Button variant="outline" onClick={() => copyValue(entityId, "Entity ID")}>
                            <Copy className="size-4"/>
                            Copy entity ID
                        </Button>
                    </div>
                    <Button asChild>
                        <a href={docsUrl} target="_blank" rel="noreferrer">
                            <BookOpen className="size-4"/>
                            API docs
                            <ExternalLink className="size-4"/>
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
