import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Checkbox} from "#/components/ui/checkbox.tsx"
import {Label} from "#/components/ui/label.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"

import {EMPTY_OPTION} from "./property-listing-profile-create.shared.ts"

type SelectOption = {
    value: string
    label: string
}

function DefinitionSelect({
    id,
    label,
    onValueChange,
    options,
    value,
}: {
    id: string
    label: string
    onValueChange: (value: string) => void
    options: SelectOption[]
    value: string
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={EMPTY_OPTION}>{`No ${label.toLowerCase()}`}</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export function PropertyListingProfileSnapshotSourcesCard({
    isDefault,
    leaseId,
    leaseOptions,
    onDefaultChange,
    onLeaseChange,
    onPricingChange,
    onRentChange,
    pricingId,
    pricingOptions,
    rentId,
    rentOptions,
}: {
    isDefault: boolean
    leaseId: string
    leaseOptions: SelectOption[]
    onDefaultChange: (checked: boolean) => void
    onLeaseChange: (value: string) => void
    onPricingChange: (value: string) => void
    onRentChange: (value: string) => void
    pricingId: string
    pricingOptions: SelectOption[]
    rentId: string
    rentOptions: SelectOption[]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Snapshot Sources</CardTitle>
                <CardDescription>Choose which default pricing and tenancy definitions to include in the profile.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DefinitionSelect
                    id="listing-profile-pricing"
                    label="Pricing definition"
                    value={pricingId}
                    options={pricingOptions}
                    onValueChange={onPricingChange}
                />
                <DefinitionSelect
                    id="listing-profile-rent"
                    label="Rent definition"
                    value={rentId}
                    options={rentOptions}
                    onValueChange={onRentChange}
                />
                <DefinitionSelect
                    id="listing-profile-lease"
                    label="Lease definition"
                    value={leaseId}
                    options={leaseOptions}
                    onValueChange={onLeaseChange}
                />

                <label className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
                    <Checkbox checked={isDefault} onCheckedChange={(checked) => onDefaultChange(checked === true)}/>
                    <span>Mark as default profile</span>
                </label>
            </CardContent>
        </Card>
    )
}

