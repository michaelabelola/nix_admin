export const ACCOUNT_DETAILS_TABS = [
  "dashboard",
  "info",
  "transactions",
] as const

export type AccountDetailsTab = (typeof ACCOUNT_DETAILS_TABS)[number]

export const ACCOUNT_DETAILS_TAB_LABELS: Record<AccountDetailsTab, string> = {
  dashboard: "Dashboard",
  info: "Info",
  transactions: "Transactions",
}

export const ACCOUNT_DETAILS_TAB_TO: Record<AccountDetailsTab, string> = {
  dashboard: "/admin/finance/accounts/$accountId/dashboard",
  info: "/admin/finance/accounts/$accountId/info",
  transactions: "/admin/finance/accounts/$accountId/transactions",
}
