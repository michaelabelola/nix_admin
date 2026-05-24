import {DatePicker, parseDateInput, toDateInputValue} from "@suiteonix/ui"
import {CountryCombobox} from "#/modules/location/components/CountryCombobox.tsx"

import {RegistrationStepLayout} from "../RegistrationStepLayout.tsx"
import {useRegistration} from "../registration.context.tsx"
import {dateInputValue, TextField} from "./shared.tsx"

const ESTABLISHED_DATE_START = new Date(1800, 0, 1)

export function DetailsStepSection() {
    const {draft, updateDataDetail} = useRegistration()
    const today = new Date()
    const dateEstablished = parseDateInput(dateInputValue(draft.data.detail.dateEstablished ?? ""))
    const registrationCountry = draft.data.detail.registrationCountry ?? ""
    const isDisabled = !registrationCountry.trim()

    return (
        <RegistrationStepLayout stepId="details" disableNext={isDisabled}>
            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Registration number"
                    value={draft.data.detail.registrationNumber ?? ""}
                    onChange={(value) => updateDataDetail({registrationNumber: value})}
                />
                <CountryCombobox
                    value={registrationCountry}
                    onValueChange={(value) => updateDataDetail({registrationCountry: value})}
                />
                <label className="grid gap-2">
                    <span className="text-sm font-medium">Date established</span>
                    <DatePicker
                        value={dateEstablished}
                        placeholder="Pick a date"
                        captionLayout="dropdown"
                        startMonth={ESTABLISHED_DATE_START}
                        endMonth={today}
                        disabled={(date) => date > today || date < ESTABLISHED_DATE_START}
                        onChange={(date) => {
                            if (!date) return

                            updateDataDetail({dateEstablished: toDateInputValue(date)})
                        }}
                    />
                </label>
            </div>
        </RegistrationStepLayout>
    )
}
