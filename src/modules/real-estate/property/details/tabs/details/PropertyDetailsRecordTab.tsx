import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {KeyValue} from "../../PropertyDetailsPrimitives.tsx";
import organizationRequest from "#/modules/organization/organization.request.ts";
import {Spinner} from "#/components/ui/spinner.tsx";

export function PropertyDetailsRecordTab({property}: { property?: PropertyModel.Detailed }) {
    const {data, isLoading} = organizationRequest.useGetOrganizationByID(property?.entityID)
    return (
        <section className="rounded-lg border p-6">
            <div className="mb-4">
                <h2 className="font-semibold">Property details</h2>
                <p className="text-sm text-muted-foreground">Core fields saved on the property.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                <KeyValue label="Property ID" value={property?.id}/>
                <KeyValue label="Type" value={property?.type}/>
                <KeyValue label="Lifecycle stage" value={property?.lifecycleStage}/>
                <KeyValue label="Storage ID" value={property?.storageID != null ? String(property.storageID) : null}/>
                <KeyValue label="Org" value={
                    isLoading ? <Spinner className={"size-4"}/> :
                        (data?.shortName || data?.name || property?.entityID)}/>
                <KeyValue label="Tags" value={property?.tags.length ? property.tags.join(", ") : null}/>
            </div>
        </section>
    )
}
