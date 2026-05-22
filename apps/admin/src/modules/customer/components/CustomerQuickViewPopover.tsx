import type {ReactNode} from "react"

import {Badge} from "@suiteonix/ui"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@suiteonix/ui"
import type {CustomerModel} from "@suiteonix/server"
import {
    customerStatusBadgeVariant,
    formatCustomerAddress,
    getCustomerDisplayName,
} from "#/modules/customer/details/customer-details.utils.ts"

type CustomerQuickView = CustomerModel.Customer | CustomerModel.Detailed

export function CustomerQuickViewPopover({
    customer,
    children,
}: {
    customer?: CustomerQuickView
    children: ReactNode
}) {
    if (!customer) {
        return <>{children}</>
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-96 space-y-4">
                <CustomerQuickViewContent customer={customer}/>
            </PopoverContent>
        </Popover>
    )
}

export function CustomerQuickViewContent({customer}: { customer?: CustomerQuickView }) {
    if (!customer) return null

    const contact = "contact" in customer ? customer.contact : undefined
    const billingAddress = "billingAddress" in customer ? customer.billingAddress : undefined
    const tags = "tags" in customer ? customer.tags : undefined
    const segments = "segments" in customer ? customer.segments : undefined

    return (
        <div className="space-y-4">
            <PopoverHeader>
                <PopoverTitle className="text-base">{getCustomerDisplayName(customer)}</PopoverTitle>
                <PopoverDescription className="text-xs">
                    Customer ID: {customer.id}
                </PopoverDescription>
            </PopoverHeader>

            <div className="flex flex-wrap gap-2">
                {"status" in customer && customer.status ? (
                    <Badge variant={customerStatusBadgeVariant[customer.status]}>
                        {customer.status}
                    </Badge>
                ) : null}
                {"type" in customer ? <Badge variant="outline">{customer.type || "TYPE_UNSET"}</Badge> : null}
                {"lifecycleStage" in customer ? <Badge variant="secondary">{customer.lifecycleStage || "STAGE_UNSET"}</Badge> : null}
            </div>

            <div className="grid gap-2 text-sm">
                {"customerNumber" in customer ? (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Customer Number</span>
                        <span className="text-right">{customer.customerNumber || "Not set"}</span>
                    </div>
                ) : null}
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="text-right">{customer.storageID != null ? String(customer.storageID) : "Not set"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Primary Contact</span>
                    <span className="text-right">
                        {contact?.email || contact?.phoneNumber || contact?.mobileNumber || "Not set"}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-right">{formatCustomerAddress(billingAddress) || "Not set"}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Entity: {customer.entityID}</Badge>
                {Array.isArray(tags) ? <Badge variant="secondary">Tags: {tags.length}</Badge> : null}
                {Array.isArray(segments) ? <Badge variant="secondary">Segments: {segments.length}</Badge> : null}
            </div>
        </div>
    )
}
