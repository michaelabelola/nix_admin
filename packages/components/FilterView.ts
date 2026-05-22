/**
 * FilterView Configuration Models
 * 
 * Defines types for configuring dynamic filter panels that can render
 * different types of form fields based on JSON configuration.
 */

export type FilterFieldType = 'text' | 'select' | 'combobox' | 'input' | 'date-range' | 'number-range'

export interface FilterOption {
    label: string
    value: any
}

export interface FilterFieldConfig {
    id: string
    type: FilterFieldType
    label: string
    placeholder?: string
    options?: FilterOption[]
    min?: number
    max?: number
    step?: number
    required?: boolean
    disabled?: boolean
}

export interface FilterViewConfig {
    fields: FilterFieldConfig[]
    overlay?: boolean
}
