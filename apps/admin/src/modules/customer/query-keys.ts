import type {CustomerModel} from "#/modules/customer/model.ts"

export namespace CustomerQueryKeys {
    export const root = ["customers"] as const
    export const list = (query?: CustomerModel.Query) => [...root, "list", query] as const
    export const customer = (customerId: CustomerModel.CustomerID) => [...root, customerId] as const
    export const record = (customerId: CustomerModel.CustomerID) => [...customer(customerId), "record"] as const
    export const detailed = (customerId: CustomerModel.CustomerID) => [...customer(customerId), "detailed"] as const
    export const tags = (customerId: CustomerModel.CustomerID) => [...customer(customerId), "tags"] as const
}
