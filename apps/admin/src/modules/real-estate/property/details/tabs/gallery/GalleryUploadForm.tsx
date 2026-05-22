import type {FormEvent} from "react";
import {AlertCircle, Upload} from "lucide-react";

import {Alert, AlertDescription, AlertTitle} from "#/components/ui/alert.tsx";
import {Button} from "#/components/ui/button.tsx";
import {Input} from "#/components/ui/input.tsx";
import {Label} from "#/components/ui/label.tsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "#/components/ui/sheet.tsx";
import {Spinner} from "#/components/ui/spinner.tsx";
import {Textarea} from "#/components/ui/textarea.tsx";

export type GalleryUploadFormState = {
    description: string
    errorMessage?: string
    file: File | null
    fileInputKey: number
    isPending: boolean
    name: string
    open?: boolean
    onDescriptionChange: (value: string) => void
    onFileChange: (file: File | null) => void
    onNameChange: (value: string) => void
    onOpenChange?: (open: boolean) => void
    onReset: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
};

export function GalleryUploadForm({
    description,
    errorMessage,
    file,
    fileInputKey,
    isPending,
    name,
    open = false,
    onDescriptionChange,
    onFileChange,
    onNameChange,
    onOpenChange = () => undefined,
    onReset,
    onSubmit,
}: GalleryUploadFormState) {
    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            onReset();
        }

        onOpenChange(nextOpen);
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Upload gallery file</SheetTitle>
                    <SheetDescription>
                        Add a file to this property gallery. New uploads appear first.
                    </SheetDescription>
                </SheetHeader>

                <form className="grid gap-4 px-4 pb-4" onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="property-gallery-upload-file">File</Label>
                            <Input
                                key={fileInputKey}
                                id="property-gallery-upload-file"
                                type="file"
                                onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                                disabled={isPending}
                            />
                            <p className="text-sm text-muted-foreground">
                                {file ? `Selected file: ${file.name}` : "Choose a file to upload."}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="property-gallery-upload-name">Name</Label>
                            <Input
                                id="property-gallery-upload-name"
                                value={name}
                                placeholder="Defaults to the selected file name"
                                onChange={(event) => onNameChange(event.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="property-gallery-upload-description">Description</Label>
                        <Textarea
                            id="property-gallery-upload-description"
                            value={description}
                            placeholder="Optional description"
                            className="min-h-24"
                            onChange={(event) => onDescriptionChange(event.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    {errorMessage ? (
                        <Alert variant="destructive">
                            <AlertCircle/>
                            <AlertTitle>Upload failed</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    ) : null}

                    <SheetFooter className="px-0">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!file || isPending}>
                            {isPending ? (
                                <>
                                    <Spinner className="size-4"/>
                                    Uploading
                                </>
                            ) : (
                                <>
                                    <Upload className="size-4"/>
                                    Upload file
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
