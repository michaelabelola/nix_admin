import {useEffect} from "react";
import {useForm, useStore} from "@tanstack/react-form";
import {toast} from "sonner";

import {Alert, AlertDescription, AlertTitle} from "@suiteonix/ui";
import {Button} from "@suiteonix/ui";
import {Input} from "@suiteonix/ui";
import {Label} from "@suiteonix/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@suiteonix/ui";
import {Textarea} from "@suiteonix/ui";
import {NixModule} from "@suiteonix/server/models";
import {TagModel} from "@suiteonix/server";
import {TagRequest} from "@suiteonix/server";

type TagFormValues = {
    name: string
    description: string
    color: string
    module: NixModule
    type: TagModel.TagType
}

type FieldError = string | { message?: string }

const INITIAL_VALUES: TagFormValues = {
    name: "",
    description: "",
    color: "#2563eb",
    module: NixModule.ALL,
    type: TagModel.TagType.CUSTOM,
}

function required(value: string, label: string) {
    if (!value.trim()) return `${label} is required`
    return undefined
}

function validateColor(value: string) {
    if (!value.trim()) return undefined
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value.trim())) {
        return "Enter a valid hex color"
    }
    return undefined
}

function getErrorMessage(error: FieldError) {
    return typeof error === "string" ? error : error.message ?? "Invalid value"
}

function TextField({
    field,
    label,
    placeholder,
    type = "text",
}: {
    field: any
    label: string
    placeholder?: string
    type?: "text" | "color"
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Input
                id={field.name}
                name={field.name}
                type={type}
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

function TextAreaField({
    field,
    label,
    placeholder,
}: {
    field: any
    label: string
    placeholder?: string
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                placeholder={placeholder}
                className="min-h-24"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

export function TagCreateSheet({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const createTag = TagRequest.useCreateTag(() => {
        toast.success("Tag created.")
        onOpenChange(false)
    })

    const form = useForm<TagFormValues>({
        defaultValues: INITIAL_VALUES,
        onSubmit: async ({value}) => {
            await createTag.mutateAsync({
                name: value.name.trim(),
                description: value.description.trim() || undefined,
                color: value.color.trim() || undefined,
                module: value.module,
                type: value.type,
            })
        },
    })

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [form, open])

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Create Tag</SheetTitle>
                    <SheetDescription>
                        Add a new tag for your organization. System tags remain read-only.
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="grid gap-4 px-4 pb-4"
                    onSubmit={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        void form.handleSubmit()
                    }}
                >
                    <form.Field
                        name="name"
                        validators={{
                            onChange: ({value}) => required(value, "Name"),
                        }}
                    >
                        {(field) => (
                            <TextField
                                field={field}
                                label="Name"
                                placeholder="Marketing"
                            />
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <TextAreaField
                                field={field}
                                label="Description"
                                placeholder="Optional notes about this tag"
                            />
                        )}
                    </form.Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <form.Field
                            name="color"
                            validators={{
                                onChange: ({value}) => validateColor(value),
                            }}
                        >
                            {(field) => (
                                <TextField
                                    field={field}
                                    label="Color"
                                    type="color"
                                />
                            )}
                        </form.Field>

                        <form.Field name="type">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>Type</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(value) => field.handleChange(value as TagModel.TagType)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select tag type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(TagModel.TagType).map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <form.Field name="module">
                        {(field) => (
                            <div className="grid gap-2">
                                <Label htmlFor={field.name}>Module</Label>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(value) => field.handleChange(value as NixModule)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select module"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(NixModule).map((module) => (
                                            <SelectItem key={module} value={module}>
                                                {module}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </form.Field>

                    {createTag.error?.message ? (
                        <Alert variant="destructive">
                            <AlertTitle>Unable to create tag</AlertTitle>
                            <AlertDescription>{createTag.error.message}</AlertDescription>
                        </Alert>
                    ) : null}
                </form>

                <SheetFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button disabled={isSubmitting || createTag.isPending} onClick={() => void form.handleSubmit()}>
                        {isSubmitting || createTag.isPending ? "Creating..." : "Create tag"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
