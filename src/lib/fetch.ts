import type {ErrorHandlerType, FetchError} from "#/lib/request.types.tsx";

const DEFAULT_AUTH_TOKEN_KEY = 'accessToken'

const apiUrl = import.meta.env.VITE_API_BASE_URL

type AuthFetchInit = RequestInit & {
    tokenKey?: string
}

function buildHeaders(headers?: HeadersInit) {
    return new Headers(headers)
}

function getStoredToken(tokenKey = DEFAULT_AUTH_TOKEN_KEY) {
    if (typeof window === 'undefined') {
        return null
    }

    return window.localStorage.getItem(tokenKey)
}

interface RequestPromise<T, E = Error> extends Promise<T> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

    catch<TResult = never>(onrejected?: ((reason: E) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}

export namespace BACKEND {

    function processResponse<T>(
        resolve: Parameters<ConstructorParameters<typeof Promise>[0]>[0] | any,
        reject: Parameters<ConstructorParameters<typeof Promise>[0]>[1],
        init?: Parameters<typeof apiFetch>[1]) {
        return async (resp: Response) => {

            const internalFields = {
                status: resp.status,
                statusText: resp.statusText,
                headers: resp.headers,
                redirected: resp.redirected,
            }
            if (!resp.ok) {
                try {
                    const data = {...await resp.json(), _internal: internalFields} as FetchError
                    if (init?.errHandler) init.errHandler._errInit(data)
                    return reject(data)
                } catch {
                    const text = await resp.text()
                    return reject({internalFields: {...internalFields, body: text}})
                }
            }
            try {
                const data_1 = await resp.json() as T
                return resolve(data_1)
            } catch {
                const text_1 = await resp.text()
                return resolve(text_1 as any)
            }
        }
    }

    export type Req<T> = {
        errHandler?: ErrorHandlerType
        body?: T,
        params?: Record<string, string | number | boolean | undefined>
    }

    export function apiFetch<T>(
        input: RequestInfo | URL,
        init?: AuthFetchInit & {
            errHandler?: ErrorHandlerType
        }): RequestPromise<T> {

        if (!(input instanceof URL)) input = new URL(input.toString(), apiUrl)

        return new Promise<T>((resolve, reject) => {
            fetch(input, init)
                .then(processResponse<T>(resolve, resolve, init))
                .catch(reject)
        })

    }

    export function authFetch<T>(input: RequestInfo | URL,
                                 init?: AuthFetchInit & {
                                     errHandler?: ErrorHandlerType
                                 }) {
        return new Promise<T>((resolve, reject) => {
            return authFetchRaw(input, init)
                .then(processResponse<T>(resolve, resolve, init))
                .catch(reject)
        }) as RequestPromise<T, FetchError>
    }

    function authFetchRaw(input: RequestInfo | URL, init?: AuthFetchInit) {
        const {tokenKey = DEFAULT_AUTH_TOKEN_KEY, ...requestInit} = init ?? {}
        const headers = buildHeaders(requestInit.headers)
        const token = getStoredToken(tokenKey)

        if (token) headers.set('Authorization', `Bearer ${token}`)
        if (!(input instanceof URL))
            input = new URL(input.toString(), apiUrl)

        return fetch(input, {
            ...requestInit,
            headers,
        })
    }
}

export {DEFAULT_AUTH_TOKEN_KEY}
