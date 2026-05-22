import {Separator} from "#/components/ui/separator.tsx";
import type {PropertyModel} from "@suiteonix/server";
import {Card, CardContent, CardHeader} from "#/components/ui/card.tsx";

export function PropertyDetailsAboutTab({property}: { property?: PropertyModel.Detailed }) {
    return (
        <Card className="rounded-lg border p-6">
            <CardHeader>
                <div>
                    <h2 className="font-semibold">Description</h2>
                    <p className="text-sm text-muted-foreground">Long-form property information.</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="text-sm font-medium">About</div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {property?.about?.trim() || "No about content added."}
                    </p>
                </div>
                <Separator/>
                <div>
                    <div className="text-sm font-medium">Description</div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {property?.description?.trim() || "No description added."}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
