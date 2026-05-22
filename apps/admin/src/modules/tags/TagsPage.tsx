import {ObjectVisibility} from "#/models/PagedModel.ts";
import {TagsTablePage} from "#/modules/tags/tag-table.tsx";

export function TagsPage() {
    return (
        <TagsTablePage
            routePath="/admin/tags"
            title="Tags"
            description="Query, review, and copy tags available to this organization."
            initialRequest={{
                page: 0,
                size: 10,
                show: ObjectVisibility.ENTITY_AND_SYSTEM,
            }}
        />
    )
}
