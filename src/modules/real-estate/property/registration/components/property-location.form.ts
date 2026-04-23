import type { PropertyModel } from "#/modules/real-estate/property/model.ts"

import {
  toNullableNumber,
  toNullableString,
} from "./PropertyRegistrationFormParts.tsx"

export type LocationFormValues = {
  label: string
  apartment: string
  unit: string
  building: string
  floor: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: string
  longitude: string
  refId: string
}

export type LocationFieldConfig = {
  name: keyof LocationFormValues
  label: string
  placeholder?: string
  description?: string
  type?: string
  required?: boolean
}

export const LOCATION_FORM_FIELDS: LocationFieldConfig[] = [
  // {
  //   name: "label",
  //   label: "Label",
  //   description: "Optional internal label for this location record.",
  //   placeholder: "Primary property address",
  // },
  {
    name: "building",
    label: "Building",
    placeholder: "North tower",
  },
  {
    name: "line1",
    label: "Address line 1",
    placeholder: "123 Main Street",
    required: true,
  },
  {
    name: "line2",
    label: "Address line 2",
    placeholder: "Suite or district",
  },
  {
    name: "apartment",
    label: "Apartment",
    placeholder: "4B",
  },
  {
    name: "unit",
    label: "Unit",
    placeholder: "Unit 12",
  },
  {
    name: "floor",
    label: "Floor",
    placeholder: "8",
    type: "number",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Toronto",
    required: true,
  },
  {
    name: "state",
    label: "State / Province",
    placeholder: "Ontario",
    required: true,
  },
  {
    name: "postalCode",
    label: "Postal code",
    placeholder: "M5V 2T6",
  },
  {
    name: "country",
    label: "Country",
    placeholder: "Canada",
    required: true,
  },
  {
    name: "refId",
    label: "Reference location id",
    placeholder: "Optional linked location id",
  },
  {
    name: "latitude",
    label: "Latitude",
    placeholder: "43.6426",
    type: "number",
  },
  {
    name: "longitude",
    label: "Longitude",
    placeholder: "-79.3871",
    type: "number",
  },
]

export function getLocationFormDefaults(property: PropertyModel.Detailed): LocationFormValues {
  return {
    label: property.location?.label ?? "",
    apartment: property.location?.apartment ?? "",
    unit: property.location?.unit ?? "",
    building: property.location?.building ?? "",
    floor: property.location?.floor != null ? String(property.location.floor) : "",
    line1: property.location?.line1 ?? "",
    line2: property.location?.line2 ?? "",
    city: property.location?.city ?? "",
    state: property.location?.state ?? "",
    postalCode: property.location?.postalCode ?? "",
    country: property.location?.country ?? "",
    latitude:
      property.location?.latitude != null ? String(property.location.latitude) : "",
    longitude:
      property.location?.longitude != null ? String(property.location.longitude) : "",
    refId: property.location?.ref ?? "",
  }
}

export function toLocationCreateBody(values: LocationFormValues): PropertyModel.PropertyLocationCreate {
  return {
    label: toNullableString(values.label),
    apartment: toNullableString(values.apartment),
    unit: toNullableString(values.unit),
    building: toNullableString(values.building),
    floor: toNullableNumber(values.floor),
    line1: toNullableString(values.line1),
    line2: toNullableString(values.line2),
    city: toNullableString(values.city),
    state: toNullableString(values.state),
    postalCode: toNullableString(values.postalCode),
    country: toNullableString(values.country),
    latitude: toNullableNumber(values.latitude),
    longitude: toNullableNumber(values.longitude),
    refId: toNullableString(values.refId),
  }
}
