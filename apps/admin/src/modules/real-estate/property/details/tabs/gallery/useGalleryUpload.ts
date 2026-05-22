import {type FormEvent, useEffect, useState} from "react";
import {toast} from "sonner";

import {FilesStorageRequest} from "@suiteonix/server";
import type {FilesStorageModel} from "@suiteonix/server";

import type {GalleryUploadFormState} from "./GalleryUploadForm.tsx";

export function useGalleryUpload(
    storageId: FilesStorageModel.FilesStorageID | null,
    onUploaded: () => void,
): GalleryUploadFormState {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    const addStorageFile = FilesStorageRequest.useAddStorageFile(() => {
        toast.success("Gallery file uploaded.");
        reset();
        onUploaded();
    });

    useEffect(() => {
        reset();
    }, [storageId]);

    function reset() {
        setName("");
        setDescription("");
        setFile(null);
        setFileInputKey((current) => current + 1);
    }

    const handleFileChange = (nextFile: File | null) => {
        setFile(nextFile);

        if (nextFile && !name.trim()) {
            setName(nextFile.name);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!storageId || !file) return;

        try {
            await addStorageFile.mutateAsync({
                storageId,
                body: {
                    name: name.trim() || file.name,
                    description: description.trim() || undefined,
                    file,
                },
            });
        } catch {
            // Error state is rendered by the form.
        }
    };

    return {
        description,
        errorMessage: addStorageFile.error?.message || undefined,
        file,
        fileInputKey,
        isPending: addStorageFile.isPending,
        name,
        onDescriptionChange: setDescription,
        onFileChange: handleFileChange,
        onNameChange: setName,
        onReset: reset,
        onSubmit: handleSubmit,
    };
}
