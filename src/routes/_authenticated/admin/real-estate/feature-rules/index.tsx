import {createFileRoute} from "@tanstack/react-router";

import {FeatureRulesPage} from "#/modules/real-estate/property-feature-rule/FeatureRulesPage.tsx";

export const Route = createFileRoute(
    "/_authenticated/admin/real-estate/feature-rules/",
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <FeatureRulesPage/>
}
