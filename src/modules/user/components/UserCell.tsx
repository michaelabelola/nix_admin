import type {NixID} from "#/models/Models.ts";
import {UserRequest} from "#/modules/user/api.hook.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx";
import {Skeleton} from "#/components/ui/skeleton.tsx";
import {Item} from "#/components/ui/item.tsx";
import {type UserModel} from "#/modules/user/Models.ts";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "#/components/ui/popover.tsx";
import {Button} from "#/components/ui/button.tsx";
import {Separator} from "#/components/ui/separator.tsx";
import {BriefcaseBusinessIcon, CalendarDays, ExternalLink, Eye, Mail, Phone, UserRound} from "lucide-react";
import OrganizationRequest from "#/modules/organization/organization.request.ts";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";

function formatUserCreatedDate(value?: string | Date) {
    if (!value) return "Unknown"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Unknown"

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

function getInitials(firstname?: string, lastname?: string) {
    return `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.trim() || "U"
}

function UserDetailRow({
                           icon: Icon,
                           label,
                           value,
                           actions,
                       }: {
    icon: typeof Mail
    label: string
    value?: string
    actions?: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2">
            <div className="mt-0.5 rounded-sm border bg-background p-1.5 text-muted-foreground">
                <Icon className="size-3.5"/>
            </div>
            <div className="min-w-0 w-full">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="break-words text-sm text-foreground">{value?.trim() || "Not provided"}</p>
            </div>
            {actions &&
                <div className="min-w-0 h-full flex items-center">
                    {actions}
                </div>}
        </div>
    )
}


function EntityDetailRow({orgID}: { orgID?: NixID }) {
    if (!orgID) return null;
    const {data} = OrganizationRequest.useGetOrganizationByID(orgID as any)

    return (
        <UserDetailRow icon={BriefcaseBusinessIcon} label={"Organization"} value={data?.name} actions={
            <QuickToolTip content="View organization" asChild={true}>
                <Button variant={"outline"} size={"xs"}><Eye/></Button>
            </QuickToolTip>
        }/>
    )
}

function Cell1(props: { id: NixID }) {
    const {data: user, isLoading, error} = UserRequest.useGetUser(props.id)

    if (isLoading)
        return <div>
            <Skeleton className="h-8 w-8 rounded-lg"/>
        </div>

    if (error)
        return <div>{error.message}</div>


    return <Cell2 user={user}/>;
}

function Cell2({user}: { user?: UserModel.User }) {
    if (!user)
        return <div>
            <Skeleton className="h-8 w-8 rounded-lg"/>
        </div>

    return (
        <Item variant={"default"} className={"flex flex-row justify-center gap-2 rounded-lg p-2 flex-nowrap"}>
            <Avatar className="h-5 w-5 rounded-lg grayscale">
                <AvatarImage src={user?.avatar} alt={`${user?.firstname}'s avatar`} className={"object-cover"}/>
                <AvatarFallback className="rounded-lg">{user?.firstname}</AvatarFallback>
            </Avatar>
            <div>{`${user?.firstname} ${user?.lastname}`}</div>
        </Item>
    );
}

function CellWithPopover(props: { id: NixID }) {
    const {data: user, isLoading, error} = UserRequest.useGetUser(props.id)

    if (isLoading)
        return <div>
            <Skeleton className="h-8 w-8 rounded-lg"/>
        </div>

    if (error)
        return <div>{error.message}</div>


    return <Cell2WithPopOver user={user}/>;
}

function Cell2WithPopOver({user}: { user?: UserModel.User }) {
    // const auth = useAuthenticatedUser()
    // if (!auth.user?.orgID || !user)
    //     return <Cell2 user={user}/>

    return <Popover>
        <PopoverTrigger>
            <Cell2 user={user}/>
        </PopoverTrigger>
        <PopoverContent className="w-96 space-y-4">
            <CellPopoverContent user={user}/>
        </PopoverContent>
    </Popover>
}

function CellPopoverContent({user}: { user?: UserModel.User }) {
    const {data: detailedUser, isLoading, error} = UserRequest.useGetDetailedUser(user?.id as any)
    if (error) return <Cell2 user={user}/>

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-14 w-full"/>
                <Skeleton className="h-20 w-full"/>
                <Skeleton className="h-10 w-full"/>
            </div>
        )
    }

    const userPageHref = detailedUser?.id ? `/admin/users/${detailedUser.id}` : "#"
    const quickViewHref = detailedUser?.id ? `/admin/users/${detailedUser.id}?view=quick` : "#"

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <Avatar className="size-16 rounded-xl border">
                    <AvatarImage
                        src={detailedUser?.avatar}
                        alt={`${detailedUser?.firstname}'s avatar`}
                        className="object-cover"
                    />
                    <AvatarFallback className="rounded-xl text-base">
                        {getInitials(detailedUser?.firstname, detailedUser?.lastname)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-1">
                    <div>
                        <p className="text-lg font-semibold leading-tight">
                            {`${detailedUser?.firstname ?? ""} ${detailedUser?.lastname ?? ""}`.trim() || "Unknown user"}
                        </p>
                        <p className="text-sm text-muted-foreground">User
                            ID: {detailedUser?.id ?? user?.id ?? "Unknown"}</p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                        {detailedUser?.bio?.trim() || "No bio available for this user."}
                    </p>
                </div>
            </div>

            <div className="grid gap-2">
                <UserDetailRow icon={UserRound} label="First name" value={detailedUser?.firstname}/>
                <UserDetailRow icon={UserRound} label="Last name" value={detailedUser?.lastname}/>
                <UserDetailRow icon={Mail} label="Email" value={detailedUser?.email}/>
                <UserDetailRow icon={Phone} label="Phone" value={detailedUser?.phone}/>
                <EntityDetailRow orgID={detailedUser?.entityID || "6975238289302528003"}/>
                <UserDetailRow
                    icon={CalendarDays}
                    label="Registered On"
                    value={formatUserCreatedDate(detailedUser?.audit?.createdDate)}
                />
            </div>

            <Separator/>

            <div className="grid grid-cols-2 gap-2">
                <Button asChild size="sm">
                    <a href={userPageHref}>
                        <ExternalLink className="size-4"/>
                        User page
                    </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <a href={quickViewHref} target="_blank" rel="noreferrer">
                        <Eye className="size-4"/>
                        Quick view
                    </a>
                </Button>
            </div>
        </div>
    )

}

const UserCell = {
    Cell1,
    Cell2,
    CellWithPopover,
    Cell2WithPopOver

}

export default UserCell;
