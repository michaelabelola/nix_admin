import {Page} from "@suiteonix/components"
import type {OrgProfileModel} from "@suiteonix/server"
import {OrgProfileRequest, useAuthenticatedUser} from "@suiteonix/server"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Separator,
} from "@suiteonix/ui"
import {BadgeCheck, Ban, Building2, CalendarDays, Mail, MapPin, Phone} from "lucide-react"

type DetailItem = {
    label: string
    value?: string | null
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

function formatLocation(location?: OrgProfileModel.ListingLocation | null) {
    if (!location) return null

    return [
        location.apt_number,
        location.street,
        location.city,
        location.state,
        location.country,
        location.zipcode,
    ].filter(Boolean).join(", ") || null
}

function formatDate(value?: string | null) {
    if (!value) return null

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat("en-US", {dateStyle: "medium"}).format(date)
}

function DetailMetric({label, value}: DetailItem) {
    return (
        <div className="rounded-md bg-background/70 p-3">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 break-words text-base font-medium">{value || "Not set"}</div>
        </div>
    )
}

function DetailRow({
    icon,
    label,
    value,
}: {
    icon: typeof Building2
    label: string
    value?: string | null
}) {
    const Icon = icon

    return (
        <div className="flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2">
            <div className="mt-0.5 rounded-sm border bg-background p-1.5 text-muted-foreground">
                <Icon className="size-3.5"/>
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="break-words text-sm font-medium">{value || "Not set"}</p>
            </div>
        </div>
    )
}

function visibleItems(items: DetailItem[]) {
    return items.filter((item) => item.value?.trim())
}

export default function PublicOrgProfilePage() {
    const {user, isHydrated} = useAuthenticatedUser()
    const orgID = user?.orgID
    const {data, isLoading, isFetching} = OrgProfileRequest.useGetDetailedOrgProfileByID(orgID)

    const location = formatLocation(data?.location)
    const establishedDate = formatDate(data?.dateEstablished)
    const overviewItems = visibleItems([
        {label: "Organization ID", value: getOrgIdText(data?.id)},
        {label: "Short name", value: data?.shortName},
        {label: "Industry", value: data?.industry},
        {label: "Entity ID", value: data?.entityID},
        {label: "Established", value: establishedDate},
        {label: "Location", value: location},
    ])

    return (
        <Page
            isLoading={!isHydrated || isLoading}
            isFetching={isFetching}
            loading={{
                title: "Loading public profile",
                description: orgID ? `Fetching organization profile (${orgID})` : "Resolving organization context.",
            }}
            header={{
                avatar: data?.logo,
                title: data?.name || "Public Profile",
                description: data?.shortName
                    ? `${data.shortName} public organization profile`
                    : "Public organization profile",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Back
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <div className="space-y-5 rounded-xl p-4 sm:p-6">
                {data?.coverImage ? (
                    <div className="relative min-h-56 overflow-hidden rounded-lg border bg-muted">
                        <img
                            src={data.coverImage}
                            alt={`${data.name}'s cover`}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]"/>
                        <div className="relative flex min-h-56 items-end p-5">
                            <ProfileIdentity profile={data}/>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border bg-muted/30 p-5">
                        <ProfileIdentity profile={data}/>
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
                    <Card className="rounded-lg p-4 sm:p-5">
                        <CardHeader className="mb-4">
                            <CardTitle>Overview</CardTitle>
                            <p className="text-sm text-muted-foreground">Public organization details and status.</p>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {overviewItems.map((item) => (
                                <DetailMetric key={item.label} label={item.label} value={item.value}/>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg p-4 sm:p-5">
                        <CardHeader className="mb-4">
                            <CardTitle>Contact</CardTitle>
                            <p className="text-sm text-muted-foreground">Primary channels shown on the public profile.</p>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <DetailRow icon={Mail} label="Email" value={data?.email}/>
                            <DetailRow icon={Phone} label="Phone" value={data?.phone}/>
                            <DetailRow icon={MapPin} label="Location" value={location}/>
                            <DetailRow icon={CalendarDays} label="Date established" value={establishedDate}/>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="rounded-lg p-4 sm:p-5">
                        <CardHeader className="mb-4">
                            <CardTitle>About</CardTitle>
                            <p className="text-sm text-muted-foreground">Organization profile narrative.</p>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                {data?.about || "No public profile description has been provided."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg p-4 sm:p-5">
                        <CardHeader className="mb-4">
                            <CardTitle>Channels</CardTitle>
                            <p className="text-sm text-muted-foreground">Additional contacts and social accounts.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Contacts</h3>
                                {data?.contacts?.length ? data.contacts.map((contact) => (
                                    <div key={`${contact.method}-${contact.value}`} className="flex justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">{contact.method}</span>
                                        <span className="break-words text-right font-medium">{contact.value}</span>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No additional contacts.</p>}
                            </div>
                            <Separator/>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Socials</h3>
                                {data?.socials?.length ? data.socials.map((social) => (
                                    <div key={`${social.name}-${social.value}`} className="flex justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">{social.name}</span>
                                        <span className="break-words text-right font-medium">{social.value}</span>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No social accounts.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Page>
    )
}

function ProfileIdentity({profile}: { profile?: OrgProfileModel.Detailed }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
                <Avatar className="size-20 rounded-xl border bg-background">
                    <AvatarImage src={profile?.logo ?? undefined} alt={`${profile?.name ?? "Organization"} logo`} className="object-cover"/>
                    <AvatarFallback className="rounded-xl text-lg">
                        {getInitials(profile?.name, profile?.shortName)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <h2 className="break-words text-2xl font-semibold">{profile?.name || "Organization profile"}</h2>
                    <p className="break-words text-sm text-muted-foreground">{profile?.industry || "Industry not set"}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {profile?.verified ? (
                    <Badge variant="success">
                        <BadgeCheck className="size-3.5"/>
                        Verified
                    </Badge>
                ) : (
                    <Badge variant="outline">Unverified</Badge>
                )}
                {profile?.approved ? <Badge variant="secondary">Approved</Badge> : <Badge variant="outline">Pending approval</Badge>}
                {profile?.suspended ? (
                    <Badge variant="destructive">
                        <Ban className="size-3.5"/>
                        Suspended
                    </Badge>
                ) : null}
            </div>
        </div>
    )
}
