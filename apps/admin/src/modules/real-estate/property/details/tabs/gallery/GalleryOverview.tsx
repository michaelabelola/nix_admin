import {
    Globe,
    ImageIcon,
    Lock,
} from "lucide-react";

import {Badge} from "#/components/ui/badge.tsx";
import {Card, CardContent} from "#/components/ui/card.tsx";
import type {FilesStorageModel} from "@suiteonix/server";

import {KeyValue, SummaryMetric} from "../../PropertyDetailsPrimitives.tsx";
import {formatDateTime} from "./gallery.utils.ts";

export function GalleryOverview({
                                    currentPage,
                                    gallery,
                                    storageId,
                                    totalElements,
                                    totalPages,
                                }: {
    currentPage: number
    gallery?: FilesStorageModel.Detailed
    storageId: FilesStorageModel.FilesStorageID
    totalElements: number
    totalPages: number
}) {
    return (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(22rem,1fr)] h-fit]">
            <Card className="overflow-hidden py-0 shadow-transparent">
                <div className="relative aspect-16/6 bg-muted">
                    {gallery?.coverImage ? (
                        <img
                            src={gallery.coverImage}
                            alt={gallery.name?.trim() || "Gallery cover"}
                            className="w-full h-fit max-h-100 object-cover"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                            <ImageIcon className="size-12"/>
                        </div>
                    )}
                    <div className="absolute inset-0 dark:bg-linear-to-t dark:from-background dark:via-50% dark:via-background/15 dark:to-transparent"/>
                    <div className="absolute inset-x-0 bottom-0 p-6 backdrop-blur-xl bg-background/70">
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

            <Card>
                <CardContent className={"grid gap-4 sm:grid-cols-2 xl:grid-cols-1"}>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                        <SummaryMetric label="Total items" value={String(totalElements)}/>
                        <SummaryMetric
                            label="Current page"
                            value={totalPages ? `${currentPage + 1} of ${totalPages}` : "1 of 1"}
                        />
                    </section>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <KeyValue label="Created" value={formatDateTime(gallery?.audit?.createdDate)}/>
                        <KeyValue label="Last updated" value={formatDateTime(gallery?.audit?.modifiedDate)}/>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
