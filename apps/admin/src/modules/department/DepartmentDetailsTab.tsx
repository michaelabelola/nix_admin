import {useEffect, useState, type FormEvent} from "react"
import {toast} from "sonner"

import {Button} from "@suiteonix/ui"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui"
import {DepartmentModel, DepartmentRequest} from "@suiteonix/server"
import {
    createInitialDepartmentValues,
    DepartmentAvatarField,
    DepartmentFields,
    DepartmentFormError,
    toDepartmentPayload,
    validateDepartmentValues,
} from "#/modules/department/department-form.tsx"

function formatAuditDate(value?: string | Date | null) {
    if (!value) return "Not set"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Not set"
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

export function DepartmentDetailsTab({
    department,
}: {
    department?: DepartmentModel.Detailed
}) {
    const [values, setValues] = useState(() => createInitialDepartmentValues(department))
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [validationError, setValidationError] = useState<string | null>(null)
    const updateDepartment = DepartmentRequest.useUpdateDepartment(() => {
        toast.success("Department updated.")
    })
    const uploadAvatar = DepartmentRequest.useUploadDepartmentAvatar(() => {
        toast.success("Department avatar uploaded.")
        setAvatarFile(null)
    })
    const isPending = updateDepartment.isPending || uploadAvatar.isPending

    useEffect(() => {
        setValues(createInitialDepartmentValues(department))
        setAvatarFile(null)
        setValidationError(null)
    }, [department])

    function updateField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
        setValues((current) => ({...current, [key]: value}))
    }

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!department?.id) return

        const error = validateDepartmentValues(values)
        if (error) {
            setValidationError(error)
            return
        }

        setValidationError(null)
        const parentDepartmentId = values.parentDepartmentId.trim() || null
        await updateDepartment.mutateAsync({
            departmentId: department.id,
            body: {
                ...toDepartmentPayload(values),
                clearParentDepartment: Boolean(department.parentDepartmentId && !parentDepartmentId),
            },
        })

        if (avatarFile) {
            await uploadAvatar.mutateAsync({
                departmentId: department.id,
                file: avatarFile,
            })
        }
    }

    return (
        <form className="grid gap-6" onSubmit={(event) => void save(event)}>
            <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
                <Card>
                    <CardHeader>
                        <CardTitle>Department Details</CardTitle>
                        <CardDescription>
                            Update the department profile, hierarchy, and contact data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DepartmentFields values={values} disabled={isPending || !department} onChange={updateField}/>
                    </CardContent>
                </Card>

                <div className="grid content-start gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Avatar</CardTitle>
                            <CardDescription>
                                Upload or replace the department avatar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DepartmentAvatarField
                                value={avatarFile}
                                defaultImageUrl={department?.avatar ?? null}
                                disabled={isPending || !department}
                                onChange={setAvatarFile}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Audit</CardTitle>
                            <CardDescription>Record ownership and timestamps.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm">
                            <div className="grid gap-1">
                                <span className="text-muted-foreground">Created</span>
                                <span>{formatAuditDate(department?.audit?.createdDate)}</span>
                            </div>
                            <div className="grid gap-1">
                                <span className="text-muted-foreground">Modified</span>
                                <span>{formatAuditDate(department?.audit?.modifiedDate)}</span>
                            </div>
                            <div className="grid gap-1">
                                <span className="text-muted-foreground">Entity</span>
                                <span className="font-mono text-xs">{department?.entityID || "Not set"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DepartmentFormError
                title="Unable to save department"
                message={validationError || updateDepartment.error?.message || uploadAvatar.error?.message}
            />

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending || !department}>
                    {isPending ? "Saving..." : avatarFile ? "Save and upload avatar" : "Save changes"}
                </Button>
            </div>
        </form>
    )
}
