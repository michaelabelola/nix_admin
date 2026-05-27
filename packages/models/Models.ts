type NixID = string

export type {
    NixID
}

export enum NixRole {
    SYSTEM = "SYSTEM",
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    ORGANIZATION = "ORGANIZATION",
    USER = "USER",
    CUSTOMER = "CUSTOMER",
    ANONYMOUS = "ANONYMOUS",
    APP = "APP"
}

export enum NixModule {
    AUTH = "AUTH",
    APP = "APP",
    USER = "USER",
    CUSTOMER = "CUSTOMER",
    MAIL = "MAIL",
    REAL_ESTATE = "REAL_ESTATE",
    FILE = "FILE",
    STORAGE = "STORAGE",
    ONBOARDING = "ONBOARDING",
    ORGANIZATION = "ORGANIZATION",
    PERMISSION = "PERMISSION",
    PRODUCT = "PRODUCT",
    INTERACTION = "INTERACTION",
    FINANCE = "FINANCE",
    DEPARTMENT = "DEPARTMENT",
    TAG = "TAG",
    PRICING = "PRICING",
    LISTING = "LISTING",
    ALL = "ALL"
}

export interface ResponseDto<T> {
    message: string
    data: T
}

export type AuditSection = {
    createdBy: NixID,
    createdDate: Date | string,
    modifiedBy: NixID,
    modifiedDate: Date | string,
}
