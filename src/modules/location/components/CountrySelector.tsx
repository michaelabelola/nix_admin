import {CountryCombobox} from "./CountryCombobox.tsx"

export function CountrySelector(props: Parameters<typeof CountryCombobox>[0]) {
    return <CountryCombobox {...props}/>
}
