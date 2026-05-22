import {RefreshCw, Search, X} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {Input} from "#/components/ui/input.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import {cn} from "#/lib/utils.ts"

import {defaultParseValue, defaultSerializeValue} from "./search-state.ts"
import type {DataTableRequestBase, DataTableToolbarProps} from "./types.ts"
import {getFilterValue} from "./types.ts"
import {QuickToolTip} from "#/components/ui/tooltip.tsx";

export function DataTableToolbar<TRequest extends DataTableRequestBase>({
                                                                            filterFields,
                                                                            request,
                                                                            searchDraft,
                                                                            textFilterDrafts,
                                                                            searchPlaceholder,
                                                                            toolbarActions,
                                                                            isFetching,
                                                                            onSearchDraftChange,
                                                                            onTextFilterDraftChange,
                                                                            onSelectFilterChange,
                                                                            onRefresh,
                                                                            onClear,
                                                                        }: DataTableToolbarProps<TRequest>) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative min-w-0">
                    <Search
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        value={searchDraft}
                        onChange={(event) => onSearchDraftChange(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="pl-9"
                        aria-label="Search table"
                    />
                </div>
                {filterFields?.map((field) => {
                    if (field.type === "select") {
                        const rawValue = getFilterValue(request, field.key)
                        const value = field.serializeValue
                            ? field.serializeValue(rawValue)
                            : defaultSerializeValue(rawValue)

                        return (
                            <Select
                                key={field.key}
                                value={value || "__all__"}
                                onValueChange={(nextValue) => onSelectFilterChange(field, nextValue)}
                            >
                                <SelectTrigger className="min-w-0">
                                    <SelectValue placeholder={field.placeholder ?? field.label ?? field.key}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">All</SelectItem>
                                    {field.options?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )
                    }

                    return (
                        <Input
                            key={field.key}
                            value={textFilterDrafts[field.key] ?? ""}
                            onChange={(event) =>
                                onTextFilterDraftChange(field.key, event.target.value)
                            }
                            placeholder={field.placeholder ?? field.label ?? field.key}
                            aria-label={field.label ?? field.key}
                        />
                    )
                })}
            </div>
            <div className="flex items-center justify-end gap-2">
                {toolbarActions}
                <QuickToolTip asChild content="Refresh">
                    <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={onRefresh}
                        disabled={isFetching}
                        className={cn(isFetching && "text-warning border-warning cursor-not-allowed bg-transparent")}
                    >
                        <RefreshCw className={cn("size-4", isFetching && "animate-spin text-warning")}/>
                    </Button>
                </QuickToolTip>
                <QuickToolTip asChild content="Clear filters and search">
                    <Button type="button" variant="ghost" size="xs"
                            className={"text-destructive hover:bg-destructive hover:text-destructive-foreground"}
                            onClick={onClear}>
                        <X className="size-4"/>
                    </Button>
                </QuickToolTip>
            </div>
        </div>
    )
}

export {defaultParseValue}
