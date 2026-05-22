import {type ReactNode, useMemo, useState} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Copy, PlusCircle} from "lucide-react";
import {toast} from "sonner";

import DataTable from "#/components/data-table/data-table.tsx";
import Page from "#/components/Page.tsx";
import {Badge} from "#/components/ui/badge.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card.tsx";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
import type {
    DataTableFilterField,
    DataTableRequestBase,
} from "#/components/data-table/types.ts";
import {NixModule} from "#/models/Models.ts";
import {ObjectVisibility} from "#/models/PagedModel.ts";
import {TagCreateSheet} from "#/modules/tags/TagCreateSheet.tsx";
import {TagModel} from "@suiteonix/server";
import OrgCell from "#/modules/organization/components/OrgCell.tsx";
import {TagRequest} from "@suiteonix/server";

type TagTableQuery = DataTableRequestBase & {
    type?: TagModel.TagType
    module?: NixModule
    show?: ObjectVisibility
}

const tagFilterFields: Array<DataTableFilterField<TagTableQuery>> = [
    {
        key: "module",
        label: "Module",
        type: "select",
        options: Object.values(NixModule).map((module) => ({label: module, value: module})),
    },
    {
        key: "type",
        label: "Type",
        type: "select",
        options: Object.values(TagModel.TagType).map((type) => ({label: type, value: type})),
    },
    {
        key: "show",
        label: "Visibility",
        type: "select",
        options: Object.values(ObjectVisibility).map((show) => ({label: show, value: show})),
    },
] as const

async function copyTagId(tagId: TagModel.TagID) {
    await navigator.clipboard.writeText(tagId)
    toast.success("Tag ID copied.")
}

function createTagColumns(): Array<ColumnDef<TagModel.Tag>> {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => row.original.name || "Untitled",
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
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => (
                <Badge variant="secondary">
                    {row.original.type || "UNKNOWN"}
                </Badge>
            ),
        },
        {
            accessorKey: "module",
            header: "Module",
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.original.module || "ALL"}
                </Badge>
            ),
        },
        {
            accessorKey: "colorHex",
            header: "Color",
            cell: ({row}) => {
                const color = row.original.colorHex
                return color ? (
                    <QuickToolTip asChild content={color}>
                        <div className="flex items-center gap-2">
                        <span
                            className="inline-flex size-3 border"
                            style={{backgroundColor: color}}
                        />
                            {/*<span className="font-mono text-xs">{color}</span>*/}
                        </div>
                    </QuickToolTip>
                ) : "Not set"
            },
        },
        {
            accessorKey: "entityID",
            header: "Entity",
            cell: ({row}) => {
                return <OrgCell.CellWithPopover id={row.original.entityID}/>
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => (
                <ButtonGroup>
                    <QuickToolTip asChild content="Copy tag ID">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                void copyTagId(row.original.id)
                            }}
                        >
                            <Copy className="size-4"/>
                        </Button>
                    </QuickToolTip>
                </ButtonGroup>
            ),
        },
    ]
}

export function TagsTablePage({
                                  routePath,
                                  title,
                                  description,
                                  initialRequest,
                                  headerContent,
                              }: {
    routePath: "/admin/tags" | "/admin/tags/dashboard"
    title: string
    description: string
    initialRequest: Partial<TagTableQuery>
    headerContent?: ReactNode
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const columns = useMemo(() => createTagColumns(), [])

    return (
        <>
            <Page
                header={{
                    title,
                    description,
                    actionView: (
                        <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>
                            <PlusCircle className="size-4"/>
                            New tag
                        </Button>
                    ),
                }}
            >
                <div className="space-y-4">
                    {headerContent}

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable<TagModel.Tag, unknown, TagTableQuery>
                                columns={columns}
                                from={routePath}
                                useQuery={(request) => TagRequest.useQueryTags(request)}
                                initialRequest={initialRequest}
                                filterFields={tagFilterFields}
                                searchPlaceholder="Search tags..."
                                emptyMessage="No tags found."
                            />
                        </CardContent>
                    </Card>
                </div>
            </Page>

            <TagCreateSheet
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />
        </>
    )
}
