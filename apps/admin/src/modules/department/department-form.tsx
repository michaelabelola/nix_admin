import type {ReactNode} from "react"
import {ImageSelector} from "@suiteonix/components"
import {Alert, AlertDescription, AlertTitle} from "@suiteonix/ui"
import {Input} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui"
import {Textarea} from "@suiteonix/ui"
import {DepartmentModel} from "@suiteonix/server"
import {PhoneNumberInput} from "#/modules/location/components/PhoneNumberInput.tsx"

export type DepartmentFormValues = {
    name: string
    code: string
    description: string
    parentDepartmentId: string
    email: string
    phone: string
    location: string
    costCenter: string
    type: DepartmentModel.DepartmentType
    status: DepartmentModel.DepartmentStatus
    displayOrder: string
}

export const createInitialDepartmentValues = (
    department?: DepartmentModel.Department | DepartmentModel.Detailed | null,
): DepartmentFormValues => ({
    name: department?.name ?? "",
    code: department?.code ?? "",
    description: department?.description ?? "",
    parentDepartmentId: department?.parentDepartmentId ?? "",
    email: department?.email ?? "",
    phone: department?.phone ?? "",
    location: department?.location ?? "",
    costCenter: department?.costCenter ?? "",
    type: department?.type ?? DepartmentModel.DepartmentType.OTHER,
    status: department?.status ?? DepartmentModel.DepartmentStatus.ACTIVE,
    displayOrder: department?.displayOrder != null ? String(department.displayOrder) : "0",
})

const trimToNull = (value: string) => {
    const next = value.trim()
    return next ? next : null
}

export function validateDepartmentValues(values: DepartmentFormValues) {
    if (!values.name.trim()) return "Name is required."
    if (!values.code.trim()) return "Code is required."

    const displayOrder = values.displayOrder.trim()
    if (displayOrder && !Number.isFinite(Number.parseInt(displayOrder, 10))) {
        return "Display order must be a number."
    }

    return null
}

export function toDepartmentPayload(values: DepartmentFormValues) {
    return {
        name: values.name.trim(),
        code: values.code.trim(),
        description: values.description.trim() || null,
        parentDepartmentId: trimToNull(values.parentDepartmentId),
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        location: values.location.trim() || null,
        costCenter: values.costCenter.trim() || null,
        type: values.type,
        status: values.status,
        displayOrder: values.displayOrder.trim() ? Number.parseInt(values.displayOrder, 10) : null,
    }
}

function Field({
    id,
    label,
    children,
}: {
    id: string
    label: string
    children: ReactNode
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
        </div>
    )
}

export function DepartmentFields({
    values,
    onChange,
    disabled,
}: {
    values: DepartmentFormValues
    onChange: <K extends keyof DepartmentFormValues>(key: K, value: DepartmentFormValues[K]) => void
    disabled?: boolean
}) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Field id="department-name" label="Name">
                    <Input
                        id="department-name"
                        value={values.name}
                        placeholder="Engineering"
                        disabled={disabled}
                        onChange={(event) => onChange("name", event.target.value)}
                    />
                </Field>
                <Field id="department-code" label="Code">
                    <Input
                        id="department-code"
                        value={values.code}
                        placeholder="ENG"
                        disabled={disabled}
                        onChange={(event) => onChange("code", event.target.value)}
                    />
                </Field>
            </div>

            <Field id="department-description" label="Description">
                <Textarea
                    id="department-description"
                    value={values.description}
                    rows={4}
                    placeholder="Owns product engineering, infrastructure, and technical delivery"
                    disabled={disabled}
                    onChange={(event) => onChange("description", event.target.value)}
                />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
                <Field id="department-type" label="Type">
                    <Select
                        value={values.type}
                        disabled={disabled}
                        onValueChange={(value) => onChange("type", value as DepartmentModel.DepartmentType)}
                    >
                        <SelectTrigger id="department-type" className="w-full">
                            <SelectValue placeholder="Select type"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(DepartmentModel.DepartmentType).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field id="department-status" label="Status">
                    <Select
                        value={values.status}
                        disabled={disabled}
                        onValueChange={(value) => onChange("status", value as DepartmentModel.DepartmentStatus)}
                    >
                        <SelectTrigger id="department-status" className="w-full">
                            <SelectValue placeholder="Select status"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(DepartmentModel.DepartmentStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Field id="department-parent" label="Parent Department ID">
                    <Input
                        id="department-parent"
                        value={values.parentDepartmentId}
                        placeholder="Optional parent department ID"
                        disabled={disabled}
                        onChange={(event) => onChange("parentDepartmentId", event.target.value)}
                    />
                </Field>
                <Field id="department-display-order" label="Display Order">
                    <Input
                        id="department-display-order"
                        type="number"
                        value={values.displayOrder}
                        disabled={disabled}
                        onChange={(event) => onChange("displayOrder", event.target.value)}
                    />
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Field id="department-email" label="Email">
                    <Input
                        id="department-email"
                        type="email"
                        value={values.email}
                        placeholder="engineering@example.com"
                        disabled={disabled}
                        onChange={(event) => onChange("email", event.target.value)}
                    />
                </Field>
                <Field id="department-phone" label="Phone">
                    <PhoneNumberInput
                        id="department-phone"
                        value={values.phone}
                        disabled={disabled}
                        onValueChange={(value) => onChange("phone", value)}
                    />
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Field id="department-location" label="Location">
                    <Input
                        id="department-location"
                        value={values.location}
                        placeholder="Toronto HQ"
                        disabled={disabled}
                        onChange={(event) => onChange("location", event.target.value)}
                    />
                </Field>
                <Field id="department-cost-center" label="Cost Center">
                    <Input
                        id="department-cost-center"
                        value={values.costCenter}
                        placeholder="CC-100"
                        disabled={disabled}
                        onChange={(event) => onChange("costCenter", event.target.value)}
                    />
                </Field>
            </div>
        </div>
    )
}

export function DepartmentAvatarField({
    value,
    defaultImageUrl,
    disabled,
    onChange,
}: {
    value: File | null
    defaultImageUrl?: string | null
    disabled?: boolean
    onChange: (file: File | null) => void
}) {
    return (
        <div className="grid gap-2">
            <Label>Avatar</Label>
            <ImageSelector
                value={value}
                defaultImageUrl={defaultImageUrl}
                disabled={disabled}
                accept="image/*"
                aspectRatio="SQUARE"
                className="items-start"
                imageClassName="max-h-64 rounded-md border bg-muted object-contain"
                onChange={onChange}
            />
        </div>
    )
}

export function DepartmentFormError({
    title,
    message,
}: {
    title: string
    message?: string | null
}) {
    if (!message) return null

    return (
        <Alert variant="destructive">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}
