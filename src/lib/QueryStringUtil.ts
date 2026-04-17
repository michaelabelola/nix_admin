import type {PageRequest, SortParam} from "#/models/PagedModel.ts";

export namespace QueryStringUtil {

    function fromRecord(
        params?:
            Record<string, string | number | boolean | undefined>
            & PageRequest
    ): string {
        if (!params) return ''

        const entries = Object.entries(params)
            .filter(([key, value]) => value !== undefined && key !== undefined)
            .map(([key, value]) => {
                if (key !== "sort")
                    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`

                return (value as any as SortParam[])
                    .map((sort: SortParam) => {
                        return `sort=${sort.field},${sort.direction}`
                    }).join('&')
            })

        return entries.length > 0 ? `?${entries.join('&')}` : ''
    }

    function fromTuples(params?: Array<[string, string | number | boolean | undefined]>): string {
        if (!params || params.length === 0) return ''

        const entries = params
            .filter(([key, value]) => value !== undefined && key !== undefined)
            .map(([key, value]) => {
                if (key !== "sort")
                    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`

                return (value as any as SortParam[])
                    .map((sort: SortParam) => {
                        return `sort=${sort.field},${sort.direction}`
                    }).join('&')


            })

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