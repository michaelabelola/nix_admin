import {useState} from "react";
import type {ColumnDef} from "@tanstack/react-table";
import {Check, PlusCircle} from "lucide-react";
import {toast} from "sonner";

import DataTable from "#/components/data-table/data-table.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {Checkbox} from "#/components/ui/checkbox.tsx";
import {Input} from "#/components/ui/input.tsx";
import {QuickToolTip} from "#/components/ui/tooltip.tsx";
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
import {RentDefinitionRequest} from "#/modules/real-estate/rent-definition/api.hook.ts";
import {RentDefinitionModel} from "#/modules/real-estate/rent-definition/model.ts";

import {DefinitionCard} from "../../PropertyDetailsPrimitives.tsx";
import {formatDuration, formatMoney} from "../../property-details.utils.ts";

type RentFormState = {
    name: string
    description: string
    amount: string
    currencyCode: string
    duration: string
    durationUnit: RentDefinitionModel.RentDurationUnit
    defaultRent: boolean
}

const INITIAL_FORM_STATE: RentFormState = {
    name: "",
    description: "",
    amount: "",
    currencyCode: "USD",
    duration: "",
    durationUnit: RentDefinitionModel.RentDurationUnit.MONTH,
    defaultRent: false,
}

export function PropertyDetailsRentTab({property}: { property?: PropertyModel.Detailed }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [formState, setFormState] = useState<RentFormState>(INITIAL_FORM_STATE)
    const createRent = RentDefinitionRequest.useCreatePropertyRent(() => {
        toast.success("Rent definition created.")
        setIsCreateOpen(false)
        setFormState(INITIAL_FORM_STATE)
    })
    const setDefaultRent = RentDefinitionRequest.useSetPropertyDefaultRent(() => {
        toast.success("Default rent definition updated.")
    })

    const columns: Array<ColumnDef<RentDefinitionModel.RentDefinition>> = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => row.original.name || "Untitled",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => row.original.description || "No description",
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({row}) => formatMoney(row.original.amount) ?? "Not set",
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({row}) => formatDuration(row.original.duration, row.original.durationUnit),
        },
        {
            id: "default",
            header: "Default",
            cell: ({row}) =>
                property?.defaultRentDefinition?.id === row.original.id ? "Yes" : "No",
        },
        {
            id: "action",
            header: "Action",
            cell: ({row}) => {
                const isDefault = property?.defaultRentDefinition?.id === row.original.id

                return (
                    <ButtonGroup>
                        <QuickToolTip asChild content={isDefault ? "Current default rent definition" : "Make default rent definition"}>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={isDefault || setDefaultRent.isPending || !property?.id}
                                onClick={() => {
                                    if (!property?.id || isDefault) return
                                    void setDefaultRent.mutateAsync({
                                        propertyId: property.id,
                                        rentDefinitionId: row.original.id,
                                    })
                                }}
                            >
                                <Check className="size-4"/>
                            </Button>
                        </QuickToolTip>
                    </ButtonGroup>
                )
            },
        },
    ]

    const isCreateDisabled =
        !property?.id ||
        !formState.amount.trim() ||
        !formState.currencyCode.trim() ||
        createRent.isPending

    return (
        <>
            <DefinitionCard
                title="Rent Definitions"
                description="All rent definitions assigned to this property."
            >
                <DataTable
                    columns={columns}
                    from="/admin/real-estate/properties/$propertyId/rent"
                    useQuery={RentDefinitionRequest.useQueryPropertyRents}
                    defaultQueryFields={{
                        propertyId: property?.id,
                    }}
                    initialRequest={{
                        page: 0,
                        size: 10,
                    }}
                    searchPlaceholder="Search Rent Definitions..."
                    emptyMessage="No Rent Definitions found."
                    toolbarActions={
                        <Button onClick={() => setIsCreateOpen(true)} disabled={!property?.id}>
                            <PlusCircle className="size-4"/>
                            Create rent definition
                        </Button>
                    }
                />
            </DefinitionCard>

            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent className="sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Create Rent Definition</SheetTitle>
                        <SheetDescription>
                            Add a rent definition for this property and optionally make it the default.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-4 px-4 pb-4">
                        <Field label="Name">
                            <Input
                                value={formState.name}
                                onChange={(event) => setFormState((prev) => ({...prev, name: event.target.value}))}
                                placeholder="Standard monthly rent"
                            />
                        </Field>

                        <Field label="Description">
                            <Textarea
                                value={formState.description}
                                onChange={(event) => setFormState((prev) => ({...prev, description: event.target.value}))}
                                placeholder="Optional rent definition notes"
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Amount">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formState.amount}
                                    onChange={(event) => setFormState((prev) => ({...prev, amount: event.target.value}))}
                                    placeholder="0.00"
                                />
                            </Field>

                            <Field label="Currency code">
                                <Input
                                    value={formState.currencyCode}
                                    onChange={(event) =>
                                        setFormState((prev) => ({...prev, currencyCode: event.target.value.toUpperCase()}))
                                    }
                                    placeholder="USD"
                                    maxLength={3}
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Duration">
                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={formState.duration}
                                    onChange={(event) => setFormState((prev) => ({...prev, duration: event.target.value}))}
                                    placeholder="1"
                                />
                            </Field>

                            <Field label="Duration unit">
                                <Select
                                    value={formState.durationUnit}
                                    onValueChange={(value) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            durationUnit: value as RentDefinitionModel.RentDurationUnit,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select duration unit"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(RentDefinitionModel.RentDurationUnit).map((unit) => (
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
                                checked={formState.defaultRent}
                                onCheckedChange={(checked) =>
                                    setFormState((prev) => ({...prev, defaultRent: checked === true}))
                                }
                            />
                            <span>Make this the default rent definition</span>
                        </label>
                    </div>

                    <SheetFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateOpen(false)
                                setFormState(INITIAL_FORM_STATE)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isCreateDisabled}
                            onClick={() => {
                                if (!property?.id) return

                                void createRent.mutateAsync({
                                    propertyId: property.id,
                                    body: {
                                        name: formState.name.trim() || undefined,
                                        description: formState.description.trim() || undefined,
                                        amount: {
                                            amount: Number(formState.amount),
                                            currencyCode: formState.currencyCode.trim().toUpperCase(),
                                        },
                                        duration: formState.duration ? Number(formState.duration) : undefined,
                                        durationUnit: formState.durationUnit,
                                        defaultRent: formState.defaultRent,
                                    },
                                })
                            }}
                        >
                            {createRent.isPending ? "Creating..." : "Create definition"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}

function Field({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="grid gap-2">
            <div className="text-sm font-medium">{label}</div>
            {children}
        </div>
    )
}
