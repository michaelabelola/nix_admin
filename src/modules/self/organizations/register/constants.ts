import {
    Building2, Factory, BookOpen, FileText,
    MapPin, Phone, Share2, User, ImagePlus, Image, type LucideIcon
} from 'lucide-react'

export interface RegistrationStep {
    id: string
    label: string
    shortLabel: string
    path: string
    icon: LucideIcon
    description: string
}

export const REGISTRATION_INTRO_PATH = '/self/organizations/register'

export const REGISTRATION_STEPS: RegistrationStep[] = [
    {
        id: 'org-name',
        label: 'Business Name',
        shortLabel: 'Name',
        path: '/self/organizations/register/org-name',
        icon: Building2,
        description: 'Your organization\'s official name and short identifier.',
    },
    {
        id: 'industry',
        label: 'Industry',
        shortLabel: 'Industry',
        path: '/self/organizations/register/industry',
        icon: Factory,
        description: 'The sector your organization operates in.',
    },
    {
        id: 'bio',
        label: 'Bio & About',
        shortLabel: 'Bio',
        path: '/self/organizations/register/bio',
        icon: BookOpen,
        description: 'A compelling description of your organization.',
    },
    {
        id: 'details',
        label: 'Legal Details',
        shortLabel: 'Details',
        path: '/self/organizations/register/details',
        icon: FileText,
        description: 'Registration number, country, and establishment date.',
    },
    {
        id: 'address',
        label: 'Address',
        shortLabel: 'Address',
        path: '/self/organizations/register/address',
        icon: MapPin,
        description: 'Physical location of your organization.',
    },
    {
        id: 'contact',
        label: 'Contact',
        shortLabel: 'Contact',
        path: '/self/organizations/register/contact',
        icon: Phone,
        description: 'How people can reach your organization.',
    },
    {
        id: 'socials',
        label: 'Social Media',
        shortLabel: 'Socials',
        path: '/self/organizations/register/socials',
        icon: Share2,
        description: 'Your online presence and social channels.',
    },
    {
        id: 'org-user',
        label: 'Your Profile',
        shortLabel: 'You',
        path: '/self/organizations/register/org-user',
        icon: User,
        description: 'Your personal details as the organization owner.',
    },
    {
        id: 'avatar',
        label: 'Your Photo',
        shortLabel: 'Avatar',
        path: '/self/organizations/register/avatar',
        icon: ImagePlus,
        description: 'A profile photo that will represent you as the org owner.',
    },
    {
        id: 'logos',
        label: 'Logos & Covers',
        shortLabel: 'Logos',
        path: '/self/organizations/register/logos',
        icon: Image,
        description: 'Upload your organization\'s logo and cover images. All optional.',
    },
]

export function getRegistrationStep(stepId: string) {
    return REGISTRATION_STEPS.find((step) => step.id === stepId)
}

export function getRegistrationStepIndex(stepId: string) {
    return REGISTRATION_STEPS.findIndex((step) => step.id === stepId)
}

export function getPreviousRegistrationStep(stepId: string) {
    const index = getRegistrationStepIndex(stepId)
    if (index <= 0) return undefined
    return REGISTRATION_STEPS[index - 1]
}

export function getNextRegistrationStep(stepId: string) {
    const index = getRegistrationStepIndex(stepId)
    if (index < 0 || index >= REGISTRATION_STEPS.length - 1) return undefined
    return REGISTRATION_STEPS[index + 1]
}
