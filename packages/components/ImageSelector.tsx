import {useEffect, useId, useMemo, useRef, useState} from "react"
import {ImageIcon, Upload, X} from "lucide-react"
import type {ClassValue} from 'clsx'

import {cn} from "@suiteonix/utils";
import {Button} from "@suiteonix/ui";

const DEFAULT_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

function formatFileSize(bytes: number) {
    const megabytes = bytes / (1024 * 1024)
    return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`
}

export function ImageSelector({
                                  value,
                                  onChange,
                                  defaultImageUrl,
                                  accept = "image/*",
                                  maxSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
                                  disabled = false,
                                  className,
                                  imageClassName,
                                  cover = false,
                                  aspectRatio="VIDEO"
                              }: {
    value: File | null
    onChange: (value: File | null) => void
    defaultImageUrl?: string | null
    accept?: string
    maxSizeBytes?: number
    disabled?: boolean
    className?: ClassValue
    imageClassName?: ClassValue
    cover?: boolean
    aspectRatio?: "VIDEO" | "SQUARE"
}) {
    const inputId = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState("")
    const objectUrl = useMemo(() => value ? URL.createObjectURL(value) : null, [value])
    const previewUrl = objectUrl ?? defaultImageUrl ?? null

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [objectUrl])

    const clearSelection = () => {
        setError("")
        onChange(null)

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    return (
        <div className={cn("gap-3 overflow-hidden flex flex-col-reverse justify-center items-center w-full", className)}>
            <div className="relative overflow-hidden w-full rounded-lg mx-auto">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt=""
                        className={cn("aspect-video object-contain object-center w-full",
                            aspectRatio === "VIDEO"?"aspect-video":"",
                            aspectRatio === "SQUARE"?"aspect-square":"",
                            cover && "object-cover",
                            imageClassName)}
                    />
                ) : (
                    <div
                        className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-background">
                            <ImageIcon className="size-6"/>
                        </div>
                        <div className="text-sm font-medium">No image selected</div>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept}
                disabled={disabled}
                className="sr-only"
                onChange={(event) => {
                    const file = event.target.files?.[0] ?? null

                    if (file && file.size > maxSizeBytes) {
                        setError(`Select an image up to ${formatFileSize(maxSizeBytes)}.`)
                        onChange(null)
                        event.target.value = ""
                        return
                    }

                    setError("")
                    onChange(file)
                }}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center self-start">
                <Button type="button" variant="outline" asChild disabled={disabled}>
                    <label htmlFor={inputId}>
                        <Upload className="size-4"/>
                        {previewUrl ? "Change image" : "Select image"}
                    </label>
                </Button>

                {value ? (
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={disabled}
                        onClick={clearSelection}
                    >
                        <X className="size-4"/>
                        Clear selection
                    </Button>
                ) : null}

                {/*{value ? (*/}
                {/*    <span className="truncate text-sm text-muted-foreground">*/}
                {/*        {value.name}*/}
                {/*    </span>*/}
                {/*) : null}*/}
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    )
}
