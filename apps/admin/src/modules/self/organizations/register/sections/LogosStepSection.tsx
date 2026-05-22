import {Upload} from "lucide-react"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {FileField} from "./shared.tsx"

export function LogosStepSection() {
    const {draft, setFile, submitRegistration, canSubmit, isSubmitting} = useRegistration()

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
                        value={draft.logo}
                        onChange={(file) => setFile("logo", file)}
                    />
                    <FileField
                        label="Dark logo"
                        description="Alternative logo for dark surfaces."
                        value={draft.logoDark}
                        onChange={(file) => setFile("logoDark", file)}
                    />
                    <FileField
                        label="Cover image"
                        description="Optional cover image for organization pages."
                        value={draft.coverImage}
                        onChange={(file) => setFile("coverImage", file)}
                    />
                    <FileField
                        label="Dark cover image"
                        description="Optional dark-mode cover variant."
                        value={draft.coverImageDark}
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
