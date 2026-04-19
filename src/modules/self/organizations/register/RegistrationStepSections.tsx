import {useQuery} from "@tanstack/react-query"
import {Link} from "@tanstack/react-router"
import {ArrowRight, Upload} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Input} from "#/components/ui/input.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import {Textarea} from "#/components/ui/textarea.tsx"
import organizationUtilsApi from "#/modules/self/organizations/OrgUtil.api.ts"

import {REGISTRATION_STEPS} from "./constants.ts"
import {RegistrationStepLayout} from "./RegistrationStepLayout.tsx"
import {useRegistration} from "./registration.context.tsx"

function TextField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    label: string
    value: string | number
    onChange: (value: string) => void
    type?: string
    placeholder?: string
}) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-medium">{label}</span>
            <Input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    )
}

function FileField({
    label,
    description,
    onChange,
}: {
    label: string
    description: string
    onChange: (file: File | null) => void
}) {
    return (
        <label className="grid gap-2 rounded-lg border border-dashed p-4">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm text-muted-foreground">{description}</span>
            <Input
                type="file"
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />
        </label>
    )
}

function dateInputValue(value: string | Date) {
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return value
}

export function StartOrgRegistrationSection() {
    const firstStep = REGISTRATION_STEPS[0]

    return (
        <section className="grid gap-6">
            <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardHeader className="space-y-3">
                    <CardTitle className="text-3xl">Register your organization</CardTitle>
                    <CardDescription className="max-w-3xl text-sm leading-7">
                        This multi-step flow will collect your business details, contact information,
                        legal registration data, owner profile, and branding assets before submitting
                        everything to the organization onboarding endpoint.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-3">
                        {REGISTRATION_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-start gap-3 rounded-lg border bg-background/70 p-4">
                                <div className="rounded-lg border bg-muted p-2 text-primary">
                                    <step.icon className="size-4"/>
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {index + 1}. {step.label}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 rounded-xl border bg-background/70 p-5">
                        <div>
                            <h2 className="text-lg font-semibold">Before you proceed</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Keep your legal organization details, address information, owner profile, and any
                                optional images ready. You can move between steps before final submission.
                            </p>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground">
                            <p>Required details include business name, industry, registration country, addresses, contact details, and owner information.</p>
                            <p>Optional uploads include your avatar, logo, dark logo, and cover images.</p>
                        </div>

                        <div className="pt-2">
                            <Button asChild size="lg">
                                <Link to={firstStep.path}>
                                    Proceed to registration
                                    <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

export function OrgNameStepSection() {
    const {draft, updateData} = useRegistration()
    const isDisabled = !draft.data.name.trim() || !draft.data.shortName.trim()

    return (
        <RegistrationStepLayout stepId="org-name" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Organization name"
                    value={draft.data.name}
                    onChange={(value) => updateData({name: value})}
                    placeholder="Suiteonix Realty"
                />
                <TextField
                    label="Short name"
                    value={draft.data.shortName}
                    onChange={(value) => updateData({shortName: value})}
                    placeholder="Suiteonix"
                />
            </div>
        </RegistrationStepLayout>
    )
}

export function IndustryStepSection() {
    const {draft, updateData} = useRegistration()
    const {data, isLoading} = useQuery({
        queryKey: ["organization-utils", "industries"],
        queryFn: () => organizationUtilsApi.getAllIndustries(),
        initialData: [],
    })

    return (
        <RegistrationStepLayout stepId="industry" disableNext={!draft.data.industry.trim()}>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Industry</label>
                <Select
                    value={draft.data.industry || undefined}
                    onValueChange={(value) => updateData({industry: value})}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={isLoading ? "Loading industries..." : "Select industry"}/>
                    </SelectTrigger>
                    <SelectContent>
                        {data.map((industry) => (
                            <SelectItem key={industry.id} value={industry.name}>
                                {industry.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </RegistrationStepLayout>
    )
}

export function BioStepSection() {
    const {draft, updateData, updateDataDetail} = useRegistration()

    return (
        <RegistrationStepLayout stepId="bio">
            <div className="grid gap-4">
                <label className="grid gap-2">
                    <span className="text-sm font-medium">Short bio</span>
                    <Textarea
                        value={draft.data.bio ?? ""}
                        onChange={(event) => updateData({bio: event.target.value})}
                        placeholder="A concise overview of what your organization does."
                        rows={4}
                    />
                </label>
                <label className="grid gap-2">
                    <span className="text-sm font-medium">About the organization</span>
                    <Textarea
                        value={draft.data.detail.about ?? ""}
                        onChange={(event) => updateDataDetail({about: event.target.value})}
                        placeholder="A longer narrative about your services, mission, or experience."
                        rows={7}
                    />
                </label>
            </div>
        </RegistrationStepLayout>
    )
}

export function DetailsStepSection() {
    const {draft, updateDataDetail} = useRegistration()
    const isDisabled = !draft.data.detail.registrationCountry.trim()

    return (
        <RegistrationStepLayout stepId="details" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Registration number"
                    value={draft.data.detail.registrationNumber ?? ""}
                    onChange={(value) => updateDataDetail({registrationNumber: value})}
                />
                <TextField
                    label="Registration country"
                    value={draft.data.detail.registrationCountry}
                    onChange={(value) => updateDataDetail({registrationCountry: value})}
                />
                <TextField
                    label="Date established"
                    type="date"
                    value={draft.data.detail.dateEstablished ?? ""}
                    onChange={(value) => updateDataDetail({dateEstablished: value})}
                />
            </div>
        </RegistrationStepLayout>
    )
}

export function AddressStepSection() {
    const {draft, updateDataAddress} = useRegistration()
    const address = draft.data.address
    const isDisabled = !address.street.trim() || !address.city.trim() || !address.state.trim() || !address.country.trim() || !address.zipcode.trim()

    return (
        <RegistrationStepLayout stepId="address" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Apartment / Suite" value={address.apt_number ?? ""} onChange={(value) => updateDataAddress({apt_number: value})}/>
                <TextField label="Street" value={address.street} onChange={(value) => updateDataAddress({street: value})}/>
                <TextField label="City" value={address.city} onChange={(value) => updateDataAddress({city: value})}/>
                <TextField label="State / Province" value={address.state} onChange={(value) => updateDataAddress({state: value})}/>
                <TextField label="Country" value={address.country} onChange={(value) => updateDataAddress({country: value})}/>
                <TextField label="Zip / Postal code" value={address.zipcode} onChange={(value) => updateDataAddress({zipcode: value})}/>
                <TextField label="Latitude" type="number" value={address.latitude} onChange={(value) => updateDataAddress({latitude: Number(value)})}/>
                <TextField label="Longitude" type="number" value={address.longitude} onChange={(value) => updateDataAddress({longitude: Number(value)})}/>
            </div>
        </RegistrationStepLayout>
    )
}

export function ContactStepSection() {
    const {draft, updateDataContact} = useRegistration()
    const isDisabled = !draft.data.contact.email.trim() || !draft.data.contact.phone.trim()

    return (
        <RegistrationStepLayout stepId="contact" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Organization email" type="email" value={draft.data.contact.email} onChange={(value) => updateDataContact({email: value})}/>
                <TextField label="Organization phone" type="tel" value={draft.data.contact.phone} onChange={(value) => updateDataContact({phone: value})}/>
            </div>
        </RegistrationStepLayout>
    )
}

export function SocialsStepSection() {
    const {draft, updateDataSocials} = useRegistration()
    const socials = draft.data.socials

    return (
        <RegistrationStepLayout stepId="socials">
            <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Website" value={socials.website} onChange={(value) => updateDataSocials({website: value})}/>
                <TextField label="Facebook" value={socials.facebook} onChange={(value) => updateDataSocials({facebook: value})}/>
                <TextField label="Twitter / X" value={socials.twitter} onChange={(value) => updateDataSocials({twitter: value})}/>
                <TextField label="Instagram" value={socials.instagram} onChange={(value) => updateDataSocials({instagram: value})}/>
                <TextField label="LinkedIn" value={socials.linkedin} onChange={(value) => updateDataSocials({linkedin: value})}/>
                <TextField label="YouTube" value={socials.youtube} onChange={(value) => updateDataSocials({youtube: value})}/>
                <TextField label="Snapchat" value={socials.snapchat} onChange={(value) => updateDataSocials({snapchat: value})}/>
                <TextField label="Pinterest" value={socials.pinterest} onChange={(value) => updateDataSocials({pinterest: value})}/>
            </div>
        </RegistrationStepLayout>
    )
}

export function OrgUserStepSection() {
    const {draft, updateUser, updateUserAddress} = useRegistration()
    const address = draft.user.address
    const isDisabled = !draft.user.firstname.trim() || !draft.user.lastname.trim() || !draft.user.email.trim() || !draft.user.phone.trim() || !address.street.trim() || !address.city.trim() || !address.state.trim() || !address.country.trim() || !address.zipcode.trim()

    return (
        <RegistrationStepLayout stepId="org-user" disableNext={isDisabled}>
            <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="First name" value={draft.user.firstname} onChange={(value) => updateUser({firstname: value})}/>
                    <TextField label="Last name" value={draft.user.lastname} onChange={(value) => updateUser({lastname: value})}/>
                    <TextField label="Email" type="email" value={draft.user.email} onChange={(value) => updateUser({email: value})}/>
                    <TextField label="Phone" type="tel" value={draft.user.phone} onChange={(value) => updateUser({phone: value})}/>
                    <TextField label="Date of birth" type="date" value={dateInputValue(draft.user.dateOfBirth)} onChange={(value) => updateUser({dateOfBirth: value})}/>
                </div>

                <label className="grid gap-2">
                    <span className="text-sm font-medium">Owner bio</span>
                    <Textarea
                        value={draft.user.bio}
                        onChange={(event) => updateUser({bio: event.target.value})}
                        rows={5}
                    />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Apartment / Suite" value={address.apt_number} onChange={(value) => updateUserAddress({apt_number: value})}/>
                    <TextField label="Street" value={address.street} onChange={(value) => updateUserAddress({street: value})}/>
                    <TextField label="City" value={address.city} onChange={(value) => updateUserAddress({city: value})}/>
                    <TextField label="State / Province" value={address.state} onChange={(value) => updateUserAddress({state: value})}/>
                    <TextField label="Country" value={address.country} onChange={(value) => updateUserAddress({country: value})}/>
                    <TextField label="Zip / Postal code" value={address.zipcode} onChange={(value) => updateUserAddress({zipcode: value})}/>
                    <TextField label="Latitude" type="number" value={address.latitude} onChange={(value) => updateUserAddress({latitude: Number(value)})}/>
                    <TextField label="Longitude" type="number" value={address.longitude} onChange={(value) => updateUserAddress({longitude: Number(value)})}/>
                </div>
            </div>
        </RegistrationStepLayout>
    )
}

export function AvatarStepSection() {
    const {setFile} = useRegistration()

    return (
        <RegistrationStepLayout stepId="avatar">
            <FileField
                label="Owner avatar"
                description="Upload a profile image for the organization owner. This step is optional."
                onChange={(file) => setFile("avatar", file)}
            />
        </RegistrationStepLayout>
    )
}

export function LogosStepSection() {
    const {setFile, submitRegistration, canSubmit, isSubmitting} = useRegistration()

    return (
        <RegistrationStepLayout
            stepId="logos"
            nextLabel={isSubmitting ? "Submitting..." : "Submit registration"}
            disableNext={!canSubmit}
            isBusy={isSubmitting}
            onNext={submitRegistration}
        >
            <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <FileField
                        label="Organization logo"
                        description="Primary brand logo."
                        onChange={(file) => setFile("logo", file)}
                    />
                    <FileField
                        label="Dark logo"
                        description="Alternative logo for dark surfaces."
                        onChange={(file) => setFile("logoDark", file)}
                    />
                    <FileField
                        label="Cover image"
                        description="Optional cover image for organization pages."
                        onChange={(file) => setFile("coverImage", file)}
                    />
                    <FileField
                        label="Dark cover image"
                        description="Optional dark-mode cover variant."
                        onChange={(file) => setFile("coverImageDark", file)}
                    />
                </div>

                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Upload className="size-4"/>
                            Final review
                        </CardTitle>
                        <CardDescription>
                            Uploads are optional, but all required business and owner details must be completed before submission.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {canSubmit
                            ? "Your registration draft is ready to submit."
                            : "Some required details are still missing in earlier steps. Go back and complete them before submitting."}
                    </CardContent>
                </Card>
            </div>
        </RegistrationStepLayout>
    )
}
