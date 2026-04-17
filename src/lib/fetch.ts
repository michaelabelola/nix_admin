import type {ErrorHandlerType, FetchError} from "#/lib/request.types.tsx";
import {QueryStringUtil} from "#/lib/QueryStringUtil.ts";
import {useAuthenticatedUserStore} from '#/lib/authenticated-user.store'

const DEFAULT_AUTH_TOKEN_KEY = 'accessToken'

const apiUrl = import.meta.env.VITE_API_BASE_URL

type AuthFetchInit = RequestInit & {
    tokenKey?: string
}

function buildHeaders(headers?: HeadersInit) {
    return new Headers(headers)
}

function getStoredToken(tokenKey = DEFAULT_AUTH_TOKEN_KEY) {
    const authenticatedUser = useAuthenticatedUserStore.getState().user

    if (tokenKey === DEFAULT_AUTH_TOKEN_KEY && authenticatedUser?.accessToken) {
        return authenticatedUser.accessToken
    }

    if (typeof window === 'undefined') {
        return null
    }

    return window.localStorage.getItem(tokenKey)
}

interface RequestPromise<T, E = FetchError> extends Promise<T> {
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
                const resp1 = await resp.json()
                try {
                    const data = {
                        ...resp1,
                        message: resp1.detail,
                        _internal: internalFields
                    } as FetchError
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

    export type Req<B, Q = Record<string, string | number | boolean | undefined>> = {
        errHandler?: ErrorHandlerType
        query?: Q
    } & B
    export type ReqBody<B> = {
        errHandler?: ErrorHandlerType
        body?: B
    }

    export type FullReq<B, Q = Record<string, string | number | boolean | undefined>> = {
        errHandler?: ErrorHandlerType
        query?: Q
    } & B

    export type ReqQuery<B, Q = Record<string, string | number | boolean | undefined>> = {
        errHandler?: ErrorHandlerType
        query?: Q
    } & B

    export function apiFetch<T>(
        input: RequestInfo | URL,
        init?: Omit<RequestInit, 'body'> & {
            contentType?: string | "omit"
            errHandler?: ErrorHandlerType,
            body?: any,
            query?: Parameters<typeof QueryStringUtil.paramsToQueryString>[0]|Record<string, any>,
        }): RequestPromise<T> {
        var queryString = QueryStringUtil.paramsToQueryString(init?.query)
        if (!(input instanceof URL)) input = new URL(input.toString() + queryString, apiUrl)

        return new Promise<T>((resolve, reject) => {
            let header = {};
            if (init?.contentType !== "omit")
                header = !init?.contentType ? {"Content-Type": "application/json"} : {"Content-Type": init?.contentType}

            fetch(input, {
                ...init,
                headers: {...header, ...init?.headers}
            })
                .then(processResponse<T>(resolve, reject, init))
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
