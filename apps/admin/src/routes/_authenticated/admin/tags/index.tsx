import {createFileRoute} from "@tanstack/react-router";

import {TagsPage} from "#/modules/tags/TagsPage.tsx";

export const Route = createFileRoute("/_authenticated/admin/tags/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <TagsPage/>
}
