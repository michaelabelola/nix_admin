namespace LocationModel {
    export type Address = {
        "apt_number": string
        "street": string
        "city": string
        "state": string
        "country": string
        "zipcode": string
        "latitude": number,
        "longitude": number //0.00
    }
    export type Country_Query = Omit<Country, "_native" | "capital" | "timezones" | "translations" | "emojiU" | "wikiDataId" | "latitude" | "longitude">

    export type Country = {
        id: number,
        name: string,
        iso3: string,
        numericCode: string,
        iso2: string,
        phoneCode: string,
        capital: string,
        currency: string,
        currencyName: string,
        currencySymbol: string,
        tld: string,
        _native: string,
        region: string,
        subRegion: string,
        timezones: TimeZone[],
        translations: Record<language, string>,
        latitude: number,
        longitude: number,
        emoji: string,
        flag: boolean,
        wikiDataId: string
    }
    export type Countries = Country[]


    export type language = string

    type TimeZone = {
        zoneName: string,
        gmtOffset: number,
        gmtOffsetName: string,
        abbreviation: string,
        tzName: string
    }

    export type State = {
        id: number,
        name: string,
        countryId: number,
        countryCode: string,
        fipsCode: string,
        iso2: string,
        type: string,
        latitude: number,
        longitude: number,
        flag: boolean,
        wikiDataId: string
    }
    export type State_Query = Omit<State, "longitude" | "latitude" | "wikiDataId">

    export type States = State[]

    export type City = {
        id: number,
        name: string,
        stateId: number,
        stateCode: string,
        countryId: number,
        countryCode: string,
        latitude: number,
        longitude: number,
        flag: boolean,
        wikiDataId: string
    }

    export type City_Query = Omit<City, "wikiDataId" | "latitude" | "longitude">

    export type Cities = City[]
}