import {useQuery} from "@tanstack/react-query"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx"
import {organizationUtilsApi} from "@suiteonix/server"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"

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
                        {data.filter(industry => industry.id === "REAL_ESTATE").map((industry) => (
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
