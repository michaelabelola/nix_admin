export namespace QueryStringUtil {

    function fromRecord(params?: Record<string, string | number | boolean | undefined>): string {
        if (!params) return ''

        const entries = Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)

        return entries.length > 0 ? `?${entries.join('&')}` : ''
    }

    function fromTuples(params?: Array<[string, string | number | boolean | undefined]>): string {
        if (!params || params.length === 0) return ''

        const entries = params
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)

        return entries.length > 0 ? `?${entries.join('&')}` : ''
    }


    export function paramsToQueryString(params?: Record<string, string | number | boolean | undefined> | Array<[string, string | number | boolean | undefined]>): string {
        if (!params) return ''

        if (Array.isArray(params)) {
            return fromTuples(params)
        }

        return fromRecord(params)
    }


}