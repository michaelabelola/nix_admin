import {useEffect} from "react";
import {useForm, useStore} from "@tanstack/react-form";
import {toast} from "sonner";

import {Alert, AlertDescription, AlertTitle} from "#/components/ui/alert.tsx";
import {Button} from "#/components/ui/button.tsx";
import {Checkbox} from "#/components/ui/checkbox.tsx";
import {Input} from "#/components/ui/input.tsx";
import {Label} from "#/components/ui/label.tsx";
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

import {PropertyFeatureRuleModel} from "@suiteonix/server";
import {PropertyFeatureRuleRequest} from "@suiteonix/server";

type FeatureRuleFormValues = {
    name: string
    description: string
    format: PropertyFeatureRuleModel.FieldFormat
    allowedPropType: PropertyFeatureRuleModel.AllowedPropType
    isAddon: boolean
    values: string
    tags: string
}

type FieldError = string | { message?: string }

const INITIAL_VALUES: FeatureRuleFormValues = {
    name: "",
    description: "",
    format: PropertyFeatureRuleModel.FieldFormat.TEXT,
    allowedPropType: PropertyFeatureRuleModel.AllowedPropType.CUSTOM,
    isAddon: false,
    values: "",
    tags: "",
}

function required(value: string, label: string) {
    if (!value.trim()) return `${label} is required`
    return undefined
}

function getErrorMessage(error: FieldError) {
    return typeof error === "string" ? error : error.message ?? "Invalid value"
}

function parseValues(value: string): PropertyFeatureRuleModel.FeatureRuleValue[] {
    return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [ruleValue, ...descriptionParts] = line.split("|")
            return {
                value: ruleValue?.trim() || null,
                description: descriptionParts.join("|").trim() || null,
            }
        })
        .filter((item) => item.value)
}

function parseTagIds(value: string) {
    return [...new Set(
        value
            .split(/[\s,\n]+/)
            .map((item) => item.trim())
            .filter(Boolean),
    )]
}

function TextField({
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
            <Input
                id={field.name}
                name={field.name}
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
    rows = 4,
    description,
}: {
    field: any
    label: string
    placeholder?: string
    rows?: number
    description?: string
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Textarea
                id={field.name}
                name={field.name}
                rows={rows}
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
            />
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
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

export function FeatureRuleCreateSheet({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const createFeatureRule = PropertyFeatureRuleRequest.useCreateFeatureRule(() => {
        toast.success("Feature rule created.")
        onOpenChange(false)
    })

    const form = useForm<FeatureRuleFormValues>({
        defaultValues: INITIAL_VALUES,
        onSubmit: async ({value}) => {
            await createFeatureRule.mutateAsync({
                name: value.name.trim(),
                description: value.description.trim() || undefined,
                format: value.format,
                allowedPropType: value.allowedPropType,
                isAddon: value.isAddon,
                values: parseValues(value.values),
                tags: parseTagIds(value.tags),
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
            <SheetContent className="sm:max-w-2xl">
                <SheetHeader>
                    <SheetTitle>Create Feature Rule</SheetTitle>
                    <SheetDescription>
                        Define a reusable property feature rule available to your real-estate workspace.
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
                                placeholder="Bedrooms"
                            />
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <TextAreaField
                                field={field}
                                label="Description"
                                placeholder="Describe when and how this feature should be used"
                            />
                        )}
                    </form.Field>

                    <div className="grid gap-4 md:grid-cols-2">
                        <form.Field name="format">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>Format</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(nextValue) =>
                                            field.handleChange(nextValue as PropertyFeatureRuleModel.FieldFormat)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select format"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(PropertyFeatureRuleModel.FieldFormat).map((format) => (
                                                <SelectItem key={format} value={format}>
                                                    {format}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="allowedPropType">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>Allowed Property Type</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(nextValue) =>
                                            field.handleChange(nextValue as PropertyFeatureRuleModel.AllowedPropType)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select property type behavior"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(PropertyFeatureRuleModel.AllowedPropType).map((type) => (
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

                    <form.Field name="isAddon">
                        {(field) => (
                            <label className="flex items-start gap-3 rounded-lg border p-3">
                                <Checkbox
                                    checked={field.state.value}
                                    onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                                />
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">Addon feature</div>
                                    <p className="text-sm text-muted-foreground">
                                        Enable this when the rule should behave like an optional addon instead of a core field.
                                    </p>
                                </div>
                            </label>
                        )}
                    </form.Field>

                    <form.Field name="values">
                        {(field) => (
                            <TextAreaField
                                field={field}
                                label="Allowed values"
                                rows={6}
                                placeholder={"studio|Studio apartment\nvilla|Villa"}
                                description="Use one value per line. Optionally add a description after a pipe character."
                            />
                        )}
                    </form.Field>

                    <form.Field name="tags">
                        {(field) => (
                            <TextAreaField
                                field={field}
                                label="Tag IDs"
                                rows={4}
                                placeholder="tag-id-one, tag-id-two"
                                description="Optional tag ids separated by commas, spaces, or line breaks."
                            />
                        )}
                    </form.Field>

                    {createFeatureRule.error?.message ? (
                        <Alert variant="destructive">
                            <AlertTitle>Unable to create feature rule</AlertTitle>
                            <AlertDescription>{createFeatureRule.error.message}</AlertDescription>
                        </Alert>
                    ) : null}

                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || createFeatureRule.isPending}>
                            Create rule
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
