import {useState, type FormEvent} from "react"
import {Link, useNavigate} from "@tanstack/react-router"
import {ArrowLeft, FileText} from "lucide-react"

import Page from "#/components/Page.tsx"
import {Button} from "@suiteonix/ui"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui"
import {Checkbox} from "@suiteonix/ui"
import {Input} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@suiteonix/ui"
import {Textarea} from "@suiteonix/ui"
import {NixModule} from "@suiteonix/server/models"

import {ListingModel} from "@suiteonix/server"
import {ListingRequest} from "@suiteonix/server"

function parseTags(value: string) {
    return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
}

export function ListingCreatePage() {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<ListingModel.ListingType | "">("")
    const [status, setStatus] = useState<ListingModel.ListingStatus | "">("")
    const [module, setModule] = useState<NixModule>(NixModule.LISTING)
    const [isPublic, setIsPublic] = useState(false)
    const [tagsText, setTagsText] = useState("")

    const {mutate: createListing, isPending} = ListingRequest.useCreateListing((listing) => {
        navigate({
            to: "/admin/listings/$listingId",
            params: {listingId: listing.id},
        })
    })

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!title.trim()) return

        createListing({
            title: title.trim(),
            description: description.trim() || null,
            type: type || null,
            status: status || null,
            module,
            isPublic,
            tags: parseTags(tagsText),
        })
    }

    return (
        <Page
            header={{
                title: "Create Listing",
                description: "Create a listing record from its own page.",
                actionView: (
                    <Button variant="outline" asChild>
                        <Link to="/admin/listings">
                            <ArrowLeft className="size-4"/>
                            Listings
                        </Link>
                    </Button>
                ),
            }}
            className={"flex justify-center"}
        >
            <div className="w-full lg:max-w-3xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="size-5 text-primary"/>
                            <CardTitle>Listing Details</CardTitle>
                        </div>
                        <CardDescription>Title is required. Status, type, module, visibility, and tags are optional.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="listing-title">Title</Label>
                                    <Input
                                        id="listing-title"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder="Downtown featured listing"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="listing-description">Description</Label>
                                    <Textarea
                                        id="listing-description"
                                        rows={4}
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="High-level summary for the listing."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={type} onValueChange={(value) => setType(value as ListingModel.ListingType)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(ListingModel.ListingType).map((listingType) => (
                                                <SelectItem key={listingType} value={listingType}>
                                                    {listingType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={status} onValueChange={(value) => setStatus(value as ListingModel.ListingStatus)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(ListingModel.ListingStatus).map((listingStatus) => (
                                                <SelectItem key={listingStatus} value={listingStatus}>
                                                    {listingStatus}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Module</Label>
                                    <Select value={module} onValueChange={(value) => setModule(value as NixModule)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select module"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(NixModule).map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="listing-tags">Tags</Label>
                                    <Input
                                        id="listing-tags"
                                        value={tagsText}
                                        onChange={(event) => setTagsText(event.target.value)}
                                        placeholder="featured, premium"
                                    />
                                </div>

                                <div className="flex items-center gap-2 md:col-span-2">
                                    <Checkbox
                                        id="listing-public"
                                        checked={isPublic}
                                        onCheckedChange={(checked) => setIsPublic(Boolean(checked))}
                                    />
                                    <Label htmlFor="listing-public">Public listing</Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link to="/admin/listings">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isPending || !title.trim()}>
                                    {isPending ? "Creating..." : "Create Listing"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Page>
    )
}
