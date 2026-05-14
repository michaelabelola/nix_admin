import {
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    Contact,
    MapPinned,
    SlidersHorizontal,
    UserRound,
    type LucideIcon,
} from "lucide-react"

import {CustomerModel} from "#/modules/customer/model.ts"

export const CUSTOMER_CREATE_INTRO_PATH = "/admin/customers/create"

export type CustomerCreateStepID =
    | "basics"
    | "personal"
    | "business"
    | "contact"
    | "addresses"
    | "preferences"
    | "review"

export type CustomerCreateStep = {
    id: CustomerCreateStepID
    label: string
    shortLabel: string
    path: string
    icon: LucideIcon
    description: string
}

export const CUSTOMER_CREATE_STEPS: CustomerCreateStep[] = [
    {
        id: "basics",
        label: "Basics",
        shortLabel: "Basics",
        path: "/admin/customers/create/basics",
        icon: Building2,
        description: "Set the customer type, lifecycle stage, and core admin metadata.",
    },
    {
        id: "personal",
        label: "Personal Details",
        shortLabel: "Personal",
        path: "/admin/customers/create/personal",
        icon: UserRound,
        description: "Capture personal identity fields for individual customer profiles.",
    },
    {
        id: "business",
        label: "Business Details",
        shortLabel: "Business",
        path: "/admin/customers/create/business",
        icon: BriefcaseBusiness,
        description: "Capture organization details when the customer represents a company or institution.",
    },
    {
        id: "contact",
        label: "Contact",
        shortLabel: "Contact",
        path: "/admin/customers/create/contact",
        icon: Contact,
        description: "Add the primary communication channels used for this customer.",
    },
    {
        id: "addresses",
        label: "Addresses",
        shortLabel: "Addresses",
        path: "/admin/customers/create/addresses",
        icon: MapPinned,
        description: "Configure the billing and shipping addresses that should be stored with the customer.",
    },
    {
        id: "preferences",
        label: "Preferences",
        shortLabel: "Preferences",
        path: "/admin/customers/create/preferences",
        icon: SlidersHorizontal,
        description: "Set communication preferences and optional tag or segment assignments.",
    },
    {
        id: "review",
        label: "Review & Submit",
        shortLabel: "Review",
        path: "/admin/customers/create/review",
        icon: BadgeCheck,
        description: "Review the full draft and submit everything to the backend in a single request.",
    },
]

export function getCustomerCreateStepsForType(type?: CustomerModel.CustomerType) {
    return CUSTOMER_CREATE_STEPS.filter((step) => {
        if (type === CustomerModel.CustomerType.INDIVIDUAL) {
            return step.id !== "business"
        }

        return step.id !== "personal"
    })
}

export function getCustomerCreateStep(stepId: CustomerCreateStepID) {
    return CUSTOMER_CREATE_STEPS.find((step) => step.id === stepId)
}

export function getCustomerCreateStepIndex(stepId: CustomerCreateStepID) {
    return CUSTOMER_CREATE_STEPS.findIndex((step) => step.id === stepId)
}

export function getPreviousCustomerCreateStep(stepId: CustomerCreateStepID) {
    const index = getCustomerCreateStepIndex(stepId)
    if (index <= 0) return undefined
    return CUSTOMER_CREATE_STEPS[index - 1]
}

export function getNextCustomerCreateStep(stepId: CustomerCreateStepID) {
    const index = getCustomerCreateStepIndex(stepId)
    if (index < 0 || index >= CUSTOMER_CREATE_STEPS.length - 1) return undefined
    return CUSTOMER_CREATE_STEPS[index + 1]
}
