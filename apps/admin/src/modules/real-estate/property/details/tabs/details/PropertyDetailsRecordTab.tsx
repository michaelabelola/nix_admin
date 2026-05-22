import type {PropertyModel} from "@suiteonix/server";

import {KeyValue} from "../../PropertyDetailsPrimitives.tsx";
import {OrganizationRequest as organizationRequest} from "@suiteonix/server";
import {Spinner} from "@suiteonix/ui";
import {Card, CardHeader} from "@suiteonix/ui";
import {TagsView} from "#/modules/tags/components/TagsView.tsx";

export function PropertyDetailsRecordTab({property}: { property?: PropertyModel.Detailed }) {
    const {data, isLoading} = organizationRequest.useGetOrganizationByID(property?.entityID)
    return (
        <Card className="border p-6">
            <CardHeader className="mb-4">
                <h2 className="font-semibold">Property details</h2>
                <p className="text-sm text-muted-foreground">Core fields saved on the property.</p>
            </CardHeader>
            <div className="grid gap-3 md:grid-cols-2">
                <KeyValue label="Property ID" value={property?.id}/>
                <KeyValue label="Type" value={property?.type}/>
                <KeyValue label="Lifecycle stage" value={property?.lifecycleStage}/>
                <KeyValue label="Storage ID" value={property?.storageID != null ? String(property.storageID) : null}/>
                <KeyValue label="Org" value={
                    isLoading ? <Spinner className={"size-4"}/> :
                        (data?.shortName || data?.name || property?.entityID)}/>
                <KeyValue label="Tags" value={property?.tags.length ? <TagsView tagIds={property.tags}/> : null}/>
            </div>
        </Card>
    )
}
