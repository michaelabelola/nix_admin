import {Tabs, TabsContent, TabsList, TabsTrigger} from "#/components/ui/tabs.tsx"

import type {ListingModel} from "@suiteonix/server"
import {ListingDetailsRecordTab} from "./ListingDetailsRecordTab.tsx"
import {ListingListedItemsTab} from "./ListingListedItemsTab.tsx"

export function ListingDetailsTabs({listing}: { listing: ListingModel.Detailed }) {
    return (
        <Tabs defaultValue="items" className="gap-6">
            <TabsList variant="line" className="h-auto w-full flex-wrap justify-start rounded-none p-0">
                <TabsTrigger value="items" className="flex-none px-1.5 py-2">
                    Listed Items
                </TabsTrigger>
                <TabsTrigger value="details" className="flex-none px-1.5 py-2">
                    Details
                </TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-6">
                <ListingListedItemsTab listingId={listing.id}/>
            </TabsContent>
            <TabsContent value="details" className="mt-6">
                <ListingDetailsRecordTab listing={listing}/>
            </TabsContent>
        </Tabs>
    )
}
