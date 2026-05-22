import {type ReactNode, useState} from "react";
import {toast} from "sonner";

import {Button} from "#/components/ui/button.tsx";
import {Checkbox} from "#/components/ui/checkbox.tsx";
import {CurrencyDropdown} from "#/lib/currency/CurrencyDropdown.tsx";
import {Input} from "#/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "#/components/ui/sheet.tsx";
import {Textarea} from "#/components/ui/textarea.tsx";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import {LeaseDefinitionApiHook} from "#/modules/real-estate/lease-definition/api.hook.ts";
import {LeaseDefinitionModel} from "#/modules/real-estate/lease-definition/model.ts";

type LeaseFormState = {
    name: string
    description: string
    amount: string
    currencyCode: string
    negotiable: boolean
    duration: string
    durationUnit: LeaseDefinitionModel.LeaseDurationUnit
    defaultLease: boolean
}

const INITIAL_FORM_STATE: LeaseFormState = {
    name: "",
    description: "",
    amount: "",
    currencyCode: "USD",
    negotiable: false,
    duration: "",
    durationUnit: LeaseDefinitionModel.LeaseDurationUnit.MONTH,
    defaultLease: false,
}

export function PropertyLeaseDefinitionCreateSheet({
    property,
    open,
    onOpenChange,
}: {
    property?: PropertyModel.Detailed
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [formState, setFormState] = useState<LeaseFormState>(INITIAL_FORM_STATE)
    const createLease = LeaseDefinitionApiHook.useCreatePropertyLease(() => {
        toast.success("Lease definition created.")
        resetAndClose()
    })

    const isCreateDisabled =
        !property?.id ||
        !formState.name.trim() ||
        !formState.amount.trim() ||
        !formState.currencyCode.trim() ||
        !formState.duration.trim() ||
        createLease.isPending

    function resetForm() {
        setFormState(INITIAL_FORM_STATE)
    }

    function resetAndClose() {
        resetForm()
        onOpenChange(false)
    }

    function updateField<K extends keyof LeaseFormState>(key: K, value: LeaseFormState[K]) {
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

        void createLease.mutateAsync({
            propertyId: property.id,
            body: {
                name: formState.name.trim(),
                description: formState.description.trim() || undefined,
                amount: {
                    amount: Number(formState.amount),
                    currencyCode: formState.currencyCode.trim().toUpperCase(),
                },
                negotiable: formState.negotiable,
                duration: formState.duration ? Number(formState.duration) : undefined,
                durationUnit: formState.durationUnit,
                defaultLease: formState.defaultLease,
            },
        })
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Create Lease Definition</SheetTitle>
                    <SheetDescription>
                        Add a lease definition for this property and optionally make it the default.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 px-4 pb-4">
                    <Field label="Name">
                        <Input
                            value={formState.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Standard annual lease"
                        />
                    </Field>

                    <Field label="Description">
                        <Textarea
                            value={formState.description}
                            onChange={(event) => updateField("description", event.target.value)}
                            placeholder="Optional lease definition notes"
                        />
                    </Field>

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
                            checked={formState.negotiable}
                            onCheckedChange={(checked) => updateField("negotiable", checked === true)}
                        />
                        <span>Lease is negotiable</span>
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Duration">
                            <Input
                                type="number"
                                min="1"
                                step="1"
                                value={formState.duration}
                                onChange={(event) => updateField("duration", event.target.value)}
                                placeholder="1"
                            />
                        </Field>

                        <Field label="Duration unit">
                            <Select
                                value={formState.durationUnit}
                                onValueChange={(value) => updateField("durationUnit", value as LeaseDefinitionModel.LeaseDurationUnit)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select duration unit"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(LeaseDefinitionModel.LeaseDurationUnit).map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                        <Checkbox
                            checked={formState.defaultLease}
                            onCheckedChange={(checked) => updateField("defaultLease", checked === true)}
                        />
                        <span>Make this the default lease definition</span>
                    </label>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={resetAndClose}>
                        Cancel
                    </Button>
                    <Button disabled={isCreateDisabled} onClick={handleCreate}>
                        {createLease.isPending ? "Creating..." : "Create definition"}
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
