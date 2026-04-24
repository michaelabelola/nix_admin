import {useMemo, useState} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {PlusCircle} from "lucide-react";

import DataTable from "#/components/data-table/data-table.tsx";
import type {DataTableFilterField, DataTableRequestBase} from "#/components/data-table/types.ts";
import Page from "#/components/Page.tsx";
import {Badge} from "#/components/ui/badge.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {ObjectVisibility} from "#/models/PagedModel.ts";

import {FeatureRuleCreateSheet} from "./FeatureRuleCreateSheet.tsx";
import {PropertyFeatureRuleModel} from "./model.ts";
import {PropertyFeatureRuleRequest} from "./request.hook.ts";

type FeatureRuleTableQuery = DataTableRequestBase & {
    format?: PropertyFeatureRuleModel.FieldFormat
    allowedPropType?: PropertyFeatureRuleModel.AllowedPropType
    show?: ObjectVisibility
}

const featureRuleFilterFields: Array<DataTableFilterField<FeatureRuleTableQuery>> = [
    {
        key: "format",
        label: "Format",
        type: "select",
        options: Object.values(PropertyFeatureRuleModel.FieldFormat).map((format) => ({
            label: format,
            value: format,
        })),
    },
    {
        key: "allowedPropType",
        label: "Property Type",
        type: "select",
        options: Object.values(PropertyFeatureRuleModel.AllowedPropType).map((type) => ({
            label: type,
            value: type,
        })),
    },
    {
        key: "show",
        label: "Visibility",
        type: "select",
        options: Object.values(ObjectVisibility).map((show) => ({
            label: show,
            value: show,
        })),
    },
] as const

function useFeatureRuleTableQuery(request: FeatureRuleTableQuery) {
    return PropertyFeatureRuleRequest.useQueryFeatureRules(request)
}

function createFeatureRuleColumns(): Array<ColumnDef<PropertyFeatureRuleModel.PropertyFeatureRule>> {
    return [
        {
            accessorKey: "name",
            header: "Rule",
            cell: ({row}) => (
                <div className="space-y-1">
                    <div className="font-medium">{row.original.name || "Unnamed rule"}</div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.description || "No description"}
                    </div>
                </div>
            ),
            meta: {
                sortField: "name",
            },
        },
        {
            accessorKey: "format",
            header: "Format",
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.original.format || "UNSET"}
                </Badge>
            ),
            meta: {
                sortField: "format",
            },
        },
        {
            accessorKey: "allowedPropType",
            header: "Allowed",
            cell: ({row}) => (
                <Badge variant="secondary">
                    {row.original.allowedPropType || "UNSET"}
                </Badge>
            ),
            meta: {
                sortField: "allowedPropType",
            },
        },
        {
            accessorKey: "isAddon",
            header: "Addon",
            cell: ({row}) => row.original.isAddon ? "Yes" : "No",
        },
        {
            id: "values",
            header: "Values",
            cell: ({row}) => String(row.original.values.length),
        },
        {
            id: "tags",
            header: "Tags",
            cell: ({row}) => String(row.original.tags.length),
        },
    ]
}

export function FeatureRulesPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const columns = useMemo(() => createFeatureRuleColumns(), [])

    return (
        <>
            <Page
                header={{
                    title: "Feature Rules",
                    description: "Manage the reusable rule definitions available to real-estate features.",
                    actionView: (
                        <ButtonGroup>
                            <Button onClick={() => setIsCreateOpen(true)}>
                                <PlusCircle className="size-4"/>
                                New feature rule
                            </Button>
                        </ButtonGroup>
                    ),
                }}
            >
                <DataTable<PropertyFeatureRuleModel.PropertyFeatureRule, unknown, FeatureRuleTableQuery>
                    columns={columns}
                    from="/admin/real-estate/feature-rules"
                    useQuery={useFeatureRuleTableQuery}
                    initialRequest={{
                        page: 0,
                        size: 10,
                        show: ObjectVisibility.ENTITY_AND_SYSTEM,
                    }}
                    filterFields={featureRuleFilterFields}
                    searchPlaceholder="Search feature rules..."
                    emptyMessage="No feature rules found."
                />
            </Page>

            <FeatureRuleCreateSheet
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />
        </>
    )
}
