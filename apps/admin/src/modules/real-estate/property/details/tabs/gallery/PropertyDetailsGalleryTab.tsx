import {useEffect, useMemo, useState} from "react";
import {ImageIcon, Upload} from "lucide-react";

import {Button} from "#/components/ui/button.tsx";
import {Spinner} from "#/components/ui/spinner.tsx";
import {FilesStorageRequest} from "#/modules/files-storage/request.hook.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {EmptyState} from "../../PropertyDetailsPrimitives.tsx";
import {GalleryItemsContent} from "./GalleryItemsContent.tsx";
import {GalleryOverview} from "./GalleryOverview.tsx";
import {GalleryUploadForm} from "./GalleryUploadForm.tsx";
import {buildPageItems, PAGE_SIZE} from "./gallery.utils.ts";
import {useGalleryUpload} from "./useGalleryUpload.ts";
import {Card, CardContent} from "#/components/ui/card.tsx";

export function PropertyDetailsGalleryTab({
    property,
    createOpen = false,
    onCreateOpenChange = () => undefined,
}: {
    property?: PropertyModel.Detailed
    createOpen?: boolean
    onCreateOpenChange?: (open: boolean) => void
}) {
    const [page, setPage] = useState(0);

    const storageId = property?.storageID ?? null;
    const galleryQuery = FilesStorageRequest.useGetFilesStorage(storageId ?? undefined);
    const galleryItemsQuery = FilesStorageRequest.useQueryStorageFiles(storageId ?? undefined, {
        page,
        size: PAGE_SIZE,
        sort: [{field: "audit.createdDate", direction: "DESC"}],
    });
    const upload = useGalleryUpload(storageId, () => {
        setPage(0);
        onCreateOpenChange(false);
    });

    useEffect(() => {
        setPage(0);
    }, [storageId]);

    useEffect(() => {
        const totalPages = galleryItemsQuery.data?.totalPages ?? 0;
        if (totalPages > 0 && page > totalPages - 1) {
            setPage(totalPages - 1);
        }
    }, [galleryItemsQuery.data?.totalPages, page]);

    const pageItems = useMemo(
        () => buildPageItems(page, galleryItemsQuery.data?.totalPages ?? 0),
        [galleryItemsQuery.data?.totalPages, page],
    );

    if (!property?.id) {
        return (
            <EmptyState
                title="Gallery unavailable"
                description="Property details are still loading."
            />
        );
    }

    if (!storageId) {
        return (
            <EmptyState
                title="No gallery configured"
                description="This property does not have a files storage yet, so there are no gallery details or items to display."
            />
        );
    }

    if (galleryQuery.isError || galleryItemsQuery.isError) {
        return (
            <section className="rounded-lg border p-6">
                <div className="space-y-2">
                    <h2 className="font-semibold">Gallery</h2>
                    <p className="text-sm text-muted-foreground">
                        Unable to load gallery data for this property.
                    </p>
                    <p className="text-sm text-destructive">
                        {galleryQuery.error?.message || galleryItemsQuery.error?.message || "Unknown error"}
                    </p>
                </div>
            </section>
        );
    }

    const gallery = galleryQuery.data;
    const items = galleryItemsQuery.data?.content ?? [];
    const totalElements = galleryItemsQuery.data?.totalElements ?? 0;
    const totalPages = galleryItemsQuery.data?.totalPages ?? 0;
    const currentPage = galleryItemsQuery.data?.number ?? page;
    const isLoading = galleryQuery.isLoading || galleryItemsQuery.isLoading;
    const isRefreshing = galleryQuery.isFetching || galleryItemsQuery.isFetching;

    return (
        <div className="space-y-6">
            <GalleryOverview
                currentPage={currentPage}
                gallery={gallery}
                storageId={storageId}
                totalElements={totalElements}
                totalPages={totalPages}
            />

            <section className="rounded-lg border p-6 flex flex-col gap-4">
                <Card>
                   <CardContent className={"flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"}>
                       <div>
                           <h3 className="font-semibold">Gallery items</h3>
                           <p className="text-sm text-muted-foreground">
                               Files attached to this property gallery, newest first.
                           </p>
                       </div>
                       <div className="flex flex-col justify-end gap-4">
                           <div className="flex items-center gap-2 text-sm text-muted-foreground self-end">
                               {isRefreshing ? (
                                   <>
                                       <Spinner className="size-4"/>
                                       Refreshing
                                   </>
                               ) : (
                                   <>
                                       <ImageIcon className="size-4"/>
                                       {totalElements} item{totalElements === 1 ? "" : "s"}
                                   </>
                               )}
                           </div>
                           <Button
                               type="button"
                               variant="outline"
                               onClick={() => onCreateOpenChange(true)}
                           >
                               <Upload className="size-4"/>
                               Upload file
                           </Button>
                       </div>
                   </CardContent>
                </Card>


                <GalleryUploadForm
                    {...upload}
                    open={createOpen}
                    onOpenChange={onCreateOpenChange}
                />

                <GalleryItemsContent
                    currentPage={currentPage}
                    isLoading={isLoading}
                    items={items}
                    pageItems={pageItems}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </section>
        </div>
    );
}
