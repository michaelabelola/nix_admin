import {Link} from "@tanstack/react-router"
import {
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Home,
  Landmark,
  MapPinned,
  Percent,
  Users,
} from "lucide-react"
import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {Badge} from "@suiteonix/ui"
import {buttonVariants} from "@suiteonix/ui"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@suiteonix/ui"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@suiteonix/ui"
import {Progress} from "@suiteonix/ui"
import {Separator} from "@suiteonix/ui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@suiteonix/ui"
import type {FileRoutesByTo} from "#/routeTree.gen.ts"

import {
  complianceMetrics,
  leadPipeline,
  marketCoverage,
  monthlyPerformance,
  monthlyWins,
  occupancyChartConfig,
  portfolioMix,
  quickLinks,
  revenueChartConfig,
  riskWatch,
  taskBoard,
  topPerformers,
} from "./dashboard.data.ts"
import {formatMillions} from "./dashboard.utils.ts"

const marketIcons = {
  map: MapPinned,
  home: Home,
  building: Building2,
  landmark: Landmark,
} as const

const complianceIcons = {
  check: CheckCircle2,
  clock: Clock3,
  calendar: CalendarRange,
  percent: Percent,
} as const

export function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/8 via-background to-success/8 p-6 lg:p-8">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_55%)] lg:block" />
      <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <Badge variant="outline" className="bg-background/70">
            Real Estate Dashboard
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              Organization real estate performance at a glance.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              Monitor portfolio health, leasing velocity, commercial exposure, and operating priorities
              across the entire business from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">94% occupancy</Badge>
            <Badge variant="outline">232 managed units</Badge>
            <Badge variant="outline">15 closings this month</Badge>
            <Badge variant="warning">4 assets on watchlist</Badge>
          </div>
        </div>

        <Card className="bg-background/80 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Quarter Focus</CardTitle>
            <CardDescription>
              Improve renewals, grow sales pipeline, and reduce commercial vacancy drag.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricProgress label="Renewal target" value={76} />
            <MetricProgress label="Revenue plan attainment" value={82} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export function QuickLinksSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {quickLinks.map((item) => (
        <Card key={item.to} className="bg-gradient-to-b from-card to-muted/30">
          <CardHeader>
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              to={item.to as keyof FileRoutesByTo}
              className={buttonVariants({variant: "outline", size: "sm"})}
            >
              Open
              <ArrowUpRight className="size-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}

export function StatCardsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Gross portfolio value"
        value="$28.4M"
        change="+8.2% vs last quarter"
        description="Driven by premium residential occupancy and stronger retail rent collections."
        icon={Landmark}
      />
      <StatCard
        title="Monthly recurring revenue"
        value="$241k"
        change="+$19k month-over-month"
        description="Residential rent roll remains the main revenue anchor across the portfolio."
        icon={BadgeDollarSign}
      />
      <StatCard
        title="Active properties"
        value="86"
        change="+6 new listings"
        description="Includes residential, office, and retail inventory currently marketed or leased."
        icon={Building2}
      />
      <StatCard
        title="Tenant and buyer pipeline"
        value="166"
        change="+14% active demand"
        description="Inbound interest and booked tours are trending ahead of the previous cycle."
        icon={Users}
      />
    </section>
  )
}

export function PerformanceSection() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RevenueCard />
        <OccupancyCard />
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PipelineCard />
        <PropertiesCard />
      </section>
    </>
  )
}

export function PortfolioSection() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <PortfolioMixCard />
      <Card>
        <CardHeader>
          <CardTitle>Market Coverage</CardTitle>
          <CardDescription>
            Core business footprint by territory, inventory concentration, and leasing pressure.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {marketCoverage.map((market) => {
            const Icon = marketIcons[market.icon as keyof typeof marketIcons]
            return (
              <div key={market.name} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg border bg-muted p-2 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="font-medium">{market.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {market.properties} properties
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{market.note}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}

export function OperationsSection() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <OperationsCard />
      <Card>
        <CardHeader>
          <CardTitle>Service Levels and Compliance</CardTitle>
          <CardDescription>
            Execution quality across maintenance, leasing response, and finance reporting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {complianceMetrics.map((item) => {
            const Icon = complianceIcons[item.icon as keyof typeof complianceIcons]
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border bg-muted p-2 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.note}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{item.value}%</div>
                </div>
                <Progress value={item.value} />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}

export function SummarySection() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Executive Notes</CardTitle>
          <CardDescription>
            Current read on revenue resilience, vacancy pressure, and next operational moves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Residential inventory is doing the heavy lifting for the organization, with occupancy sitting at
            94% and renewal quality improving across the strongest apartment clusters.
          </p>
          <Separator />
          <p>
            Commercial assets remain profitable, but a handful of office and retail suites are slowing down
            blended occupancy. The biggest unlock is tightening lead response and pushing tours further down
            the funnel.
          </p>
          <Separator />
          <p>
            Operationally, rent collection and maintenance response are in good shape. The next step is
            getting earlier visibility on lease expiries so renewals are handled before units drift into
            avoidable vacancy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
          <CardDescription>Key business wins already landed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {monthlyWins.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Watch</CardTitle>
          <CardDescription>Signals that need management attention.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskWatch.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>{item.label}</span>
              <Badge variant={item.tone as "warning" | "destructive" | "outline"}>{item.tone}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}

function MetricProgress({label, value}: {label: string; value: number}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  change: string
  description: string
  icon: typeof Building2
}) {
  return (
    <Card className="@container/card bg-gradient-to-b from-card to-primary/5 shadow-xs">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">{value}</CardTitle>
        <CardAction>
          <div className="rounded-lg border bg-background/80 p-2 text-primary">
            <Icon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {change}
          <ArrowUpRight className="size-4" />
        </div>
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  )
}

function PortfolioMixCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Mix</CardTitle>
        <CardDescription>
          Active unit composition across residential and commercial inventory.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {portfolioMix.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.units} units • Avg rent {item.avgRent}
                </div>
              </div>
              <Badge variant={item.occupancy >= 90 ? "success" : "warning"}>
                {item.occupancy}% occupied
              </Badge>
            </div>
            <Progress value={item.occupancy} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RevenueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue and Closings</CardTitle>
        <CardDescription>
          Monthly revenue trend and closed transactions for the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={revenueChartConfig} className="h-[290px] w-full">
          <BarChart accessibilityLayer data={monthlyPerformance}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <span>Average monthly revenue: {formatMillions(1.25)}</span>
        <span>Average closings: 11 / month</span>
      </CardFooter>
    </Card>
  )
}

function OccupancyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Momentum</CardTitle>
        <CardDescription>
          Stabilized occupancy has improved steadily with lower vacancy exposure.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={occupancyChartConfig} className="h-[290px] w-full">
          <AreaChart accessibilityLayer data={monthlyPerformance}>
            <defs>
              <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-occupancy)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-occupancy)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="var(--color-occupancy)"
              fill="url(#fillOccupancy)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <span>Current stabilized occupancy: 94%</span>
        <span>Vacancy loss down 7.8%</span>
      </CardFooter>
    </Card>
  )
}

function PipelineCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead and Leasing Pipeline</CardTitle>
        <CardDescription>
          Conversion performance across acquisition, tours, offers, and lease execution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadPipeline.map((item) => (
              <TableRow key={item.stage}>
                <TableCell className="font-medium">{item.stage}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.conversion}</TableCell>
                <TableCell>{item.sla}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function PropertiesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Assets</CardTitle>
        <CardDescription>
          Highest-contributing properties by occupancy strength and recurring revenue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformers.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.occupancy}%</TableCell>
                <TableCell>{item.revenue}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Growing"
                        ? "success"
                        : item.status === "Watchlist"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function OperationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operations Snapshot</CardTitle>
        <CardDescription>
          Near-term tasks and service commitments keeping the portfolio healthy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {taskBoard.map((task) => (
          <div key={task.title} className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground">
                {task.owner} • Due {task.due}
              </div>
            </div>
            <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
