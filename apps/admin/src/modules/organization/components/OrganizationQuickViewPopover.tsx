import type {ReactNode} from "react"

import type {OrgProfileModel} from "@suiteonix/server"
import {OrgProfileRequest} from "@suiteonix/server"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Badge,
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
    Skeleton,
} from "@suiteonix/ui"
import {BadgeCheck, Building2, Hash} from "lucide-react"

type OrganizationQuickViewPopoverProps = {
    orgID?: OrgProfileModel.OrgID | null
    organization?: OrgProfileModel.OrgProfile
    children: ReactNode
}

function getOrgIdText(id?: OrgProfileModel.OrgIDRef) {
    if (!id) return "Not set"
    return typeof id === "string" ? id : id.id
}

function getInitials(name?: string, shortName?: string) {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean)
    const fromName = parts.slice(0, 2).map((part) => part[0]).join("")
    return (fromName || shortName?.slice(0, 2) || "OG").toUpperCase()
}

function OrganizationQuickViewRow({
    icon,
    label,
    value,
}: {
    icon: typeof Building2
    label: string
    value?: ReactNode
}) {
    const Icon = icon

    return (
        <div className="flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2">
            <div className="mt-0.5 rounded-sm border bg-background p-1.5 text-muted-foreground">
                <Icon className="size-3.5"/>
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <div className="break-words text-sm text-foreground">{value || "Not provided"}</div>
            </div>
        </div>
    )
}

export function OrganizationQuickViewPopover({
    orgID,
    organization,
    children,
}: OrganizationQuickViewPopoverProps) {
    const query = OrgProfileRequest.useGetOrgProfileByID(organization ? undefined : orgID)

    if (!orgID && !organization) {
        return <>{children}</>
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-96 space-y-4">
                <OrganizationQuickViewContent
                    organization={organization ?? query.data}
                    isLoading={query.isLoading}
                />
            </PopoverContent>
        </Popover>
    )
}

export function OrganizationQuickViewContent({
    organization,
    isLoading,
}: {
    organization?: OrgProfileModel.OrgProfile
    isLoading?: boolean
}) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-16 rounded-xl"/>
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </div>
                </div>
                <Skeleton className="h-24 w-full"/>
            </div>
        )
    }

    if (!organization) {
        return (
            <PopoverHeader>
                <PopoverTitle>Organization unavailable</PopoverTitle>
                <PopoverDescription>The organization profile could not be loaded.</PopoverDescription>
            </PopoverHeader>
        )
    }

    const orgID = getOrgIdText(organization.id)

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <Avatar className="size-16 rounded-xl border">
                    <AvatarImage
                        src={organization.logo ?? undefined}
                        alt={`${organization.name}'s logo`}
                        className="object-cover"
                    />
                    <AvatarFallback className="rounded-xl text-base">
                        {getInitials(organization.name, organization.shortName)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-2">
                    <PopoverHeader>
                        <PopoverTitle className="text-base">{organization.name || "Unknown organization"}</PopoverTitle>
                        <PopoverDescription className="text-xs">
                            Organization ID: {orgID}
                        </PopoverDescription>
                    </PopoverHeader>
                    <div className="flex flex-wrap gap-2">
                        {organization.approved ? (
                            <Badge variant="secondary">
                                <BadgeCheck className="size-3.5"/>
                                Approved
                            </Badge>
                        ) : (
                            <Badge variant="outline">Pending approval</Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-2">
                <OrganizationQuickViewRow icon={Building2} label="Short name" value={organization.shortName}/>
                <OrganizationQuickViewRow icon={Building2} label="Industry" value={organization.industry}/>
                <OrganizationQuickViewRow icon={Hash} label="Entity ID" value={organization.entityID}/>
            </div>
        </div>
    )
}
