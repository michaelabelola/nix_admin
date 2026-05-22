/// <reference types="bun" />
export async function GET({params}: { params: { path: string[] } }) {
    try {
        // Rebuild the S3 key from the URL
        const key = params.path.join("/");
        // e.g. /nix_storage/can/avatar.png → "can/avatar.png"

        const file = Bun.s3.file(key);

        // Optional: check existence
        const exists = await file.exists();
        if (!exists) {
            return new Response("Not found", {status: 404});
        }

        // Infer or read content type
        const contentType =
            file.type || inferContentType(key) || "application/octet-stream";

        // Stream file to client (no buffering)
        return new Response(file.stream(), {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal error", {status: 500});
    }
}

function inferContentType(key: string) {
    if (key.endsWith(".png")) return "image/png";
    if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
    if (key.endsWith(".webp")) return "image/webp";
    if (key.endsWith(".gif")) return "image/gif";
    if (key.endsWith(".svg")) return "image/svg+xml";
    return null;
}