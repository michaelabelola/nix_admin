import type {ReactNode} from "react";
import {Link} from "@tanstack/react-router";
import {ExternalLink, Globe2} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@suiteonix/ui";
import {Badge} from "@suiteonix/ui";
import {Button} from "@suiteonix/ui";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@suiteonix/ui";
import type {AppModel} from "@suiteonix/server";
import {getAppDisplayName, getInitials} from "#/modules/app/app.utils.tsx";

export function AppQuickViewPopover({
    app,
    children,
}: {
    app?: AppModel.App | AppModel.Detailed
    children: ReactNode
}) {
    if (!app) {
        return <>{children}</>
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-96 space-y-4">
                <AppQuickViewContent app={app}/>
            </PopoverContent>
        </Popover>
    )
}

export function AppQuickViewContent({app}: { app?: AppModel.App | AppModel.Detailed }) {
    if (!app) return null

    return (
        <div className="space-y-4">
            <PopoverHeader>
                <div className="flex items-start gap-3">
                    <Avatar className="mt-0.5 rounded-lg">
                        <AvatarImage src={app.avatar || undefined} className="object-cover"/>
                        <AvatarFallback className="rounded-lg">{getInitials(app.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <PopoverTitle className="truncate text-base">{getAppDisplayName(app)}</PopoverTitle>
                        <PopoverDescription className="text-xs">
                            App ID: {app.id}
                        </PopoverDescription>
                    </div>
                </div>
            </PopoverHeader>

            <p className="text-sm text-muted-foreground">
                {app.description || app.about || "No description"}
            </p>

            <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{app.tags?.length ?? 0} tags</Badge>
                {app.webhook?.value ? (
                    <Badge variant={app.webhook.isUp ? "success" : "secondary"}>
                        <Globe2 className="size-3"/>
                        Webhook
                    </Badge>
                ) : (
                    <Badge variant="outline">No webhook</Badge>
                )}
            </div>

            <Button size="sm" variant="outline" asChild>
                <Link to="/admin/apps/$appId" params={{appId: app.id}}>
                    Open app
                    <ExternalLink className="size-4"/>
                </Link>
            </Button>
        </div>
    )
}

export const AppPopover = AppQuickViewPopover
