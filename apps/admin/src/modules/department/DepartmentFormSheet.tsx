import {useEffect, useMemo, useState} from "react"
import {toast} from "sonner"

import {Alert, AlertDescription, AlertTitle} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {Input} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@suiteonix/ui"
import {Textarea} from "@suiteonix/ui"
import {DepartmentModel, DepartmentRequest} from "@suiteonix/server"
import {PhoneNumberInput} from "#/modules/location/components/PhoneNumberInput.tsx"

type DepartmentFormValues = {
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

const createInitialValues = (department?: DepartmentModel.Department | DepartmentModel.Detailed | null): DepartmentFormValues => ({
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

function Field({
    id,
    label,
    children,
}: {
    id: string
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
        </div>
    )
}

export function DepartmentFormSheet({
    open,
    onOpenChange,
    department,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    department?: DepartmentModel.Department | DepartmentModel.Detailed | null
}) {
    const isEditing = Boolean(department?.id)
    const [values, setValues] = useState<DepartmentFormValues>(() => createInitialValues(department))
    const [validationError, setValidationError] = useState<string | null>(null)

    const createDepartment = DepartmentRequest.useCreateDepartment(() => {
        toast.success("Department created.")
        onOpenChange(false)
    })
    const updateDepartment = DepartmentRequest.useUpdateDepartment(() => {
        toast.success("Department updated.")
        onOpenChange(false)
    })

    const requestError = useMemo(
        () => createDepartment.error?.message || updateDepartment.error?.message,
        [createDepartment.error?.message, updateDepartment.error?.message],
    )
    const isPending = createDepartment.isPending || updateDepartment.isPending

    useEffect(() => {
        if (open) {
            setValues(createInitialValues(department))
            setValidationError(null)
        }
    }, [department, open])

    function updateField<K extends keyof DepartmentFormValues>(key: K, value: DepartmentFormValues[K]) {
        setValues((current) => ({...current, [key]: value}))
    }

    async function submit() {
        const name = values.name.trim()
        const code = values.code.trim()
        if (!name) {
            setValidationError("Name is required.")
            return
        }
        if (!code) {
            setValidationError("Code is required.")
            return
        }

        const displayOrder = values.displayOrder.trim() ? Number.parseInt(values.displayOrder, 10) : null
        if (values.displayOrder.trim() && !Number.isFinite(displayOrder)) {
            setValidationError("Display order must be a number.")
            return
        }

        setValidationError(null)
        const parentDepartmentId = trimToNull(values.parentDepartmentId)
        const payload = {
            name,
            code,
            description: values.description.trim() || null,
            parentDepartmentId,
            email: values.email.trim() || null,
            phone: values.phone.trim() || null,
            location: values.location.trim() || null,
            costCenter: values.costCenter.trim() || null,
            type: values.type,
            status: values.status,
            displayOrder,
        }

        if (department?.id) {
            await updateDepartment.mutateAsync({
                departmentId: department.id,
                body: {
                    ...payload,
                    clearParentDepartment: Boolean(department.parentDepartmentId && !parentDepartmentId),
                },
            })
            return
        }

        await createDepartment.mutateAsync(payload as DepartmentModel.Create)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-2xl">
                <SheetHeader>
                    <SheetTitle>{isEditing ? "Edit Department" : "Create Department"}</SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? "Update the department profile and hierarchy metadata."
                            : "Create a department profile for the current organization."}
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="grid gap-4 px-4 pb-4"
                    onSubmit={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        void submit()
                    }}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field id="department-name" label="Name">
                            <Input
                                id="department-name"
                                value={values.name}
                                placeholder="Engineering"
                                onChange={(event) => updateField("name", event.target.value)}
                            />
                        </Field>
                        <Field id="department-code" label="Code">
                            <Input
                                id="department-code"
                                value={values.code}
                                placeholder="ENG"
                                onChange={(event) => updateField("code", event.target.value)}
                            />
                        </Field>
                    </div>

                    <Field id="department-description" label="Description">
                        <Textarea
                            id="department-description"
                            value={values.description}
                            rows={4}
                            placeholder="Owns product engineering, infrastructure, and technical delivery"
                            onChange={(event) => updateField("description", event.target.value)}
                        />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field id="department-type" label="Type">
                            <Select
                                value={values.type}
                                onValueChange={(value) => updateField("type", value as DepartmentModel.DepartmentType)}
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
                                onValueChange={(value) => updateField("status", value as DepartmentModel.DepartmentStatus)}
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
                                onChange={(event) => updateField("parentDepartmentId", event.target.value)}
                            />
                        </Field>
                        <Field id="department-display-order" label="Display Order">
                            <Input
                                id="department-display-order"
                                type="number"
                                value={values.displayOrder}
                                onChange={(event) => updateField("displayOrder", event.target.value)}
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
                                onChange={(event) => updateField("email", event.target.value)}
                            />
                        </Field>
                        <Field id="department-phone" label="Phone">
                            <PhoneNumberInput
                                id="department-phone"
                                value={values.phone}
                                onValueChange={(value) => updateField("phone", value)}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field id="department-location" label="Location">
                            <Input
                                id="department-location"
                                value={values.location}
                                placeholder="Toronto HQ"
                                onChange={(event) => updateField("location", event.target.value)}
                            />
                        </Field>
                        <Field id="department-cost-center" label="Cost Center">
                            <Input
                                id="department-cost-center"
                                value={values.costCenter}
                                placeholder="CC-100"
                                onChange={(event) => updateField("costCenter", event.target.value)}
                            />
                        </Field>
                    </div>

                    {validationError || requestError ? (
                        <Alert variant="destructive">
                            <AlertTitle>Unable to save department</AlertTitle>
                            <AlertDescription>{validationError || requestError}</AlertDescription>
                        </Alert>
                    ) : null}

                    <SheetFooter className="px-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : isEditing ? "Save changes" : "Create department"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
