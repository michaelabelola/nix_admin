import {useEffect, useMemo, useState} from "react";
import {
    FileIcon,
    Globe,
    ImageIcon,
    Lock,
} from "lucide-react";

import {Badge} from "#/components/ui/badge.tsx";
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
import {FilesStorageRequest} from "#/modules/files-storage/request.hook.ts";
import {FilesStorageModel} from "#/modules/files-storage/model.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";

import {EmptyState, KeyValue, SummaryMetric} from "../../PropertyDetailsPrimitives.tsx";

const PAGE_SIZE = 12;

function formatDateTime(value?: Date | string | null) {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getStatusVariant(status?: FilesStorageModel.ListableSourceStatus | null): "outline" | "secondary" | "success" | "warning" | "destructive" {
    switch (status) {
        case FilesStorageModel.ListableSourceStatus.LISTABLE:
            return "success";
        case FilesStorageModel.ListableSourceStatus.UNDER_CHECK:
            return "warning";
        case FilesStorageModel.ListableSourceStatus.DISABLED:
            return "destructive";
        case FilesStorageModel.ListableSourceStatus.NOT_LISTABLE:
        default:
            return "secondary";
    }
}

function buildPageItems(currentPage: number, totalPages: number) {
    if (totalPages <= 1) return [0];
    if (totalPages <= 7) return Array.from({length: totalPages}, (_, index) => index);

    const pages = new Set<number>([0, totalPages - 1, currentPage, currentPage - 1, currentPage + 1]);
    const sortedPages = Array.from(pages)
        .filter((page) => page >= 0 && page < totalPages)
        .sort((a, b) => a - b);

    const items: Array<number | "ellipsis"> = [];

    sortedPages.forEach((page, index) => {
        const previousPage = sortedPages[index - 1];
        if (previousPage != null && page - previousPage > 1) {
            items.push("ellipsis");
        }
        items.push(page);
    });

    return items;
}

function FilePreview({item}: { item: FilesStorageModel.FileItem }) {
    const previewSrc = item.thumbnail || item.file;

    if (!previewSrc) {
        return (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileIcon className="size-10"/>
            </div>
        );
    }

    return (
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <img
                src={previewSrc}
                alt={item.name?.trim() || "Gallery item preview"}
                className="size-full object-cover"
                loading="lazy"
            />
        </div>
    );
}

export function root({property}: { property?: PropertyModel.Detailed }) {
    const [page, setPage] = useState(0);

    const storageId = property?.storageID ?? null;
    const galleryQuery = FilesStorageRequest.useGetFilesStorage(storageId ?? undefined);
    const galleryItemsQuery = FilesStorageRequest.useQueryStorageFiles(storageId ?? undefined, {
        page,
        size: PAGE_SIZE,
        sort: [{field: "audit.createdDate", direction: "DESC"}],
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
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(22rem,1fr)]">
                <Card className="overflow-hidden py-0">
                    <div className="relative aspect-[16/6] bg-muted">
                        {gallery?.coverImage ? (
                            <img
                                src={gallery.coverImage}
                                alt={gallery.name?.trim() || "Gallery cover"}
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                                <ImageIcon className="size-12"/>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent"/>
                        <div className="absolute inset-x-0 bottom-0 p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">Storage ID: {String(storageId)}</Badge>
                                <Badge variant={gallery?.isPublic ? "success" : "secondary"}>
                                    {gallery?.isPublic ? (
                                        <>
                                            <Globe className="size-3"/>
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="size-3"/>
                                            Private
                                        </>
                                    )}
                                </Badge>
                                {gallery?.module ? <Badge variant="outline">{gallery.module}</Badge> : null}
                            </div>
                            <div className="mt-3">
                                <h2 className="text-xl font-semibold">{gallery?.name?.trim() || "Property gallery"}</h2>
                                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                                    {gallery?.description?.trim() || "No gallery description has been added yet."}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                        <SummaryMetric label="Total items" value={String(totalElements)}/>
                        <SummaryMetric
                            label="Current page"
                            value={totalPages ? `${currentPage + 1} of ${totalPages}` : "1 of 1"}
                        />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <KeyValue label="Created" value={formatDateTime(gallery?.audit?.createdDate)}/>
                        <KeyValue label="Last updated" value={formatDateTime(gallery?.audit?.modifiedDate)}/>
                    </div>
                </section>
            </section>

            <section className="rounded-lg border p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="font-semibold">Gallery items</h3>
                        <p className="text-sm text-muted-foreground">
                            Files attached to this property gallery, newest first.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                </div>

                {isLoading ? (
                    <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Spinner className="size-4"/>
                            Loading gallery items
                        </div>
                    </div>
                ) : items.length ? (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                            {items.map((item) => {
                                const status = item.listableStatus?.value;

                                return (
                                    <Card key={item.id} className="gap-4">
                                        <CardHeader className="px-4 pt-4">
                                            <FilePreview item={item}/>
                                        </CardHeader>
                                        <CardContent className="space-y-4 px-4 pb-4">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <CardTitle className="text-base">
                                                        {item.name?.trim() || item.id}
                                                    </CardTitle>
                                                    <Badge variant={getStatusVariant(status)}>
                                                        {status || "UNKNOWN"}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="line-clamp-3 min-h-12">
                                                    {item.description?.trim() || "No description"}
                                                </CardDescription>
                                            </div>

                                            <div className="grid gap-3">
                                                <KeyValue label="File ID" value={item.id}/>
                                                <KeyValue
                                                    label="Status updated"
                                                    value={formatDateTime(item.listableStatus?.lastUpdated)}
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {item.file ? (
                                                    <Button asChild variant="outline" size="sm">
                                                        <a href={item.file} target="_blank" rel="noreferrer">
                                                            Open file
                                                        </a>
                                                    </Button>
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
                            })}
                        </div>

                        {totalPages > 1 ? (
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
                                                setPage(currentPage - 1);
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
                                                        setPage(item);
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
                                                setPage(currentPage + 1);
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        ) : null}
                    </div>
                ) : (
                    <EmptyState
                        title="No gallery items"
                        description="This property gallery exists, but it does not contain any files yet."
                    />
                )}
            </section>
        </div>
    );
}
