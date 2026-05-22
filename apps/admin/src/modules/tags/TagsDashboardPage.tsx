import {useMemo} from "react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui";
import {ObjectVisibility} from "@suiteonix/server/models";
import {TagModel} from "@suiteonix/server";
import {TagRequest} from "@suiteonix/server";
import {TagsTablePage} from "#/modules/tags/tag-table.tsx";

function MetricCard({
    label,
    value,
    description,
}: {
    label: string
    value: string
    description: string
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl">{value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                {description}
            </CardContent>
        </Card>
    )
}

export function TagsDashboardPage() {
    const allTags = TagRequest.useQueryTags({
        page: 0,
        size: 1,
        show: ObjectVisibility.ENTITY_AND_SYSTEM,
    })
    const customTags = TagRequest.useQueryTags({
        page: 0,
        size: 1,
        type: TagModel.TagType.CUSTOM,
        show: ObjectVisibility.ENTITY_AND_SYSTEM,
    })

    const headerContent = useMemo(() => (
        <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
                label="Visible Tags"
                value={String(allTags.data?.totalElements ?? 0)}
                description="All system and organization tags available from the current workspace."
            />
            <MetricCard
                label="Custom Tags"
                value={String(customTags.data?.totalElements ?? 0)}
                description="Tags of type CUSTOM returned by the backend query endpoint."
            />
        </div>
    ), [allTags.data?.totalElements, customTags.data?.totalElements])

    return (
        <TagsTablePage
            routePath="/admin/tags/dashboard"
            title="Tags Dashboard"
            description="Monitor available tags and create new ones from the admin workspace."
            initialRequest={{
                page: 0,
                size: 5,
                show: ObjectVisibility.ENTITY_AND_SYSTEM,
            }}
            headerContent={headerContent}
        />
    )
}
