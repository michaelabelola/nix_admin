import {Backend, type RequestHelperInit} from "../utils"
import type {ResponseDto} from "@suiteonix/models"
import type {Paged} from "@suiteonix/models"
import {PageUtil} from "@suiteonix/models"
import type {CustomerModel} from "./model.ts"
import type {TagModel} from "../tags/model.ts"

class CustomerApi {
    query(params?: CustomerModel.Query, init?: Partial<RequestHelperInit>) {
        const query = PageUtil.appendRequestToParam(params)
        appendCustomerQueryParams(query, params)

        return Backend.authRequest<Paged<CustomerModel.Customer>>(`/customers?${query.toString()}`, init)
    }

    getById(customerId: CustomerModel.CustomerID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}`, init)
    }

    getDetailed(customerId: CustomerModel.CustomerID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}/detailed`, init)
    }

    create(body: CustomerModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>("/customer", {
            method: "POST",
            body,
            ...init,
        })
    }

    createSelfAccount(body: CustomerModel.SelfCreate, init?: Partial<RequestHelperInit>) {
        return Backend.request<CustomerModel.Detailed>("/customer/self", {
            method: "POST",
            body: {
                ...body,
                contact: body.contact ?? {},
            },
            ...init,
        })
    }

    update(customerId: CustomerModel.CustomerID, body: CustomerModel.Update, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    updateContact(customerId: CustomerModel.CustomerID, body: CustomerModel.Contact, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}/contact`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    updateBillingAddress(customerId: CustomerModel.CustomerID, body: CustomerModel.Address, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}/billing-address`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    updateShippingAddress(customerId: CustomerModel.CustomerID, body: CustomerModel.Address, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}/shipping-address`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    updatePreferences(customerId: CustomerModel.CustomerID, body: CustomerModel.Preferences, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}/preferences`, {
            method: "PATCH",
            body,
            ...init,
        })
    }

    initializeFilesStorage(customerId: CustomerModel.CustomerID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<CustomerModel.Detailed>(`/customer/${customerId}/files-storage`, {
            method: "POST",
            ...init,
        })
    }

    delete(customerId: CustomerModel.CustomerID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/customer/${customerId}`, {
            method: "DELETE",
            ...init,
        })
    }

    getTags(customerId: CustomerModel.CustomerID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<TagModel.Tag[]>(`/customer/${customerId}/tags`, init)
    }

    addTag(customerId: CustomerModel.CustomerID, tagId: TagModel.TagID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<TagModel.Tag>(`/customer/${customerId}/tag/${tagId}`, {
            method: "POST",
            ...init,
        })
    }

    removeTag(customerId: CustomerModel.CustomerID, tagId: TagModel.TagID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ResponseDto<void>>(`/customer/${customerId}/tag/${tagId}`, {
            method: "DELETE",
            ...init,
        })
    }
}

const customerApi = new CustomerApi()
export default customerApi

const appendIfDefined = (query: URLSearchParams, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return
    query.append(key, String(value))
}

const appendRange = <T, >(query: URLSearchParams, key: string, range?: CustomerModel.RangedQuery<T>) => {
    if (!range) return
    appendIfDefined(query, `${key}.start`, range.start)
    appendIfDefined(query, `${key}.end`, range.end)
    appendIfDefined(query, `${key}.value`, range.value)
}

const appendAddressQuery = (
    query: URLSearchParams,
    key: "billingAddress" | "shippingAddress",
    address?: CustomerModel.AddressQuery,
) => {
    if (!address) return
    appendIfDefined(query, `${key}.id`, address.id)
    appendIfDefined(query, `${key}.label`, address.label)
    appendIfDefined(query, `${key}.line1`, address.line1)
    appendIfDefined(query, `${key}.line2`, address.line2)
    appendIfDefined(query, `${key}.city`, address.city)
    appendIfDefined(query, `${key}.state`, address.state)
    appendIfDefined(query, `${key}.province`, address.province)
    appendIfDefined(query, `${key}.postalCode`, address.postalCode)
    appendIfDefined(query, `${key}.country`, address.country)
    appendRange(query, `${key}.latitude`, address.latitude)
    appendRange(query, `${key}.longitude`, address.longitude)
}

const appendCustomerQueryParams = (query: URLSearchParams, params?: CustomerModel.Query) => {
    if (!params) return

    appendIfDefined(query, "id", params.id)
    appendIfDefined(query, "customerNumber", params.customerNumber)
    appendIfDefined(query, "externalId", params.externalId)
    appendIfDefined(query, "status", params.status)
    appendIfDefined(query, "type", params.type)
    appendIfDefined(query, "lifecycleStage", params.lifecycleStage)
    appendIfDefined(query, "language", params.language)
    appendIfDefined(query, "timezone", params.timezone)
    appendIfDefined(query, "entityID", params.entityID)
    appendIfDefined(query, "show", params.show)

    params.tags?.forEach((tag) => appendIfDefined(query, "tags", tag))
    params.segments?.forEach((segment) => appendIfDefined(query, "segments", segment))

    if (params.personalDetail) {
        appendIfDefined(query, "personalDetail.firstName", params.personalDetail.firstName)
        appendIfDefined(query, "personalDetail.middleName", params.personalDetail.middleName)
        appendIfDefined(query, "personalDetail.lastName", params.personalDetail.lastName)
        appendIfDefined(query, "personalDetail.title", params.personalDetail.title)
        appendIfDefined(query, "personalDetail.gender", params.personalDetail.gender)
        appendRange(query, "personalDetail.dateOfBirth", params.personalDetail.dateOfBirth)
        appendIfDefined(query, "personalDetail.nationality", params.personalDetail.nationality)
        appendIfDefined(query, "personalDetail.passportNumber", params.personalDetail.passportNumber)
        appendIfDefined(query, "personalDetail.nationalID", params.personalDetail.nationalID)
        appendIfDefined(query, "personalDetail.maritalStatus", params.personalDetail.maritalStatus)
        appendIfDefined(query, "personalDetail.mothersMaidenName", params.personalDetail.mothersMaidenName)
        appendIfDefined(query, "personalDetail.countryOfBirth", params.personalDetail.countryOfBirth)
        appendIfDefined(query, "personalDetail.profession", params.personalDetail.profession)
    }

    if (params.businessDetail) {
        appendIfDefined(query, "businessDetail.companyName", params.businessDetail.companyName)
        appendIfDefined(query, "businessDetail.registrationNumber", params.businessDetail.registrationNumber)
        appendIfDefined(query, "businessDetail.taxID", params.businessDetail.taxID)
        appendIfDefined(query, "businessDetail.industry", params.businessDetail.industry)
        appendRange(query, "businessDetail.companySize", params.businessDetail.companySize)
        appendIfDefined(query, "businessDetail.businessType", params.businessDetail.businessType)
        appendIfDefined(query, "businessDetail.legalForm", params.businessDetail.legalForm)
        appendRange(query, "businessDetail.registrationDate", params.businessDetail.registrationDate)
    }

    if (params.contact) {
        appendIfDefined(query, "contact.email", params.contact.email)
        appendIfDefined(query, "contact.secondaryEmail", params.contact.secondaryEmail)
        appendIfDefined(query, "contact.phoneNumber", params.contact.phoneNumber)
        appendIfDefined(query, "contact.mobileNumber", params.contact.mobileNumber)
        appendIfDefined(query, "contact.faxNumber", params.contact.faxNumber)
        appendIfDefined(query, "contact.website", params.contact.website)
    }

    appendAddressQuery(query, "billingAddress", params.billingAddress)
    appendAddressQuery(query, "shippingAddress", params.shippingAddress)

    if (params.audit) {
        appendIfDefined(query, "audit.createdBy", params.audit.createdBy)
        appendRange(query, "audit.createdDate", params.audit.createdDate)
        appendRange(query, "audit.modifiedDate", params.audit.modifiedDate)
    }
}
