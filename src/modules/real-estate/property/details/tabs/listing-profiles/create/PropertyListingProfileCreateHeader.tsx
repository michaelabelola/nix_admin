import {ArrowLeft, PlusCircle} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {Card, CardHeader, CardDescription, CardTitle} from "#/components/ui/card.tsx"

export function PropertyListingProfileCreateHeader({
    disabled,
    isSubmitting,
    onBack,
    onCreate,
}: {
    disabled: boolean
    isSubmitting: boolean
    onBack: () => void
    onCreate: () => void
}) {
    return (
        <Card>
            <CardHeader className="gap-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <CardTitle>Create Listing Profile</CardTitle>
                        <CardDescription>
                            Build a listing-profile snapshot from the current property record. The profile name, description, and
                            about fields are copied from the property automatically.
                        </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={onBack}>
                            <ArrowLeft className="size-4"/>
                            Back
                        </Button>
                        <Button onClick={onCreate} disabled={disabled}>
                            <PlusCircle className="size-4"/>
                            {isSubmitting ? "Creating..." : "Create Listing Profile"}
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

