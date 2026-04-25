import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Checkbox} from "#/components/ui/checkbox.tsx"
import {TagQuickViewPopover} from "#/modules/tags/components/TagQuickViewPopover.tsx"
import type {TagModel} from "#/modules/tags/model.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"
import {EyeIcon} from "lucide-react";

export function PropertyListingProfileTagsCard({
    selectedTagIds,
    tags,
    toggleTag,
    unresolvedTagIds,
}: {
    selectedTagIds: PropertyModel.TagID[]
    tags: TagModel.Tag[]
    toggleTag: (tagId: PropertyModel.TagID, checked: boolean) => void
    unresolvedTagIds: PropertyModel.TagID[]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Select which current property tags should be copied into the listing profile.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {tags.map((tag) => (
                    <div key={tag.id} className="rounded-lg border p-3 text-sm">
                        <div className="flex items-start justify-between gap-3">
                            <label className="flex min-w-0 flex-1 items-start gap-3">
                                <Checkbox
                                    checked={selectedTagIds.includes(tag.id)}
                                    onCheckedChange={(checked) => toggleTag(tag.id, checked === true)}
                                />
                                <span className="min-w-0">
                                    <span className="block font-medium">{tag.name || tag.id}</span>
                                    <span className="block text-muted-foreground">{tag.id}</span>
                                </span>
                            </label>

                            <TagQuickViewPopover tag={tag}>
                                <Button variant="outline" size="xs">
                                    <EyeIcon/>
                                </Button>
                            </TagQuickViewPopover>
                        </div>
                    </div>
                ))}

                {unresolvedTagIds.map((tagId) => (
                    <label key={tagId} className="flex items-start gap-3 rounded-lg border border-dashed p-3 text-sm">
                        <Checkbox
                            checked={selectedTagIds.includes(tagId)}
                            onCheckedChange={(checked) => toggleTag(tagId, checked === true)}
                        />
                        <span className="min-w-0">
                            <span className="block font-medium">{tagId}</span>
                            <span className="block text-muted-foreground">Tag details unavailable</span>
                        </span>
                    </label>
                ))}

                {tags.length === 0 && unresolvedTagIds.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        This property has no assigned tags.
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}

