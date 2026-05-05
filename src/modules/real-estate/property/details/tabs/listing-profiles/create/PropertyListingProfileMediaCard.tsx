import {ImageIcon} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Checkbox} from "#/components/ui/checkbox.tsx"
import {Label} from "#/components/ui/label.tsx"
import {RadioGroup, RadioGroupItem} from "#/components/ui/radio-group.tsx"
import {Spinner} from "#/components/ui/spinner.tsx"
import type {FilesStorageModel} from "#/modules/files-storage/model.ts"
import type {PropertyModel} from "#/modules/real-estate/property/model.ts"

function MediaPreview({item}: { item: FilesStorageModel.FileItem }) {
    const src = item.thumbnail || item.file

    if (!src) {
        return (
            <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-muted text-muted-foreground">
                <ImageIcon className="size-8"/>
            </div>
        )
    }

    return (
        <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
            <img
                src={src}
                alt={item.name?.trim() || "Listing profile media"}
                className="size-full object-cover"
                loading="lazy"
            />
        </div>
    )
}

export function PropertyListingProfileMediaCard({
    avatarId,
    galleryIds,
    isError,
    isLoading,
    items,
    property,
    onAvatarChange,
    onGalleryItemChange,
}: {
    avatarId: PropertyModel.FileID | null
    galleryIds: PropertyModel.FileID[]
    isError: boolean
    isLoading: boolean
    items: FilesStorageModel.FileItem[]
    property?: PropertyModel.Detailed
    onAvatarChange: (fileId: PropertyModel.FileID | null) => void
    onGalleryItemChange: (fileId: PropertyModel.FileID, checked: boolean) => void
}) {
    const hasStorage = property?.storageID != null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>
                    Select gallery files from this property's storage and choose the primary file for the listing avatar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!hasStorage ? (
                    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                        This property does not have a file storage yet.
                    </div>
                ) : isLoading ? (
                    <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        <Spinner className="mr-2 size-4"/>
                        Loading property files
                    </div>
                ) : isError ? (
                    <div className="rounded-lg border border-destructive/40 p-6 text-sm text-destructive">
                        Unable to load files from this property's storage.
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                        No files have been uploaded to this property's storage.
                    </div>
                ) : (
                    <RadioGroup value={avatarId ?? ""} onValueChange={(value) => onAvatarChange(value || null)}>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            {items.map((item) => {
                                const selectedForGallery = galleryIds.includes(item.id)
                                const selectedForAvatar = avatarId === item.id

                                return (
                                    <div key={item.id} className="rounded-lg border p-3">
                                        <MediaPreview item={item}/>
                                        <div className="mt-3 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium">
                                                        {item.name?.trim() || item.id}
                                                    </div>
                                                    <div className="truncate text-xs text-muted-foreground">
                                                        {item.id}
                                                    </div>
                                                </div>
                                                {selectedForAvatar ? <Badge>Avatar</Badge> : null}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label className="justify-between rounded-md border px-3 py-2">
                                                    <span>Include in gallery</span>
                                                    <Checkbox
                                                        checked={selectedForGallery}
                                                        onCheckedChange={(checked) => onGalleryItemChange(item.id, checked === true)}
                                                    />
                                                </Label>
                                                <Label className="justify-between rounded-md border px-3 py-2">
                                                    <span>Use as avatar</span>
                                                    <RadioGroupItem value={item.id}/>
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </RadioGroup>
                )}
            </CardContent>
        </Card>
    )
}
