import {useEffect, useMemo, useState} from "react";
import {toast} from "sonner";

import {Button} from "#/components/ui/button.tsx";
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
import {ObjectVisibility} from "#/models/PagedModel.ts";
import {PropertyFeatureApiHook} from "#/modules/real-estate/property-feature/api.hook.ts";
import {PropertyFeatureModel} from "#/modules/real-estate/property-feature/model.ts";
import type {PropertyModel} from "#/modules/real-estate/property/model.ts";
import {PropertyFeatureRuleRequest} from "#/modules/real-estate/property-feature-rule/request.hook.ts";

type PropertyFeatureFormState = {
    name: string
    description: string
    format: PropertyFeatureModel.FieldFormat
    value: string
    unit: string
    featureRuleId: string
}

const INITIAL_FORM_STATE: PropertyFeatureFormState = {
    name: "",
    description: "",
    format: PropertyFeatureModel.FieldFormat.TEXT,
    value: "",
    unit: "",
    featureRuleId: "__none__",
}

function getDefaultValuePlaceholder(format: PropertyFeatureModel.FieldFormat) {
    switch (format) {
        case PropertyFeatureModel.FieldFormat.BOOLEAN:
            return "Select true or false"
        case PropertyFeatureModel.FieldFormat.NUMBER:
            return "1200"
        case PropertyFeatureModel.FieldFormat.MONEY:
            return "2500"
        case PropertyFeatureModel.FieldFormat.TIME:
            return "09:00"
        case PropertyFeatureModel.FieldFormat.LONG_TEXT:
            return "Add detailed feature notes"
        case PropertyFeatureModel.FieldFormat.TEXT:
        default:
            return "Feature value"
    }
}

export function PropertyFeatureCreateSheet({
    property,
    open,
    onOpenChange,
}: {
    property?: PropertyModel.Detailed
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [formState, setFormState] = useState<PropertyFeatureFormState>(INITIAL_FORM_STATE)
    const createFeature = PropertyFeatureApiHook.useCreatePropertyFeature(() => {
        toast.success("Feature created.")
        resetAndClose()
    })
    const featureRulesQuery = PropertyFeatureRuleRequest.useQueryFeatureRules({
        page: 0,
        size: 100,
        show: ObjectVisibility.ENTITY_AND_SYSTEM,
    })
    const featureRules = featureRulesQuery.data?.content ?? []
    const selectedRule = useMemo(
        () => featureRules.find((rule) => rule.id === formState.featureRuleId),
        [featureRules, formState.featureRuleId],
    )

    useEffect(() => {
        if (selectedRule) {
            setFormState((prev) => ({
                ...prev,
                name: prev.name || selectedRule.name || "",
                description: prev.description || selectedRule.description || "",
                format: selectedRule.format
                    ? selectedRule.format as unknown as PropertyFeatureModel.FieldFormat
                    : prev.format,
            }))
        }
    }, [selectedRule])

    function resetForm() {
        setFormState(INITIAL_FORM_STATE)
    }

    function resetAndClose() {
        resetForm()
        onOpenChange(false)
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            resetForm()
        }

        onOpenChange(nextOpen)
    }

    function updateField<K extends keyof PropertyFeatureFormState>(key: K, value: PropertyFeatureFormState[K]) {
        setFormState((prev) => ({...prev, [key]: value}))
    }

    function handleFeatureRuleChange(nextValue: string) {
        const nextRule = featureRules.find((rule) => rule.id === nextValue)

        setFormState((prev) => ({
            ...prev,
            featureRuleId: nextValue,
            name: nextValue === "__none__" ? prev.name : nextRule?.name || prev.name,
            description: nextValue === "__none__" ? prev.description : nextRule?.description || prev.description,
            format: nextValue === "__none__"
                ? prev.format
                : nextRule?.format
                    ? nextRule.format as unknown as PropertyFeatureModel.FieldFormat
                    : prev.format,
        }))
    }

    function handleCreate() {
        if (!property?.id) return

        void createFeature.mutateAsync({
            propertyId: property.id,
            body: {
                name: formState.name.trim() || undefined,
                description: formState.description.trim() || undefined,
                format: formState.format,
                value: formState.value.trim() || undefined,
                unit: formState.unit.trim() || undefined,
                featureRuleId: formState.featureRuleId === "__none__" ? undefined : formState.featureRuleId,
            },
        })
    }

    const isCreateDisabled =
        !property?.id ||
        !formState.name.trim() ||
        createFeature.isPending

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Add Property Feature</SheetTitle>
                    <SheetDescription>
                        Create a feature record for this property and optionally base it on an existing feature rule.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 px-4 pb-4">
                    <div className="grid gap-2">
                        <Label htmlFor="property-feature-rule">Feature rule</Label>
                        <Select
                            value={formState.featureRuleId}
                            onValueChange={handleFeatureRuleChange}
                        >
                            <SelectTrigger id="property-feature-rule" className="w-full">
                                <SelectValue placeholder="Select feature rule"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">No rule</SelectItem>
                                {featureRules.map((rule) => (
                                    <SelectItem key={rule.id} value={rule.id}>
                                        {rule.name || "Unnamed rule"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="property-feature-name">Name</Label>
                        <Input
                            id="property-feature-name"
                            value={formState.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Bedrooms"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="property-feature-description">Description</Label>
                        <Textarea
                            id="property-feature-description"
                            value={formState.description}
                            onChange={(event) => updateField("description", event.target.value)}
                            placeholder="Short context about this feature"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="property-feature-format">Format</Label>
                            <Select
                                value={formState.format}
                                onValueChange={(value) => updateField("format", value as PropertyFeatureModel.FieldFormat)}
                            >
                                <SelectTrigger id="property-feature-format" className="w-full">
                                    <SelectValue placeholder="Select format"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(PropertyFeatureModel.FieldFormat).map((format) => (
                                        <SelectItem key={format} value={format}>
                                            {format}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="property-feature-unit">Unit</Label>
                            <Input
                                id="property-feature-unit"
                                value={formState.unit}
                                onChange={(event) => updateField("unit", event.target.value)}
                                placeholder={formState.format === PropertyFeatureModel.FieldFormat.MONEY ? "USD" : "sq ft"}
                            />
                        </div>
                    </div>

                    <FeatureValueField
                        format={formState.format}
                        value={formState.value}
                        onValueChange={(value) => updateField("value", value)}
                    />
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={resetAndClose}>
                        Cancel
                    </Button>
                    <Button disabled={isCreateDisabled} onClick={handleCreate}>
                        {createFeature.isPending ? "Creating..." : "Create feature"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function FeatureValueField({
    format,
    value,
    onValueChange,
}: {
    format: PropertyFeatureModel.FieldFormat
    value: string
    onValueChange: (value: string) => void
}) {
    if (format === PropertyFeatureModel.FieldFormat.BOOLEAN) {
        return (
            <div className="grid gap-2">
                <Label htmlFor="property-feature-value">Value</Label>
                <Select value={value || "__unset__"} onValueChange={(nextValue) => onValueChange(nextValue === "__unset__" ? "" : nextValue)}>
                    <SelectTrigger id="property-feature-value" className="w-full">
                        <SelectValue placeholder={getDefaultValuePlaceholder(format)}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__unset__">Not set</SelectItem>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        )
    }

    if (format === PropertyFeatureModel.FieldFormat.LONG_TEXT) {
        return (
            <div className="grid gap-2">
                <Label htmlFor="property-feature-value">Value</Label>
                <Textarea
                    id="property-feature-value"
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    placeholder={getDefaultValuePlaceholder(format)}
                    rows={5}
                />
            </div>
        )
    }

    return (
        <div className="grid gap-2">
            <Label htmlFor="property-feature-value">Value</Label>
            <Input
                id="property-feature-value"
                type={format === PropertyFeatureModel.FieldFormat.NUMBER || format === PropertyFeatureModel.FieldFormat.MONEY ? "number" : format === PropertyFeatureModel.FieldFormat.TIME ? "time" : "text"}
                min={format === PropertyFeatureModel.FieldFormat.NUMBER || format === PropertyFeatureModel.FieldFormat.MONEY ? "0" : undefined}
                step={format === PropertyFeatureModel.FieldFormat.NUMBER || format === PropertyFeatureModel.FieldFormat.MONEY ? "0.01" : undefined}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={getDefaultValuePlaceholder(format)}
            />
        </div>
    )
}
