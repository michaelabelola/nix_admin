import {Tabs, TabsContent, TabsList, TabsTrigger} from "#/components/ui/tabs.tsx"

import {
  DashboardHero,
  OperationsSection,
  PerformanceSection,
  PortfolioSection,
  QuickLinksSection,
  StatCardsSection,
  SummarySection,
} from "./dashboard.sections.tsx"

const RealEstateDashboard = () => {
  return (
    <main className="space-y-6 px-4 py-6 lg:px-6">
      <DashboardHero />
      <QuickLinksSection />
      <StatCardsSection />

      <Tabs defaultValue="performance" className="gap-6">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceSection />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioSection />
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <OperationsSection />
        </TabsContent>
      </Tabs>

      <SummarySection />
    </main>
  )
}

export default RealEstateDashboard
