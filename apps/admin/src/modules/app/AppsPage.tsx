import {useMemo} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Link} from "@tanstack/react-router";
import {ArrowRight, Copy, PlusCircle} from "lucide-react";
import {toast} from "sonner";
import {DataTable} from "@suiteonix/components";
import type {
    DataTableFilterField,
    DataTableRequestBase,
} from "@suiteonix/components";
import {Page} from "@suiteonix/components";
import {Avatar, AvatarFallback, AvatarImage} from "@suiteonix/ui";
import {Badge} from "@suiteonix/ui";
import {Button} from "@suiteonix/ui";
import {ButtonGroup} from "@suiteonix/ui";
import {QuickToolTip} from "@suiteonix/ui";
import OrgCell from "#/modules/organization/components/OrgCell.tsx";
import type {AppModel} from "@suiteonix/server";
import {AppRequest} from "@suiteonix/server";
import {AppQuickViewPopover} from "#/modules/app/components/AppQuickViewPopover.tsx";
import {getAppDisplayName, getInitials} from "#/modules/app/app.utils.tsx";
import type {FileRoutesByTo} from "#/routeTree.gen.ts";

type AppsTableRequest = DataTableRequestBase & {
    name?: string
}

const APP_FILTER_FIELDS: Array<DataTableFilterField<AppsTableRequest>> = [
    {
        key: "name",
        label: "Name",
        type: "text",
        placeholder: "Filter by name",
    },
]

const APPS_INITIAL_REQUEST = {
    page: 0,
    size: 10,
    sort: [{field: "audit.createdDate", direction: "DESC"}],
} as Partial<AppsTableRequest>

async function copyAppId(appId: AppModel.AppID) {
    await navigator.clipboard.writeText(appId)
    toast.success("App ID copied.")
}

function useAppsTableQuery(request: AppsTableRequest) {
    const query: AppModel.Query = {
        query: request.query,
        page: request.page,
        size: request.size,
        sort: request.sort,
        name: request.name,
    }

    return AppRequest.useQueryApps(query)
}

function createAppColumns(): Array<ColumnDef<AppModel.App>> {
    return [
        {
            accessorKey: "name",
            header: "App",
            cell: ({row}) => (
                <AppQuickViewPopover app={row.original}>
                    <button className="flex items-center gap-3 text-left">
                        <Avatar className="rounded-lg">
                            <AvatarImage src={row.original.avatar || undefined} className="object-cover"/>
                            <AvatarFallback className="rounded-lg">{getInitials(row.original.name)}</AvatarFallback>
                        </Avatar>
                        <span className="space-y-1">
                            <span className="block font-medium">{getAppDisplayName(row.original)}</span>
                            <span className="block max-w-64 truncate text-sm text-muted-foreground">
                                {row.original.about || row.original.id}
                            </span>
                        </span>
                    </button>
                </AppQuickViewPopover>
            ),
            meta: {
                sortField: "name",
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => row.original.description || "No description",
        },
        {
            accessorKey: "webhook",
            header: "Webhook",
            cell: ({row}) => row.original.webhook?.value ? (
                <div className="space-y-1">
                    <Badge variant={row.original.webhook.isUp ? "success" : "secondary"}>
                        {row.original.webhook.isUp ? "Up" : "Configured"}
                    </Badge>
                    <div className="max-w-56 truncate text-xs text-muted-foreground">
                        {row.original.webhook.value}
                    </div>
                </div>
            ) : (
                <Badge variant="outline">Not configured</Badge>
            ),
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({row}) => <Badge variant="outline">{row.original.tags?.length ?? 0} tags</Badge>,
        },
        {
            accessorKey: "entityID",
            header: "Entity",
            cell: ({row}) => <OrgCell.CellWithPopover id={row.original.entityID}/>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => (
                <ButtonGroup>
                    <QuickToolTip asChild content="Copy app ID">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                void copyAppId(row.original.id)
                            }}
                        >
                            <Copy className="size-4"/>
                        </Button>
                    </QuickToolTip>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/apps/$appId" params={{appId: row.original.id}}>
                            View
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </ButtonGroup>
            ),
        },
    ]
}

export function AppsPage({
    routePath = "/admin/apps",
    title = "Apps",
    description = "Create, query, and inspect app integrations for this workspace.",
    initialRequest = APPS_INITIAL_REQUEST,
    headerContent,
}: {
    routePath?: keyof FileRoutesByTo
    title?: string
    description?: string
    initialRequest?: Partial<AppsTableRequest>
    headerContent?: React.ReactNode
}) {
    const columns = useMemo(() => createAppColumns(), [])

    return (
        <Page
            header={{
                title,
                description,
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/apps/dashboard">Dashboard</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/admin/apps/create">
                                Create app
                                <PlusCircle className="size-4"/>
                            </Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <div className="space-y-4">
                {headerContent}

                <DataTable<AppModel.App, unknown, AppsTableRequest>
                    columns={columns}
                    from={routePath}
                    useQuery={useAppsTableQuery}
                    initialRequest={initialRequest}
                    filterFields={APP_FILTER_FIELDS}
                    searchPlaceholder="Search apps..."
                    emptyMessage="No apps found."
                />
            </div>
        </Page>
    )
}
