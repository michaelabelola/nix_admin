
export const DURATION_UNITS: {
    value: any;
    label: string;
}[] = [
    {value: 'NANOS', label: 'Nanos'},
    {value: 'MICROS', label: 'Micros'},
    {value: 'MILLIS', label: 'Millis'},
    {value: 'SECONDS', label: 'Seconds'},
    {value: 'MINUTES', label: 'Minutes'},
    {value: 'HOURS', label: 'Hours'},
    {value: 'HALF_DAYS', label: 'HalfDays'},
    {value: 'DAYS', label: 'Days'},
    {value: 'WEEKS', label: 'Weeks'},
    {value: 'MONTHS', label: 'Months'},
    {value: 'YEARS', label: 'Years'},
    {value: 'DECADES', label: 'Decades'},
    {value: 'CENTURIES', label: 'Centuries'},
    {value: 'MILLENNIA', label: 'Millennia'},
    {value: 'ERAS', label: 'Eras'},
    {value: 'FOREVER', label: 'Forever'},
]


/**
 * Duration unit for leasing/financing periods
 */
export type DurationUnit =
    'NANOS' |
    'MICROS' |
    'MILLIS' |
    'SECONDS' |
    'MINUTES' |
    'HOURS' |
    'HALF_DAYS' |
    'DAYS' |
    'WEEKS' |
    'MONTHS' |
    'YEARS' |
    'DECADES' |
    'CENTURIES' |
    'MILLENNIA' |
    'ERAS' |
    'FOREVER' |
    string

export type Duration_RangedQuery = {
    "value"?: number,
    "minValue"?: number,
    "maxValue"?: number,
    "unit"?: DurationUnit
}
