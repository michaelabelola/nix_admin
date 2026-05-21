import {useMemo, useState} from "react"
import {Search, X} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import {NixModule} from "#/models/Models.ts"
import {ObjectVisibility} from "#/models/PagedModel.ts"
import {TagModel} from "#/modules/tags/model.ts"
import {TagRequest} from "#/modules/tags/request.hook.ts"

const ANY_MODULE = "__any_module__"
const ANY_TYPE = "__any_type__"

export type TagPickerProps = {
    value: TagModel.TagID[]
    onChange: (value: TagModel.TagID[]) => void
    placeholder?: string
    disabled?: boolean
    defaultModule?: NixModule
    show?: ObjectVisibility
}

function tagLabel(tag?: TagModel.Tag | null) {
    return tag?.name?.trim() || tag?.id || ""
}

export function TagPicker({
                              value,
                              onChange,
                              placeholder = "Search tags",
                              disabled = false,
                              defaultModule = NixModule.REAL_ESTATE,
                              show = ObjectVisibility.ENTITY_AND_SYSTEM,
                          }: TagPickerProps) {
    const [query, setQuery] = useState("")
    const [module, setModule] = useState<string>(defaultModule)
    const [type, setType] = useState<string>(ANY_TYPE)

    const selectedTagsQuery = TagRequest.useGetTagsBatch(value)
    const tagsQuery = TagRequest.useQueryTagsFts({
        page: 0,
        size: 40,
        query: query.trim() || undefined,
        module: module === ANY_MODULE ? undefined : module as NixModule,
        type: type === ANY_TYPE ? undefined : type as TagModel.TagType,
        show,
    })

    const selectedTagMap = useMemo(
        () => new Map(selectedTagsQuery.data.map((tag) => [tag.id, tag])),
        [selectedTagsQuery.data],
    )
    const availableTags = useMemo(
        () => tagsQuery.data.content.filter((tag) => !value.includes(tag.id)),
        [tagsQuery.data.content, value],
    )

    const addTag = (tag?: TagModel.Tag | null) => {
        if (!tag || value.includes(tag.id)) return

        onChange([...value, tag.id])
        setQuery("")
    }

    const removeTag = (tagId: TagModel.TagID) => {
        onChange(value.filter((item) => item !== tagId))
    }

    return (
        <div className="grid gap-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
                <Combobox<TagModel.Tag>
                    items={availableTags}
                    value={null}
                    inputValue={query}
                    itemToStringLabel={(tag) => tagLabel(tag) || "Untitled tag"}
                    itemToStringValue={(tag) => tag.id}
                    onInputValueChange={setQuery}
                    onValueChange={addTag}
                >
                    <ComboboxInput
                        disabled={disabled}
                        placeholder={placeholder}
                        showClear={Boolean(query)}
                        className="w-full"
                    >
                        <Search className="size-4 text-muted-foreground"/>
                    </ComboboxInput>
                    <ComboboxContent>
                        <ComboboxEmpty>No matching tags.</ComboboxEmpty>
                        <ComboboxList>
                            {availableTags.map((tag) => (
                                <ComboboxItem key={tag.id} value={tag}>
                                    <div className="min-w-0">
                                        <div className="truncate font-medium">{tagLabel(tag) || "Untitled tag"}</div>
                                        <div className="truncate text-xs text-muted-foreground">
                                            {[tag.module, tag.type, tag.description?.trim()].filter(Boolean).join(" · ")}
                                        </div>
                                    </div>
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>

                <Select value={module} onValueChange={setModule} disabled={disabled}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Module"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ANY_MODULE}>All modules</SelectItem>
                        {Object.values(NixModule).map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={type} onValueChange={setType} disabled={disabled}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ANY_TYPE}>All types</SelectItem>
                        {Object.values(TagModel.TagType).map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {value.length ? (
                <div className="flex flex-wrap gap-2">
                    {value.map((tagId) => {
                        const tag = selectedTagMap.get(tagId)

                        return (
                            <Badge key={tagId} variant="secondary" className="gap-2 py-1 pr-1">
                                {tag?.colorHex ? (
                                    <span className="size-2 rounded-full" style={{backgroundColor: tag.colorHex}}/>
                                ) : null}
                                <span>{tag ? (tagLabel(tag) || "Untitled tag") : tagId}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    className="size-5"
                                    disabled={disabled}
                                    onClick={() => removeTag(tagId)}
                                >
                                    <X className="size-3"/>
                                </Button>
                            </Badge>
                        )
                    })}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No tags selected.</p>
            )}
        </div>
    )
}
