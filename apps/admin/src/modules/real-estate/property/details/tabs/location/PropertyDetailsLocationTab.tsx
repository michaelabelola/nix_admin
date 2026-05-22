import type {PropertyModel} from "@suiteonix/server";

import {EmptyState, KeyValue} from "../../PropertyDetailsPrimitives.tsx";
import {getGoogleMapsEmbedUrl} from "../../property-details.utils.ts";
import {countriesApi} from "@suiteonix/server";
import {useEffect, useState} from "react";
import {statesApi} from "@suiteonix/server";
import {Card, CardContent} from "#/components/ui/card.tsx";

export function PropertyDetailsLocationTab({property}: { property?: PropertyModel.Detailed }) {
    const location = property?.location
    const [country, setCountry] = useState<LocationModel.Country>(undefined as any)
    const [state, setState] = useState<LocationModel.State>(undefined as any)

    useEffect(() => {
        if (location?.country) countriesApi.getCountryById(location?.country).then(setCountry)
    }, [location?.country])
    useEffect(() => {
        if (location?.state) statesApi.getStateByCountryIdAndStateId({
            countryIso2: location.country as any,
            stateIso2: location?.state as any
        }).then(setState)
    }, [location?.state]);
    const mapEmbedUrl = getGoogleMapsEmbedUrl(location)

    return (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card className="overflow-hidden">
                <CardContent>
                    <div className="mb-4">
                        <h2 className="font-semibold">Map</h2>
                        <p className="text-sm text-muted-foreground">Embedded Google Map for the assigned property
                            location.</p>
                    </div>
                    {mapEmbedUrl ? (
                        <iframe
                            title="Property location map"
                            src={mapEmbedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="h-105 w-full rounded-lg border gMapIframe"
                        />
                    ) : (
                        <EmptyState
                            title="No map available"
                            description="Add a location with coordinates or an address to display the map."
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="">
                <CardContent>

                    <div className="mb-4">
                        <h2 className="font-semibold">Address</h2>
                        <p className="text-sm text-muted-foreground">Stored location fields for this property.</p>
                    </div>
                    <div className="space-y-3">
                        {location?.label && <KeyValue label="Label" value={location?.label}/>}
                        <KeyValue label="Address line 1" value={location?.line1}/>
                        {location?.line2 && <KeyValue label="Address line 2" value={location?.line2}/>}
                        <KeyValue label="City" value={location?.city}/>
                        <KeyValue label="State" value={state ? state.name : location?.state}/>
                        <KeyValue label="Postal code" value={location?.postalCode}/>
                        <KeyValue label="Country"
                                  value={!country ? location?.country : `${country.emoji} ${country?.name}`}/>
                        {location?.building && <KeyValue label="Building" value={location?.building}/>}
                        {location?.unit && <KeyValue label="Unit" value={location?.unit}/>}
                        {location?.apartment && <KeyValue label="Apartment" value={location?.apartment}/>}
                        {location?.floor && <KeyValue label="Floor" value={String(location.floor)}/>}
                        {location?.latitude && location?.longitude && <KeyValue
                            label="Coordinates"
                            value={`${location.latitude}, ${location.longitude}`}
                        />}
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}
