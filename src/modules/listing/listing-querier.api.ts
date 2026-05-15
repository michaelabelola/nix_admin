import {Backend, type RequestHelperInit} from "#/lib/fetch.ts"
import {PageUtil} from "#/models/PagedModel.ts"

import type {ListingModel} from "./model.ts"
import type {ListingQuerierModel} from "./listing-querier.model.ts"

class ListingQuerierApi {
    queryListingProperties(
        listingId: ListingModel.ListingID,
        params?: ListingQuerierModel.Request,
        init?: Partial<RequestHelperInit>,
    ) {
        const query = buildListingPropertiesQuery(params)

        return Backend.authRequest<ListingQuerierModel.PageSlice<ListingQuerierModel.Response>>(
            `/${listingId}/query/real-estate/properties?${query.toString()}`,
            init,
        )
    }
}

const listingQuerierApi = new ListingQuerierApi()

export default listingQuerierApi

const appendIfDefined = (query: URLSearchParams, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return
    query.append(key, String(value))
}

const appendRange = <T,>(query: URLSearchParams, key: string, range?: ListingQuerierModel.RangeQuery<T>) => {
    if (!range) return
    appendIfDefined(query, `${key}.start`, range.start)
    appendIfDefined(query, `${key}.end`, range.end)
    appendIfDefined(query, `${key}.value`, range.value)
}

const appendMoneyRange = (
    query: URLSearchParams,
    key: string,
    range?: ListingQuerierModel.Request["price"],
) => {
    if (!range) return
    appendRange(query, `${key}.amount`, range.amount)
    appendIfDefined(query, `${key}.currencyCode`, range.currencyCode)
}

const appendLocationQuery = (
    query: URLSearchParams,
    location?: ListingQuerierModel.LocationQuery,
) => {
    if (!location) return
    appendIfDefined(query, "location.city", location.city)
    appendIfDefined(query, "location.state", location.state)
    appendIfDefined(query, "location.postalCode", location.postalCode)
    appendIfDefined(query, "location.country", location.country)
    appendIfDefined(query, "location.loc_lat", location.loc_lat)
    appendIfDefined(query, "location.loc_long", location.loc_long)
    appendIfDefined(query, "location.nearest", location.nearest)
}

const appendRentOrLeaseQuery = (
    query: URLSearchParams,
    key: "rent" | "lease",
    value?: ListingQuerierModel.RentQuery | ListingQuerierModel.LeaseQuery,
) => {
    if (!value) return
    appendRange(query, `${key}.amount`, value.amount)
    appendIfDefined(query, `${key}.currencyCode`, value.currencyCode)
    appendRange(query, `${key}.duration`, value.duration)
    appendIfDefined(query, `${key}.durationUnit`, value.durationUnit)
}

const appendListQueries = (
    query: URLSearchParams,
    params?: Pick<ListingQuerierModel.Request, "tags" | "feature">,
) => {
    params?.tags?.forEach((tag, index) => {
        appendIfDefined(query, `tags[${index}].id`, tag.id)
        appendIfDefined(query, `tags[${index}].name`, tag.name)
    })
    params?.feature?.forEach((feature, index) => {
        appendIfDefined(query, `feature[${index}].format`, feature.format)
        appendIfDefined(query, `feature[${index}].value`, feature.value)
        appendIfDefined(query, `feature[${index}].unit`, feature.unit)
    })
}

const appendAuditQuery = (
    query: URLSearchParams,
    audit?: ListingQuerierModel.Request["audit"],
) => {
    if (!audit) return
    appendIfDefined(query, "audit.createdBy", audit.createdBy)
    appendRange(query, "audit.createdDate", audit.createdDate)
    appendRange(query, "audit.modifiedDate", audit.modifiedDate)
}

function buildListingPropertiesQuery(params?: ListingQuerierModel.Request) {
    const query = PageUtil.appendRequestToParam(params)

    if (!params) return query

    appendIfDefined(query, "name", params.name)
    appendIfDefined(query, "about", params.about)
    appendIfDefined(query, "type", params.type)
    appendIfDefined(query, "entityID", params.entityID)
    appendIfDefined(query, "listingID", params.listingID)
    appendIfDefined(query, "show", params.show)
    appendLocationQuery(query, params.location)
    appendMoneyRange(query, "price", params.price)
    appendRentOrLeaseQuery(query, "rent", params.rent)
    appendRentOrLeaseQuery(query, "lease", params.lease)
    appendListQueries(query, params)
    appendAuditQuery(query, params.audit)

    return query
}
