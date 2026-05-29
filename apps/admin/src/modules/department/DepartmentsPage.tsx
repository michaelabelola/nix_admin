import {useMemo} from "react"
import type {ColumnDef} from "@tanstack/react-table"
import {Link} from "@tanstack/react-router"
import {ArrowRight, Copy, PlusCircle, Trash2, Users} from "lucide-react"
import {toast} from "sonner"

import {DataTable} from "@suiteonix/components"
import type {DataTableFilterField, DataTableRequestBase} from "@suiteonix/components"
import {Page} from "@suiteonix/components"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@suiteonix/ui"
import {Avatar, AvatarFallback, AvatarImage} from "@suiteonix/ui"
import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {Card, CardContent, CardHeader, CardTitle} from "@suiteonix/ui"
import {QuickToolTip} from "@suiteonix/ui"
import {DepartmentModel, DepartmentRequest} from "@suiteonix/server"
import OrgCell from "#/modules/organization/components/OrgCell.tsx"

type DepartmentTableRequest = DataTableRequestBase & {
    code?: string
    parentDepartmentId?: string
    rootOnly?: boolean
    costCenter?: string
    type?: DepartmentModel.DepartmentType
    status?: DepartmentModel.DepartmentStatus
}

const DEPARTMENT_FILTER_FIELDS: Array<DataTableFilterField<DepartmentTableRequest>> = [
    {
        key: "status",
        label: "Status",
        type: "select",
        options: Object.values(DepartmentModel.DepartmentStatus).map((status) => ({label: status, value: status})),
    },
    {
        key: "type",
        label: "Type",
        type: "select",
        options: Object.values(DepartmentModel.DepartmentType).map((type) => ({label: type, value: type})),
    },
    {
        key: "rootOnly",
        label: "Hierarchy",
        type: "select",
        options: [{label: "Root departments", value: "true"}],
        parseValue: (value) => (value === "true" ? true : undefined),
        serializeValue: (value) => (value ? "true" : ""),
    },
    {
        key: "code",
        label: "Code",
        type: "text",
        placeholder: "Code",
    },
    {
        key: "costCenter",
        label: "Cost Center",
        type: "text",
        placeholder: "Cost center",
    },
] as const

async function copyDepartmentId(departmentId: DepartmentModel.DepartmentID) {
    await navigator.clipboard.writeText(departmentId)
    toast.success("Department ID copied.")
}

function statusVariant(status?: DepartmentModel.DepartmentStatus | null) {
    if (status === DepartmentModel.DepartmentStatus.ACTIVE) return "success"
    if (status === DepartmentModel.DepartmentStatus.ARCHIVED) return "secondary"
    return "outline"
}

function createDepartmentColumns(): Array<ColumnDef<DepartmentModel.Department>> {
    return [
        {
            accessorKey: "name",
            header: "Department",
            cell: ({row}) => (
                <div className="flex min-w-64 items-center gap-3">
                    <Avatar className="size-10 rounded-md">
                        <AvatarImage src={row.original.avatar || undefined} className="object-cover"/>
                        <AvatarFallback>{(row.original.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <div className="font-medium">{row.original.name || "Unnamed department"}</div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{row.original.code || "NO CODE"}</Badge>
                            <span>{row.original.description || "No description"}</span>
                        </div>
                    </div>
                </div>
            ),
            meta: {
                sortField: "name",
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.original.type || "OTHER"}
                </Badge>
            ),
            meta: {
                sortField: "type",
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => (
                <Badge variant={statusVariant(row.original.status)}>
                    {row.original.status || "ACTIVE"}
                </Badge>
            ),
            meta: {
                sortField: "status",
            },
        },
        {
            accessorKey: "parentDepartmentId",
            header: "Parent",
            cell: ({row}) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.parentDepartmentId || "Root"}
                </span>
            ),
        },
        {
            id: "contact",
            header: "Contact",
            cell: ({row}) => (
                <div className="space-y-1 text-sm">
                    <div>{row.original.email || "No email"}</div>
                    <div className="text-muted-foreground">{row.original.phone || "No phone"}</div>
                </div>
            ),
        },
        {
            id: "operations",
            header: "Operations",
            cell: ({row}) => (
                <div className="space-y-1 text-sm">
                    <div>{row.original.location || "No location"}</div>
                    <div className="text-muted-foreground">{row.original.costCenter || "No cost center"}</div>
                </div>
            ),
        },
        {
            accessorKey: "displayOrder",
            header: "Order",
            cell: ({row}) => row.original.displayOrder ?? 0,
            meta: {
                sortField: "displayOrder",
            },
        },
        {
            accessorKey: "entityID",
            header: "Entity",
            cell: ({row}) => <OrgCell.CellWithPopover id={row.original.entityID}/>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => <DepartmentActions department={row.original}/>,
        },
    ]
}

function DepartmentActions({
                               department,
                           }: {
    department: DepartmentModel.Department
}) {
    const deleteDepartment = DepartmentRequest.useDeleteDepartment(() => {
        toast.success("Department deleted.")
    })

    return (
        <ButtonGroup>
            <QuickToolTip asChild content="Copy department ID">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        void copyDepartmentId(department.id)
                    }}
                >
                    <Copy className="size-4"/>
                </Button>
            </QuickToolTip>
            <QuickToolTip asChild content="Manage members">
                <Button variant="outline" size="icon" asChild>
                    <Link to="/admin/departments/$departmentId/members" params={{departmentId: department.id}}>
                        <Users className="size-4"/>
                    </Link>
                </Button>
            </QuickToolTip>
            <QuickToolTip asChild content="View department">
                <Button variant="outline" size="icon" asChild>
                    <Link to="/admin/departments/$departmentId/details" params={{departmentId: department.id}}>
                        <ArrowRight className="size-4"/>
                    </Link>
                </Button>
            </QuickToolTip>
            <AlertDialog>
                <QuickToolTip asChild content="Delete department">
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" disabled={deleteDepartment.isPending}>
                            <Trash2 className="size-4"/>
                        </Button>
                    </AlertDialogTrigger>
                </QuickToolTip>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete department?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This deletes {department.name || "this department"} from the organization.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteDepartment.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleteDepartment.isPending}
                            onClick={() => void deleteDepartment.mutateAsync(department.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ButtonGroup>
    )
}

function useDepartmentTableQuery(request: DepartmentTableRequest) {
    return DepartmentRequest.useQueryDepartments(request)
}

export function DepartmentsPage() {
    const columns = useMemo(() => createDepartmentColumns(), [])

    return (
        <Page
            header={{
                title: "Departments",
                description: "Create, query, and maintain organization departments.",
                actionView: (
                    <Button asChild>
                        <Link to="/admin/departments/create">
                            <PlusCircle className="size-4"/>
                            New department
                        </Link>
                    </Button>
                ),
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Departments</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable<DepartmentModel.Department, unknown, DepartmentTableRequest>
                        columns={columns}
                        from="/admin/departments"
                        useQuery={useDepartmentTableQuery}
                        initialRequest={{
                            page: 0,
                            size: 10,
                            sort: [
                                {field: "displayOrder", direction: "ASC"}
                            ]
                        }}
                        filterFields={DEPARTMENT_FILTER_FIELDS}
                        searchPlaceholder="Search departments..."
                        emptyMessage="No departments found."
                    />
                </CardContent>
            </Card>
        </Page>
    )
}
