import {
  Building2,
  CircleCheckBig,
  FileImage,
  FileText,
  FolderCog,
  MapPinned,
  Tags,
  type LucideIcon,
} from "lucide-react"

export const PROPERTY_REGISTRATION_START_PATH =
  "/admin/real-estate/properties/onboard"

export type PropertyRegistrationStepID =
  | "create"
  | "about"
  | "avatar"
  | "storage"
  | "location"
  | "tags"
  | "finish"

export type PropertyRegistrationStep = {
  id: PropertyRegistrationStepID
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
  path?: string
}

type PropertyRegistrationStepDefinition = Omit<PropertyRegistrationStep, "path"> & {
  getPath: (propertyId?: string) => string | undefined
}

const PROPERTY_REGISTRATION_STEP_DEFINITIONS: PropertyRegistrationStepDefinition[] =
  [
    {
      id: "create",
      label: "Register Property",
      shortLabel: "Create",
      description: "Create the property record and receive its onboarding id.",
      icon: Building2,
      getPath: () => PROPERTY_REGISTRATION_START_PATH,
    },
    {
      id: "about",
      label: "About",
      shortLabel: "About",
      description: "Capture the public-facing about content for the property.",
      icon: FileText,
      getPath: (propertyId) =>
        propertyId
          ? `/admin/real-estate/properties/onboard/${propertyId}/about`
          : undefined,
    },
    {
      id: "avatar",
      label: "Avatar",
      shortLabel: "Avatar",
      description: "Upload the primary property avatar used across the admin.",
      icon: FileImage,
      getPath: (propertyId) =>
        propertyId
          ? `/admin/real-estate/properties/onboard/${propertyId}/avatar`
          : undefined,
    },
    {
      id: "storage",
      label: "File Storage",
      shortLabel: "Storage",
      description: "Activate the property file storage used for downstream files.",
      icon: FolderCog,
      getPath: (propertyId) =>
        propertyId
          ? `/admin/real-estate/properties/onboard/${propertyId}/storage`
          : undefined,
    },
    {
      id: "location",
      label: "Location",
      shortLabel: "Location",
      description: "Create the address record that will support the property.",
      icon: MapPinned,
      getPath: (propertyId) =>
        propertyId
          ? `/admin/real-estate/properties/onboard/${propertyId}/location`
          : undefined,
    },
    {
      id: "tags",
      label: "Tags",
      shortLabel: "Tags",
      description: "Apply the tag ids that should classify the property.",
      icon: Tags,
      getPath: (propertyId) =>
        propertyId
          ? `/admin/real-estate/properties/onboard/${propertyId}/tags`
          : undefined,
    },
    {
      id: "finish",
      label: "Finish",
      shortLabel: "Finish",
      description: "Finalize onboarding and move the property out of onboarding state.",
      icon: CircleCheckBig,
      getPath: (propertyId) =>
        propertyId
          ? `/admin/real-estate/properties/onboard/${propertyId}/finish`
          : undefined,
    },
  ]

export function propertyDetailPath(propertyId: string) {
  return `/admin/real-estate/properties/${propertyId}`
}

export function getPropertyRegistrationSteps(propertyId?: string) {
  return PROPERTY_REGISTRATION_STEP_DEFINITIONS.map((step) => ({
    ...step,
    path: step.getPath(propertyId),
  }))
}

export function getPropertyRegistrationStep(
  stepId: PropertyRegistrationStepID,
  propertyId?: string,
) {
  return getPropertyRegistrationSteps(propertyId).find((step) => step.id === stepId)
}

export function getPreviousPropertyRegistrationStep(
  stepId: PropertyRegistrationStepID,
  propertyId?: string,
) {
  const steps = getPropertyRegistrationSteps(propertyId)
  const currentIndex = steps.findIndex((step) => step.id === stepId)

  if (currentIndex <= 0) return undefined
  return steps[currentIndex - 1]
}

export function getNextPropertyRegistrationStep(
  stepId: PropertyRegistrationStepID,
  propertyId?: string,
) {
  const steps = getPropertyRegistrationSteps(propertyId)
  const currentIndex = steps.findIndex((step) => step.id === stepId)

  if (currentIndex < 0 || currentIndex >= steps.length - 1) return undefined
  return steps[currentIndex + 1]
}
