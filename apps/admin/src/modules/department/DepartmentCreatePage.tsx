import {useState, type FormEvent} from "react"
import {Link, useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import {Page} from "@suiteonix/components"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui"
import {DepartmentRequest} from "@suiteonix/server"
import {
    createInitialDepartmentValues,
    DepartmentAvatarField,
    DepartmentFields,
    DepartmentFormError,
    toDepartmentPayload,
    validateDepartmentValues,
} from "#/modules/department/department-form.tsx"

export function DepartmentCreatePage() {
    const navigate = useNavigate()
    const [values, setValues] = useState(createInitialDepartmentValues())
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [validationError, setValidationError] = useState<string | null>(null)
    const createDepartment = DepartmentRequest.useCreateDepartment()
    const uploadAvatar = DepartmentRequest.useUploadDepartmentAvatar()
    const isPending = createDepartment.isPending || uploadAvatar.isPending

    function updateField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
        setValues((current) => ({...current, [key]: value}))
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const error = validateDepartmentValues(values)
        if (error) {
            setValidationError(error)
            return
        }

        setValidationError(null)
        const department = await createDepartment.mutateAsync(toDepartmentPayload(values))

        if (avatarFile) {
            await uploadAvatar.mutateAsync({
                departmentId: department.id,
                file: avatarFile,
            })
        }

        toast.success("Department created.")
        await navigate({
            to: "/admin/departments/$departmentId/details",
            params: {departmentId: department.id},
        })
    }

    return (
        <Page
            header={{
                title: "Create Department",
                description: "Add a department profile, contact record, and optional avatar.",
                actionView: (
                    <ButtonGroup>
                        <Button variant="outline" asChild>
                            <Link to="/admin/departments">Back to departments</Link>
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <form className="grid gap-6" onSubmit={(event) => void submit(event)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Department Profile</CardTitle>
                        <CardDescription>
                            Use the department code for stable reporting and the display order for hierarchy sorting.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DepartmentFields values={values} disabled={isPending} onChange={updateField}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Avatar</CardTitle>
                        <CardDescription>
                            Upload a square department avatar for list and detail views.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DepartmentAvatarField value={avatarFile} disabled={isPending} onChange={setAvatarFile}/>
                    </CardContent>
                </Card>

                <DepartmentFormError
                    title="Unable to create department"
                    message={validationError || createDepartment.error?.message || uploadAvatar.error?.message}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" asChild>
                        <Link to="/admin/departments">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create department"}
                    </Button>
                </div>
            </form>
        </Page>
    )
}
