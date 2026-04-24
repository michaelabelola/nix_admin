import {FilesStorageModel} from "#/modules/files-storage/model.ts";

export const PAGE_SIZE = 12;

export function formatDateTime(value?: Date | string | null) {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export function getStatusVariant(status?: FilesStorageModel.ListableSourceStatus | null): "outline" | "secondary" | "success" | "warning" | "destructive" {
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

export function buildPageItems(currentPage: number, totalPages: number) {
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
