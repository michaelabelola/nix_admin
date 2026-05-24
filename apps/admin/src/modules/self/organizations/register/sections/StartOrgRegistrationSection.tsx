import {
    ClipboardCheck,
    FileCheck2,
    ShieldCheck,
    UploadCloud,
} from "lucide-react"

import {RegistrationIntroLayout} from "@suiteonix/components"

import {REGISTRATION_STEPS} from "../constants.ts"

const introHighlights = [
    {
        icon: ClipboardCheck,
        title: "Business profile",
        description: "Capture organization identity, industry, legal details, and contact channels.",
    },
    {
        icon: FileCheck2,
        title: "Owner details",
        description: "Add the profile information used to connect you with the organization.",
    },
    {
        icon: UploadCloud,
        title: "Brand assets",
        description: "Attach optional logo, cover, and owner photo assets before submission.",
    },
]

export function StartOrgRegistrationSection() {
    return (
        <RegistrationIntroLayout
            heroImageAlt="Organization onboarding preview"
            badges={["Organization onboarding", "Business registration"]}
            title="Register your organization."
            description="Set up your business profile, owner details, contact information, and brand assets in a guided flow before submitting for onboarding."
            primaryAction={{
                label: "Get started",
                to: REGISTRATION_STEPS[0].path,
            }}
            secondaryAction={{
                label: "View organizations",
                to: "/self/organizations",
            }}
            highlights={introHighlights}
            beforeTitle="A focused setup for the information your organization profile needs."
            beforeDescription="The registration flow is split into short steps so business identity, legal details, address, contact data, owner profile, and images stay easy to review."
            checklist={[
                "Keep your legal organization details and registration country ready.",
                "Prepare organization and owner address and contact information.",
                "Upload brand images now or leave optional asset fields blank.",
            ]}
            callout={{
                icon: ShieldCheck,
                title: "Submission follows the final step",
                description: "You can move between steps before submitting. Required fields are checked at the final registration action.",
            }}
        />
    )
}
