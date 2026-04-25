import {createServer} from "node:http"
import {createReadStream} from "node:fs"
import {stat} from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {Readable} from "node:stream"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const clientRoot = path.join(__dirname, "dist", "client")
const serverEntry = await import("./dist/server/server.js")
const app = serverEntry.default

const MIME_TYPES = new Map([
    [".css", "text/css; charset=utf-8"],
    [".gif", "image/gif"],
    [".html", "text/html; charset=utf-8"],
    [".ico", "image/x-icon"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".js", "text/javascript; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".mjs", "text/javascript; charset=utf-8"],
    [".png", "image/png"],
    [".svg", "image/svg+xml"],
    [".txt", "text/plain; charset=utf-8"],
    [".webp", "image/webp"],
    [".woff", "font/woff"],
    [".woff2", "font/woff2"],
])

const HOST = process.env.HOST || "0.0.0.0"
const PORT = Number(process.env.PORT || 3000)

function getMimeType(filePath) {
    return MIME_TYPES.get(path.extname(filePath).toLowerCase()) || "application/octet-stream"
}

function toWebHeaders(headers) {
    const result = new Headers()

    for (const [key, value] of Object.entries(headers)) {
        if (value == null) continue

        if (Array.isArray(value)) {
            for (const entry of value) {
                result.append(key, entry)
            }
            continue
        }

        result.append(key, value)
    }

    return result
}

function createRequest(req) {
    const origin = `http://${req.headers.host || `${HOST}:${PORT}`}`
    const url = new URL(req.url || "/", origin)
    const method = req.method || "GET"
    const headers = toWebHeaders(req.headers)
    const body = method === "GET" || method === "HEAD"
        ? undefined
        : Readable.toWeb(req)

    return new Request(url, {
        method,
        headers,
        body,
        duplex: body ? "half" : undefined,
    })
}

async function findStaticFile(pathname) {
    const normalizedPath = pathname === "/" ? "" : pathname.replace(/^\/+/, "")
    const resolvedPath = path.resolve(clientRoot, normalizedPath)

    if (!resolvedPath.startsWith(clientRoot)) {
        return null
    }

    try {
        const fileStat = await stat(resolvedPath)
        if (!fileStat.isFile()) return null
        return resolvedPath
    } catch {
        return null
    }
}

async function serveStaticFile(filePath, res) {
    const fileStat = await stat(filePath)
    res.statusCode = 200
    res.setHeader("Content-Type", getMimeType(filePath))
    res.setHeader("Content-Length", fileStat.size)

    await new Promise((resolve, reject) => {
        const stream = createReadStream(filePath)
        stream.on("error", reject)
        res.on("finish", resolve)
        res.on("error", reject)
        stream.pipe(res)
    })
}

async function sendFetchResponse(fetchResponse, res) {
    res.statusCode = fetchResponse.status
    res.statusMessage = fetchResponse.statusText

    fetchResponse.headers.forEach((value, key) => {
        res.setHeader(key, value)
    })

    if (!fetchResponse.body) {
        res.end()
        return
    }

    await new Promise((resolve, reject) => {
        const stream = Readable.fromWeb(fetchResponse.body)
        stream.on("error", reject)
        res.on("finish", resolve)
        res.on("error", reject)
        stream.pipe(res)
    })
}

const server = createServer(async (req, res) => {
    try {
        const pathname = new URL(req.url || "/", `http://${req.headers.host || `${HOST}:${PORT}`}`).pathname
        const staticFile = await findStaticFile(pathname)

        if (staticFile) {
            await serveStaticFile(staticFile, res)
            return
        }

        const request = createRequest(req)
        const response = await app.fetch(request)
        await sendFetchResponse(response, res)
    } catch (error) {
        console.error(error)
        res.statusCode = 500
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.end("Internal Server Error")
    }
})

server.listen(PORT, HOST, () => {
    console.log(`admin-ui listening on http://${HOST}:${PORT}`)
})
