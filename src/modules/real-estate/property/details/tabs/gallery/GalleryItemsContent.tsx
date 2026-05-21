import {FileIcon} from "lucide-react";

import {Button} from "#/components/ui/button.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "#/components/ui/pagination.tsx";
import {Spinner} from "#/components/ui/spinner.tsx";
import {FilesStorageModel} from "#/modules/files-storage/model.ts";

import {EmptyState} from "../../PropertyDetailsPrimitives.tsx";

function FilePreview({item}: { item: FilesStorageModel.FileItem }) {
    const previewSrc = item.thumbnail || item.file;

    if (!previewSrc) {
        return (
            <div className="flex aspect-4/3 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileIcon className="size-10"/>
            </div>
        );
    }

    return (
        <div className="aspect-4/3 overflow-hidden rounded-lg bg-muted">
            <img
                src={previewSrc}
                alt={item.name?.trim() || "Gallery item preview"}
                className="size-full object-cover"
                loading="lazy"
            />
        </div>
    );
}

function GalleryItemCard({item}: { item: FilesStorageModel.FileItem }) {

    return (
        <Card className="gap-4">
            <CardHeader className="px-4">
                <FilePreview item={item}/>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">
                            {item.name?.trim() || item.id}
                        </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3 min-h-6">
                        {item.description?.trim() || "No description"}
                    </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                    {item.file ? (
                        <div className={"flex gap-4"}>
                            <Button asChild variant="outline" size="sm">
                                <a href={item.file} target="_blank" rel="noreferrer">
                                    Open file
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <a href={item.file} target="_blank" rel="noreferrer">
                                    Download file
                                </a>
                            </Button>
                        </div>
                    ) : null}
                    {item.thumbnail && item.thumbnail !== item.file ? (
                        <Button asChild variant="ghost" size="sm">
                            <a href={item.thumbnail} target="_blank" rel="noreferrer">
                                Open thumbnail
                            </a>
                        </Button>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

function GalleryPaginationControls({
                                       currentPage,
                                       pageItems,
                                       totalPages,
                                       onPageChange,
                                   }: {
    currentPage: number
    pageItems: Array<number | "ellipsis">
    totalPages: number
    onPageChange: (page: number) => void
}) {
    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        aria-disabled={currentPage === 0}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                        onClick={(event) => {
                            event.preventDefault();
                            if (currentPage === 0) return;
                            onPageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                {pageItems.map((item, index) => (
                    item === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis/>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <PaginationLink
                                href="#"
                                isActive={item === currentPage}
                                onClick={(event) => {
                                    event.preventDefault();
                                    onPageChange(item);
                                }}
                            >
                                {item + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        aria-disabled={currentPage >= totalPages - 1}
                        className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                        onClick={(event) => {
                            event.preventDefault();
                            if (currentPage >= totalPages - 1) return;
                            onPageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export function GalleryItemsContent({
                                        currentPage,
                                        isLoading,
                                        items,
                                        pageItems,
                                        totalPages,
                                        onPageChange,
                                    }: {
    currentPage: number
    isLoading: boolean
    items: FilesStorageModel.FileItem[]
    pageItems: Array<number | "ellipsis">
    totalPages: number
    onPageChange: (page: number) => void
}) {
    if (isLoading) {
        return (
            <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="size-4"/>
                    Loading gallery items
                </div>
            </div>
        );
    }

    if (!items.length) {
        return (
            <EmptyState
                title="No gallery items"
                description="This property gallery exists, but it does not contain any files yet."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {items.map((item) => (
                    <GalleryItemCard key={item.id} item={item}/>
                ))}
            </div>

            <GalleryPaginationControls
                currentPage={currentPage}
                pageItems={pageItems}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}
