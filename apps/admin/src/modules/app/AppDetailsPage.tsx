import {useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowLeft, Copy, ExternalLink, KeyRound} from "lucide-react";
import {toast} from "sonner";

import {Page} from "@suiteonix/components";
import {Avatar, AvatarFallback, AvatarImage} from "@suiteonix/ui";
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
import {AccessTokenModel} from "@suiteonix/server";
import {AccessTokenRequest} from "@suiteonix/server";
import {AppCredentialRevealCard} from "#/modules/app/components/AppCredentialRevealCard.tsx";
import type {AppModel} from "@suiteonix/server";
import {AppRequest} from "@suiteonix/server";
import {
    accessTokenStatusBadgeVariant,
    formatDateTime,
    getAppDisplayName,
    getInitials,
    tokenEnvironmentBadgeVariant,
} from "#/modules/app/app.utils.tsx";
import AccessTokenStatus = AccessTokenModel.AccessTokenStatus;
import TokenEnvironment = AccessTokenModel.TokenEnvironment;

async function copyValue(value: string, label: string) {
    await navigator.clipboard.writeText(value)
    toast.success(`${label} copied.`)
}

function DetailRow({label, value}: { label: string; value?: string | null }) {
    return (
        <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="break-all text-sm">{value || "Not set"}</div>
        </div>
    )
}

type TokenCreateDraft = {
    description: string
    environment: AccessTokenModel.TokenEnvironment
    expiresAt: string
}

const DEFAULT_TOKEN_DRAFT: TokenCreateDraft = {
    description: "",
    environment: AccessTokenModel.TokenEnvironment.LIVE,
    expiresAt: "",
}

export function AppDetailsPage({appId}: { appId: AppModel.AppID }) {
    const [tokenDraft, setTokenDraft] = useState<TokenCreateDraft>(DEFAULT_TOKEN_DRAFT)
    const [generatedCredentials, setGeneratedCredentials] = useState<{
        appId: AppModel.AppID
        entityId: string
        token: string
    } | null>(null)
    const appQuery = AppRequest.useGetApp(appId)
    const tokenQuery = AccessTokenRequest.useQueryAccessTokens({
        page: 0,
        size: 5,
        sort: [{field: "audit.createdDate", direction: "DESC"}],
        granteeID: appId,
    })
    const createToken = AccessTokenRequest.useCreateAccessToken((data) => {
        setGeneratedCredentials({
            appId,
            entityId: data.accessToken.entityID,
            token: data.token,
        })
        setTokenDraft(DEFAULT_TOKEN_DRAFT)
        toast.success("Token generated. Copy it before leaving this page.")
    })
    const app = appQuery.data

    function updateTokenDraft(patch: Partial<TokenCreateDraft>) {
        setTokenDraft((previous) => ({...previous, ...patch}))
    }

    function generateToken() {
        void createToken.mutateAsync({
            granteeID: appId,
            description: tokenDraft.description.trim() || null,
            environment: tokenDraft.environment,
            expiresAt: tokenDraft.expiresAt ? new Date(tokenDraft.expiresAt).toISOString() : null,
            permissions: [],
        })
    }

    return (
        <Page
            isLoading={appQuery.isLoading}
            isFetching={appQuery.isFetching}
            loading={{
                title: "Loading app",
                description: `Fetching app (${appId})`,
            }}
            header={{
                avatar: app?.avatar,
                title: getAppDisplayName(app),
                description: app?.about || "App integration details and issued access tokens.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/apps">
                                <ArrowLeft className="size-4"/>
                                Apps
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                void copyValue(appId, "App ID")
                            }}
                        >
                            <Copy className="size-4"/>
                            Copy ID
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <div className="space-y-4">
                <Card>
                    <CardHeader className="gap-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                                <Avatar className="size-14 rounded-xl">
                                    <AvatarImage src={app?.avatar || undefined} className="object-cover"/>
                                    <AvatarFallback className="rounded-xl">{getInitials(app?.name)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <CardTitle>{getAppDisplayName(app)}</CardTitle>
                                    <CardDescription>{app?.description || "No description"}</CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">ID: {appId}</Badge>
                                <Badge variant="outline">{app?.tags?.length ?? 0} tags</Badge>
                                {app?.webhook?.value ? (
                                    <Badge variant={app.webhook.isUp ? "success" : "secondary"}>Webhook</Badge>
                                ) : (
                                    <Badge variant="outline">No webhook</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <DetailRow label="Name" value={app?.name}/>
                        <DetailRow label="Entity" value={app?.entityID}/>
                        <DetailRow label="Webhook URL" value={app?.webhook?.value}/>
                        <DetailRow label="Webhook Status"
                                   value={app?.webhook?.isUp == null ? null : app.webhook.isUp ? "Up" : "Down"}/>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                            <CardDescription>Public-facing app summary and operational notes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {app?.about || "No about text has been provided for this app."}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {app?.description || "No description has been provided for this app."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {(app?.tags ?? []).length ? (
                                    app?.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)
                                ) : (
                                    <Badge variant="outline">No tags</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <CardTitle>Generate Token</CardTitle>
                                        <CardDescription>Create a new app token for API access.</CardDescription>
                                    </div>
                                    <KeyRound className="size-5 text-muted-foreground"/>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="token-description">Description</Label>
                                    <Input
                                        id="token-description"
                                        value={tokenDraft.description}
                                        placeholder="Production sync token"
                                        onChange={(event) => updateTokenDraft({description: event.target.value})}
                                    />
                                </div>
                                <div className="grid gap-2 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Environment</Label>
                                        <Select
                                            value={tokenDraft.environment}
                                            onValueChange={(value) => updateTokenDraft({environment: value as AccessTokenModel.TokenEnvironment})}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(AccessTokenModel.TokenEnvironment).map((environment) => (
                                                    <SelectItem key={environment} value={environment}>
                                                        {environment}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="token-expires-at">Expiry date</Label>
                                        <Input
                                            id="token-expires-at"
                                            type="datetime-local"
                                            value={tokenDraft.expiresAt}
                                            onChange={(event) => updateTokenDraft({expiresAt: event.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        disabled={createToken.isPending}
                                        onClick={generateToken}
                                    >
                                        {createToken.isPending ? "Generating..." : "Generate token"}
                                        <KeyRound className="size-4"/>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {generatedCredentials ? (
                            <AppCredentialRevealCard
                                appId={generatedCredentials.appId}
                                entityId={generatedCredentials.entityId}
                                token={generatedCredentials.token}
                            />
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <CardTitle>Recent Access Tokens</CardTitle>
                                    <CardDescription>Latest app tokens issued for this app.</CardDescription>
                                </div>
                                <KeyRound className="size-5 text-muted-foreground"/>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(tokenQuery.data?.content ?? []).length ? (
                                tokenQuery.data.content.map((token) => (
                                    <div key={token.id} className="rounded-lg border p-4">
                                        <div
                                            className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-1">
                                                <div className="font-mono text-sm">{token.mask || token.id}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {token.description || "No description"}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Expires: {formatDateTime(token.expiresAt) || "No expiry"}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge
                                                    variant={accessTokenStatusBadgeVariant[token.status as any as AccessTokenStatus]}>
                                                    {token.status}
                                                </Badge>
                                                <Badge
                                                    variant={tokenEnvironmentBadgeVariant[token.environment as any as TokenEnvironment]}>
                                                    {token.environment}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No access tokens found for this app.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {app?.webhook?.value ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Webhook</CardTitle>
                            <CardDescription>Configured webhook endpoint for app callbacks.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="break-all font-mono text-sm">{app.webhook.value}</div>
                            <Button variant="outline" size="sm" asChild>
                                <a href={app.webhook.value} target="_blank" rel="noreferrer">
                                    Open
                                    <ExternalLink className="size-4"/>
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </Page>
    )
}
