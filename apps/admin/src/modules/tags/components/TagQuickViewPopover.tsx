import type {ReactNode} from "react"

import {Badge} from "#/components/ui/badge.tsx"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "#/components/ui/popover.tsx"
import type {TagModel} from "@suiteonix/server"

export function TagQuickViewPopover({
                                        tag,
                                        children,
                                    }: {
    tag?: TagModel.Tag
    children: ReactNode
}) {
    if (!tag) {
        return <>{children}</>
    }

    return (
        <Popover>
            <PopoverTrigger className={" cursor-pointer"}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-96 space-y-4">
                <TagQuickViewContent tag={tag}/>
            </PopoverContent>
        </Popover>
    )
}

export function TagQuickViewContent({tag}: { tag?: TagModel.Tag }) {
    if (!tag) return null

    return (
        <div className="space-y-4">
            <PopoverHeader>
                <div className="flex items-start gap-3">
                    <div
                        className="mt-0.5 size-4 rounded-full border"
                        style={tag.colorHex ? {backgroundColor: tag.colorHex} : undefined}
                    />
                    <div className="min-w-0 flex-1 whitespace-nowrap text-ellipsis">
                        <PopoverTitle className="text-base">{tag.name || tag.id}</PopoverTitle>
                        <PopoverDescription className="text-xs">
                            Tag ID: {tag.id}
                        </PopoverDescription>
                    </div>
                    {/*TODO: make this link possible*/}
                    {/*<Link to={`/admin/tags/${tag.id}`} className="ml-auto">*/}
                    {/*    <Button variant={"glass"} size={"icon"}><ArrowRightIcon/></Button>*/}
                    {/*</Link>*/}
                </div>
            </PopoverHeader>

            <p className="text-sm text-muted-foreground">
                {tag.description || "No description"}
            </p>

            <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{tag.module || "ALL"}</Badge>
                <Badge variant="secondary">{tag.type || "UNKNOWN"}</Badge>
                {tag.colorHex ? <Badge variant="glass">{tag.colorHex}</Badge> : null}
            </div>
        </div>
    )
}
