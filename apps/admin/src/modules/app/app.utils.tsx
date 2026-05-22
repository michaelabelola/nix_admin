import type {VariantProps} from "class-variance-authority";

import type {badgeVariants} from "#/components/ui/badge.tsx";
import {AccessTokenModel} from "#/modules/access-token/model.ts";
import type {AppModel} from "#/modules/app/model.ts";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export function getAppDisplayName(app?: Pick<AppModel.App, "name" | "id"> | null) {
    return app?.name?.trim() || app?.id || "Untitled app"
}

export function getInitials(value?: string | null) {
    return value?.trim()?.substring(0, 2).toUpperCase() || "AP"
}

export function formatDateTime(value?: string | Date | null) {
    if (!value) return null

    try {
        const date = typeof value === "string" ? new Date(value) : value
        if (Number.isNaN(date.getTime())) return String(value)

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date)
    } catch {
        return String(value)
    }
}

export const accessTokenStatusBadgeVariant: Record<AccessTokenModel.AccessTokenStatus, BadgeVariant> = {
    ACTIVE: "success",
    FROZEN: "warning",
    DEACTIVATED: "secondary",
    EXPIRED: "destructive",
}

export const tokenEnvironmentBadgeVariant: Record<AccessTokenModel.TokenEnvironment, BadgeVariant> = {
    LIVE: "success",
    DEVELOPMENT: "warning",
    PRODUCTION: "default",
}
