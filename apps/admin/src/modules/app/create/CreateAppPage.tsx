import {type ReactNode, useMemo, useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowRight, KeyRound, ShieldCheck, Webhook} from "lucide-react";
import {toast} from "sonner";

import Page from "#/components/Page.tsx";
import {Badge} from "@suiteonix/ui";
import {Button} from "@suiteonix/ui";
import {ButtonGroup} from "@suiteonix/ui";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@suiteonix/ui";
import {Input} from "@suiteonix/ui";
import {Label} from "@suiteonix/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui";
import {Textarea} from "@suiteonix/ui";
import {AccessTokenModel} from "@suiteonix/server";
import {AppCredentialRevealCard} from "#/modules/app/components/AppCredentialRevealCard.tsx";
import type {AppModel} from "@suiteonix/server";
import {AppRequest} from "@suiteonix/server";
import type {PermissionModel} from "@suiteonix/server";

const INTRO_ITEMS = [
    {
        title: "Create the app identity",
        description: "Set the name, description, avatar URL, and optional tags used by admin workflows.",
        icon: ShieldCheck,
    },
    {
        title: "Generate the first token",
        description: "The backend returns the raw app token only once after creation, so copy it immediately.",
        icon: KeyRound,
    },
    {
        title: "Attach permissions and webhooks",
        description: "Optionally grant system permissions and configure a webhook endpoint during creation.",
        icon: Webhook,
    },
] as const

type AppCreateDraft = {
    name: string
    about: string
    description: string
    avatar: string
    webhookUrl: string
    tagIds: string
    tokenDescription: string
    tokenEnvironment: AccessTokenModel.TokenEnvironment
    tokenExpiresAt: string
    permissionGrantsJson: string
}

const DEFAULT_DRAFT: AppCreateDraft = {
    name: "",
    about: "",
    description: "",
    avatar: "",
    webhookUrl: "",
    tagIds: "",
    tokenDescription: "",
    tokenEnvironment: AccessTokenModel.TokenEnvironment.LIVE,
    tokenExpiresAt: "",
    permissionGrantsJson: "",
}

function FormField({
    label,
    description,
    children,
}: {
    label: string
    description?: string
    children: ReactNode
}) {
    return (
        <label className="grid gap-2">
            <Label className="text-sm font-medium">{label}</Label>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            {children}
        </label>
    )
}

function parseDelimitedIds(value: string) {
    return value
        .split(/[\s,]+/)
        .map((item) => item.trim())
        .filter(Boolean)
}

function parsePermissionGrants(value: string): PermissionModel.GrantSystemPermission[] {
    if (!value.trim()) return []

    const parsed = JSON.parse(value) as PermissionModel.GrantSystemPermission[]
    if (!Array.isArray(parsed)) {
        throw new Error("Permission grants must be a JSON array.")
    }
    return parsed
}

function toPayload(draft: AppCreateDraft): AppModel.Create {
    return {
        name: draft.name.trim(),
        about: draft.about.trim() || null,
        description: draft.description.trim() || null,
        avatar: draft.avatar.trim() || null,
        webhook: draft.webhookUrl.trim() ? {value: draft.webhookUrl.trim()} : null,
        tags: parseDelimitedIds(draft.tagIds),
        tokenDescription: draft.tokenDescription.trim() || null,
        tokenEnvironment: draft.tokenEnvironment,
        tokenExpiresAt: draft.tokenExpiresAt ? new Date(draft.tokenExpiresAt).toISOString() : null,
        permissions: parsePermissionGrants(draft.permissionGrantsJson),
    }
}

export function CreateAppIntroPage() {
    return (
        <Page
            header={{
                title: "Create App",
                description: "Start with the integration shape before generating an app token.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/apps">Back to apps</Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardHeader className="space-y-3">
                    <CardTitle className="text-3xl">Create an app integration</CardTitle>
                    <CardDescription className="max-w-3xl text-sm leading-7">
                        Apps receive their own app ID, optional system permissions, and an access token generated
                        at creation time. Copy the token after submission because it should not be exposed again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <div className="grid min-w-0 gap-3">
                        {INTRO_ITEMS.map((item, index) => (
                            <div key={item.title} className="flex min-w-0 items-start gap-3 rounded-lg border bg-background/70 p-4">
                                <div className="shrink-0 rounded-lg border bg-muted p-2 text-primary">
                                    <item.icon className="size-4"/>
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium">
                                        {index + 1}. {item.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid min-w-0 gap-4 rounded-xl border bg-background/70 p-5">
                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold">Before you proceed</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Prepare the app name, optional webhook URL, optional tag IDs, and any system permission
                                grants that should be applied to the app immediately.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Token returned once</Badge>
                            <Badge variant="outline">Optional expiry</Badge>
                            <Badge variant="outline">Optional grants</Badge>
                        </div>
                        <div className="pt-2">
                            <Button asChild size="lg">
                                <Link to="/admin/apps/create/setup">
                                    Start app setup
                                    <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Page>
    )
}

export function CreateAppPage() {
    const [draft, setDraft] = useState<AppCreateDraft>(DEFAULT_DRAFT)
    const [createdCredentials, setCreatedCredentials] = useState<{
        appId: AppModel.AppID
        entityId: string
        token: string
    } | null>(null)
    const createApp = AppRequest.useCreateApp((data) => {
        setCreatedCredentials({
            appId: data.app.id,
            entityId: data.app.entityID,
            token: data.accessToken,
        })
        toast.success("App created. Copy the generated token before leaving this page.")
    })

    const canSubmit = draft.name.trim().length > 0 && !createApp.isPending
    const tagPreview = useMemo(() => parseDelimitedIds(draft.tagIds), [draft.tagIds])

    const updateDraft = (patch: Partial<AppCreateDraft>) => {
        setDraft((previous) => ({...previous, ...patch}))
    }

    const submit = async () => {
        if (!canSubmit) return
        try {
            await createApp.mutateAsync(toPayload(draft))
        } catch (error) {
            if (error instanceof SyntaxError || error instanceof Error) {
                toast.error(error.message)
            }
        }
    }

    return (
        <Page
            header={{
                title: "App Setup",
                description: "Create the app record, generate its first token, and optionally attach grants.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/apps/create">Intro</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/admin/apps">Back to apps</Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <Card className="min-w-0">
                    <CardHeader>
                        <CardTitle>App Details</CardTitle>
                        <CardDescription>
                            The app name is required. Other fields can be added after creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="App name" description="Required. This becomes the app display name.">
                                <Input
                                    value={draft.name}
                                    placeholder="Partner Sync"
                                    aria-invalid={createApp.errHandler.hasError("name")}
                                    onChange={(event) => updateDraft({name: event.target.value})}
                                />
                            </FormField>
                            <FormField label="Avatar URL" description="Optional image URL.">
                                <Input
                                    value={draft.avatar}
                                    placeholder="https://example.com/app.png"
                                    onChange={(event) => updateDraft({avatar: event.target.value})}
                                />
                            </FormField>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="About" description="Short summary displayed in admin lists.">
                                <Textarea
                                    value={draft.about}
                                    rows={4}
                                    placeholder="Syncs external property inventory into Suiteonix."
                                    onChange={(event) => updateDraft({about: event.target.value})}
                                />
                            </FormField>
                            <FormField label="Description" description="Longer operational note for admins.">
                                <Textarea
                                    value={draft.description}
                                    rows={4}
                                    placeholder="Used by the partner integration service..."
                                    onChange={(event) => updateDraft({description: event.target.value})}
                                />
                            </FormField>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Webhook URL" description="Optional callback endpoint.">
                                <Input
                                    value={draft.webhookUrl}
                                    placeholder="https://example.com/webhooks/suiteonix"
                                    onChange={(event) => updateDraft({webhookUrl: event.target.value})}
                                />
                            </FormField>
                            <FormField label="Tag IDs" description="Separate ids with commas, spaces, or line breaks.">
                                <Textarea
                                    value={draft.tagIds}
                                    rows={3}
                                    placeholder="12345&#10;67890"
                                    onChange={(event) => updateDraft({tagIds: event.target.value})}
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid min-w-0 gap-6">
                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle>Initial Token</CardTitle>
                            <CardDescription>
                                The backend generates an app token when the app is created.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Token description">
                                <Input
                                    value={draft.tokenDescription}
                                    placeholder="Initial production token"
                                    onChange={(event) => updateDraft({tokenDescription: event.target.value})}
                                />
                            </FormField>
                            <FormField label="Environment">
                                <Select
                                    value={draft.tokenEnvironment}
                                    onValueChange={(value) => updateDraft({tokenEnvironment: value as AccessTokenModel.TokenEnvironment})}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(AccessTokenModel.TokenEnvironment).map((environment) => (
                                            <SelectItem key={environment} value={environment}>{environment}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Expiry date" description="Optional. Stored in the generated JWT.">
                                <Input
                                    type="datetime-local"
                                    value={draft.tokenExpiresAt}
                                    onChange={(event) => updateDraft({tokenExpiresAt: event.target.value})}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle>Permission Grants</CardTitle>
                            <CardDescription>
                                Optional JSON array of system permission grants for the new app.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={draft.permissionGrantsJson}
                                rows={8}
                                className="font-mono text-xs"
                                placeholder={'[{"permissionDefinitionId":"product:create","actions":["create"]}]'}
                                onChange={(event) => updateDraft({permissionGrantsJson: event.target.value})}
                            />
                            <p className="text-xs text-muted-foreground">
                                Each grant accepts `permissionDefinitionId`, `actions`, and optional `entityID`.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="min-w-0 xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Review & Create</CardTitle>
                        <CardDescription>
                            Submit once. The raw token should be copied immediately after creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant={draft.name.trim() ? "success" : "warning"}>
                                {draft.name.trim() ? "Name ready" : "Name required"}
                            </Badge>
                            <Badge variant="outline">{tagPreview.length} tags</Badge>
                            <Badge variant="outline">{draft.tokenEnvironment}</Badge>
                            {draft.tokenExpiresAt ? <Badge variant="outline">Expires set</Badge> : <Badge variant="secondary">No expiry</Badge>}
                        </div>
                        <Button disabled={!canSubmit} onClick={() => void submit()}>
                            {createApp.isPending ? "Creating..." : "Create app"}
                            <ArrowRight className="size-4"/>
                        </Button>
                    </CardContent>
                </Card>

                {createdCredentials ? (
                    <div className="xl:col-span-2">
                        <AppCredentialRevealCard
                            appId={createdCredentials.appId}
                            entityId={createdCredentials.entityId}
                            token={createdCredentials.token}
                            title="App created"
                        />
                        <div className="mt-3 flex justify-end">
                            <Button asChild>
                                <Link to="/admin/apps/$appId" params={{appId: createdCredentials.appId}}>
                                    Open app
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </Page>
    )
}
