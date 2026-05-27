export const DEPARTMENT_DETAILS_TABS = [
    "details",
    "members",
] as const

export type DepartmentDetailsTab = (typeof DEPARTMENT_DETAILS_TABS)[number]

export const DEPARTMENT_DETAILS_TAB_LABELS: Record<DepartmentDetailsTab, string> = {
    details: "Details",
    members: "Members",
}

export const DEPARTMENT_DETAILS_TAB_TO: Record<DepartmentDetailsTab, string> = {
    details: "/admin/departments/$departmentId/details",
    members: "/admin/departments/$departmentId/members",
}
