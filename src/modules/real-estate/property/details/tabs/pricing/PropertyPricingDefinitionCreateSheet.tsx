import {type ReactNode, useState} from "react";
import {toast} from "sonner";

import {Button} from "#/components/ui/button.tsx";
import {Checkbox} from "#/components/ui/checkbox.tsx";
import {CurrencyDropdown} from "#/lib/currency/CurrencyDropdown.tsx";
import {Input} from "#/components/ui/input.tsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "#/components/ui/sheet.tsx";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import {PricingApiHook} from "#/modules/real-estate/pricing/api.hook.ts";

type PricingFormState = {
    amount: string
    currencyCode: string
    defaultPricing: boolean
}

const INITIAL_FORM_STATE: PricingFormState = {
    amount: "",
    currencyCode: "USD",
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
                        Add a pricing definition for this property and optionally make it the default.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 px-4 pb-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Amount">
                            <Input
                                type="number"
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
                                onValueChange={(value) => updateField("currencyCode", value)}
                                placeholder="Select currency"
                            />
                        </Field>
                    </div>

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
