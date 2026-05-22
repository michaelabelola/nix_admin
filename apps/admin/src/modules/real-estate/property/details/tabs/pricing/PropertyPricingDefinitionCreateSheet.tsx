import {type ReactNode, useState} from "react";
import {toast} from "sonner";

import {Button} from "@suiteonix/ui";
import {Checkbox} from "@suiteonix/ui";
import {CurrencyDropdown} from "#/lib/currency/CurrencyDropdown.tsx";
import {Input} from "@suiteonix/ui";
import {Textarea} from "@suiteonix/ui";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@suiteonix/ui";
import type {PropertyModel} from "@suiteonix/server";
import {PricingApiHook} from "@suiteonix/server";

type PricingFormState = {
    name: string
    description: string
    amount: string
    currencyCode: string
    negotiable: boolean
    defaultPricing: boolean
}

const INITIAL_FORM_STATE: PricingFormState = {
    name: "",
    description: "",
    amount: "",
    currencyCode: "CAD",
    negotiable: false,
    defaultPricing: false,
}

export function PropertyPricingDefinitionCreateSheet({
    property,
    open,
    onOpenChange,
}: {
    property?: PropertyModel.Detailed
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [formState, setFormState] = useState<PricingFormState>(INITIAL_FORM_STATE)
    const setDefaultPricing = PricingApiHook.useSetPropertyDefaultPricing(() => {
        toast.success("Default pricing updated.")
        resetAndClose()
    })
    const createPricing = PricingApiHook.useCreatePropertyPricing((pricing) => {
        if (!property?.id || !formState.defaultPricing) {
            toast.success("Pricing definition created.")
            resetAndClose()
            return
        }

        void setDefaultPricing.mutateAsync({
            propertyId: property.id,
            pricingId: pricing.id,
        })
    })

    const isCreateDisabled =
        !property?.id ||
        !formState.name.trim() ||
        !formState.amount.trim() ||
        !formState.currencyCode.trim() ||
        createPricing.isPending ||
        setDefaultPricing.isPending

    function resetForm() {
        setFormState(INITIAL_FORM_STATE)
    }

    function resetAndClose() {
        resetForm()
        onOpenChange(false)
    }

    function updateField<K extends keyof PricingFormState>(key: K, value: PricingFormState[K]) {
        setFormState((prev) => ({...prev, [key]: value}))
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            resetForm()
        }

        onOpenChange(nextOpen)
    }

    function handleCreate() {
        if (!property?.id) return

        void createPricing.mutateAsync({
            propertyId: property.id,
            body: {
                name: formState.name.trim(),
                description: formState.description.trim() || undefined,
                negotiable: formState.negotiable,
                amount: {
                    amount: Number(formState.amount),
                    currencyCode: formState.currencyCode.trim().toUpperCase(),
                },
            },
        })
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Create Pricing Definition</SheetTitle>
                    <SheetDescription>
                        Add a pricing definition for this property.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 px-4 pb-4">
                    <Field label="Name">
                        <Input
                            value={formState.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Market asking price"
                        />
                    </Field>

                    <Field label="Description">
                        <Textarea
                            value={formState.description}
                            onChange={(event) => updateField("description", event.target.value)}
                            placeholder="Optional pricing notes"
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Amount">
                            <Input
                                type="text"
                                inputMode={"decimal"}
                                min="0"
                                step="0.01"
                                value={formState.amount}
                                onChange={(event) => updateField("amount", event.target.value)}
                                placeholder="0.00"
                            />
                        </Field>

                        <Field label="Currency code">
                            <CurrencyDropdown
                                value={formState.currencyCode}
                                full={true}
                                onValueChange={(value) => updateField("currencyCode", value)}
                                placeholder="Select currency"
                            />
                        </Field>
                    </div>

                    <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                        <Checkbox
                            checked={formState.negotiable}
                            onCheckedChange={(checked) => updateField("negotiable", checked === true)}
                        />
                        <span>Price is negotiable</span>
                    </label>

                    <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                        <Checkbox
                            checked={formState.defaultPricing}
                            onCheckedChange={(checked) => updateField("defaultPricing", checked === true)}
                        />
                        <span>Make this the default pricing definition</span>
                    </label>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={resetAndClose}>
                        Cancel
                    </Button>
                    <Button disabled={isCreateDisabled} onClick={handleCreate}>
                        {createPricing.isPending || setDefaultPricing.isPending ? "Creating..." : "Create definition"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function Field({
    label,
    children,
}: {
    label: string
    children: ReactNode
}) {
    return (
        <div className="grid gap-2">
            <div className="text-sm font-medium">{label}</div>
            {children}
        </div>
    )
}
