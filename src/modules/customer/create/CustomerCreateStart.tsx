import {
    ClipboardCheck,
    FileCheck2,
    ShieldCheck,
    UserRound,
} from "lucide-react"

import {RegistrationIntroLayout} from "#/components/registration/RegistrationLayouts.tsx"

import {CUSTOMER_CREATE_STEPS} from "./customer-create.constants.ts"

const introHighlights = [
    {
        icon: UserRound,
        title: "Customer identity",
        description: "Set the customer type, stage, and core profile information.",
    },
    {
        icon: ClipboardCheck,
        title: "Complete record",
        description: "Add personal, business, contact, address, and preference details before review.",
    },
    {
        icon: FileCheck2,
        title: "Single submission",
        description: "Move between steps freely, then send the backend request once from the final review.",
    },
]

export function CustomerCreateStart() {
    return (
        <RegistrationIntroLayout
            heroImageAlt="Customer creation preview"
            badges={["Customer creation", "Admin workflow"]}
            title="Create a customer."
            description="Build a customer record across focused steps for basics, identity, business data, contact channels, addresses, and preferences."
            primaryAction={{
                label: "Start customer setup",
                to: CUSTOMER_CREATE_STEPS[0].path,
            }}
            secondaryAction={{
                label: "View customers",
                to: "/admin/customers",
            }}
            highlights={introHighlights}
            beforeTitle="A guided setup that keeps the customer draft easy to review."
            beforeDescription="The flow uses route-based steps so administrators can move through the record naturally and submit only after the final review."
            checklist={[
                "Start with the required customer type and lifecycle stage.",
                "Add optional personal, business, contact, and address details as needed.",
                "Review the complete draft before sending the create request.",
            ]}
            callout={{
                icon: ShieldCheck,
                title: "Only the final review submits",
                description: "Step navigation updates the local draft only. The backend customer is created from the review step.",
            }}
        />
    )
}
