import type {ChartConfig} from "@suiteonix/ui"

export const portfolioMix = [
  {name: "Apartments", units: 146, occupancy: 94, avgRent: "$2,180"},
  {name: "Townhouses", units: 42, occupancy: 91, avgRent: "$2,760"},
  {name: "Office Suites", units: 28, occupancy: 87, avgRent: "$4,940"},
  {name: "Retail", units: 16, occupancy: 83, avgRent: "$6,320"},
]

export const monthlyPerformance = [
  {month: "Jan", occupancy: 89, closings: 8, revenue: 182},
  {month: "Feb", occupancy: 90, closings: 10, revenue: 195},
  {month: "Mar", occupancy: 91, closings: 11, revenue: 208},
  {month: "Apr", occupancy: 92, closings: 9, revenue: 201},
  {month: "May", occupancy: 93, closings: 14, revenue: 228},
  {month: "Jun", occupancy: 94, closings: 15, revenue: 241},
]

export const leadPipeline = [
  {stage: "New buyer leads", count: 84, conversion: "28%", sla: "2h"},
  {stage: "Property tours booked", count: 39, conversion: "46%", sla: "24h"},
  {stage: "Offer in negotiation", count: 17, conversion: "44%", sla: "3d"},
  {stage: "Lease applications", count: 26, conversion: "58%", sla: "36h"},
]

export const topPerformers = [
  {name: "Lakeside Residences", type: "Residential", occupancy: 97, revenue: "$84.2k", status: "Stable"},
  {name: "Market Square Retail", type: "Commercial", occupancy: 88, revenue: "$63.8k", status: "Watchlist"},
  {name: "Northgate Offices", type: "Commercial", occupancy: 92, revenue: "$71.4k", status: "Growing"},
  {name: "Maple Crest Homes", type: "Residential", occupancy: 95, revenue: "$58.9k", status: "Stable"},
]

export const taskBoard = [
  {title: "Renew expiring leases", owner: "Operations", due: "This week", priority: "High"},
  {title: "Publish 4 premium listings", owner: "Leasing", due: "Tomorrow", priority: "Medium"},
  {title: "Finalize Q2 owner reports", owner: "Finance", due: "Friday", priority: "High"},
  {title: "Inspect vacant suites", owner: "Facilities", due: "48 hours", priority: "Medium"},
]

export const marketCoverage = [
  {name: "Downtown", properties: 24, note: "Highest demand for mixed-use and premium rental inventory.", icon: "map"},
  {name: "West End", properties: 18, note: "Stable occupancy with better renewal retention this quarter.", icon: "home"},
  {name: "North Corridor", properties: 26, note: "Commercial units need stronger tour-to-offer conversion.", icon: "building"},
  {name: "Waterfront", properties: 18, note: "Luxury stock is outperforming revenue expectations.", icon: "landmark"},
]

export const complianceMetrics = [
  {
    label: "Maintenance requests resolved within SLA",
    value: 88,
    icon: "check",
    note: "Average turnaround is 17 hours for urgent tickets.",
  },
  {
    label: "Tour requests answered within 2 hours",
    value: 93,
    icon: "clock",
    note: "Leasing team response speed is ahead of target.",
  },
  {
    label: "Lease expiries reviewed 60 days early",
    value: 71,
    icon: "calendar",
    note: "Renewal preparation still needs tighter discipline.",
  },
  {
    label: "Rent collection completeness",
    value: 96,
    icon: "percent",
    note: "Collections remain strong with minimal arrears exposure.",
  },
]

export const monthlyWins = [
  "15 leases and closings completed",
  "7 premium listings launched",
  "3 watchlist properties recovered occupancy",
  "Collections finished at 96%",
]

export const riskWatch = [
  {label: "Retail vacancy concentration", tone: "warning"},
  {label: "Late renewal reviews", tone: "destructive"},
  {label: "Offer-stage fallout", tone: "warning"},
  {label: "Commercial fit-out delays", tone: "outline"},
]

export const quickLinks = [
  {
    title: "Portfolio dashboard",
    description: "Return to the live performance overview for occupancy, revenue, and pipeline.",
    to: "/admin/real-estate/dashboard" as const,
  },
  {
    title: "Properties",
    description: "Jump into the property catalog to review active inventory and listing status.",
    to: "/admin/real-estate/properties" as const,
  },
  {
    title: "Property locations",
    description: "Open location management to verify coverage, clustering, and site readiness.",
    to: "/admin/real-estate/properties/locations" as const,
  },
]

export const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  closings: {
    label: "Closings",
    color: "var(--success)",
  },
} satisfies ChartConfig

export const occupancyChartConfig = {
  occupancy: {
    label: "Occupancy",
    color: "var(--primary)",
  },
} satisfies ChartConfig
