import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CircleDollarSign,
  Handshake,
  House,
  KeyRound,
  Layers3,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/components/ui/accordion'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_landing/welcome')({ component: App })

const stats = [
  { label: 'Agencies launched', value: '1,200+' },
  { label: 'Properties listed', value: '48k+' },
  { label: 'Monthly inquiries', value: '96k+' },
]

const steps = [
  {
    icon: Building2,
    title: 'Register your business',
    description:
      'Create your company workspace, onboard agents, and set up the structure you need to begin operating immediately.',
  },
  {
    icon: House,
    title: 'List and organize properties',
    description:
      'Publish residential and commercial listings, add pricing, media, and availability, then keep every property organized in one place.',
  },
  {
    icon: KeyRound,
    title: 'Manage rent, lease, or sales',
    description:
      'Track offers, move tenants through lease workflows, and manage sale activity without switching between disconnected tools.',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$29',
    note: 'per month',
    description: 'For solo real estate agents getting their business online.',
    features: ['Business registration profile', 'Up to 20 active listings', 'Lead capture and inbox', 'Basic property management'],
  },
  {
    name: 'Growth',
    price: '$79',
    note: 'per month',
    description: 'For teams that need more listings, more coordination, and better follow-up.',
    featured: true,
    features: ['Unlimited active listings', 'Multi-agent workspace', 'Lease, rent, and sales workflow tracking', 'Performance dashboard and reporting'],
  },
  {
    name: 'Scale',
    price: '$149',
    note: 'per month',
    description: 'For agencies handling high-volume inventory and multiple operators.',
    features: ['Role-based access control', 'Custom onboarding support', 'Priority support', 'Advanced portfolio management'],
  },
]

const testimonials = [
  {
    quote:
      'Suiteonix gave us a clean way to launch our agency, upload listings, and stay on top of tenant conversations without building anything from scratch.',
    name: 'Adaeze Cole',
    role: 'Founder, Harbor Nest Realty',
  },
  {
    quote:
      'We moved from spreadsheets to a real operating system. Listing properties, handling lease requests, and tracking sales now happens in one workflow.',
    name: 'Marcus Lane',
    role: 'Operations Lead, Cedar Peak Homes',
  },
  {
    quote:
      'The speed matters. New agents can sign in, list a property, and start managing inquiries on day one with almost no training.',
    name: 'Leila Morrison',
    role: 'Managing Broker, Northline Estates',
  },
]

const teamMembers = [
  {
    name: 'Daniel Okoro',
    role: 'Founder',
    summary: 'Sets product direction and keeps Suiteonix focused on helping new agencies launch faster.',
  },
  {
    name: 'Tara Benson',
    role: 'CTO',
    summary: 'Leads platform engineering, reliability, and the systems behind listing and property operations.',
  },
  {
    name: 'Michael Fraser',
    role: 'CFO',
    summary: 'Oversees financial planning, growth strategy, and sustainable expansion across the business.',
  },
  {
    name: 'Nina Solis',
    role: 'Social Media Admin',
    summary: 'Runs brand campaigns, community engagement, and the content that keeps Suiteonix visible online.',
  },
]

const faqs = [
  {
    question: 'Who is Suiteonix built for?',
    answer:
      'Suiteonix is designed for real estate agents and growing agencies that want a simpler way to register their business, list properties, and manage rent, lease, or sale activity.',
  },
  {
    question: 'Can I manage both rentals and property sales?',
    answer:
      'Yes. The platform supports rental, lease, and property sale workflows so teams can manage different property types from the same workspace.',
  },
  {
    question: 'Do I need technical experience to get started?',
    answer:
      'No. The onboarding flow is meant for operators, not developers. You can create your profile, add listings, and start managing inquiries without technical setup.',
  },
  {
    question: 'Can I invite my team?',
    answer:
      'Yes. Growth and Scale plans are built for multiple users, so brokers, admins, and agents can work together with a shared view of listings and activity.',
  },
]

function App() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,184,178,0.25),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(47,106,74,0.18),_transparent_22%),linear-gradient(180deg,_rgba(243,250,245,0.9),_rgba(231,243,236,0.45)_55%,_rgba(255,255,255,0.94))] text-[var(--sea-ink)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.65),transparent)]" />

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--header-bg)]/95 backdrop-blur-xl">
        <div className="page-wrap flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] uppercase">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--lagoon),var(--palm))] text-white shadow-[0_18px_40px_rgba(47,106,74,0.22)]">
              <Layers3 className="size-5" />
            </span>
            Suiteonix
          </a>

          <nav className="hidden items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[color:var(--chip-bg)] px-2 py-2 md:flex">
            {[
              ['How it works', '#how-it-works'],
              ['Pricing', '#pricing'],
              ['Testimonials', '#testimonials'],
              ['FAQ', '#faqs'],
              ['Team', '#team'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--sea-ink-soft)] transition hover:bg-[color:var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="page-wrap rise-in grid gap-10 py-8 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <Card className="relative overflow-hidden rounded-[2rem] border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(243,250,245,0.86))] px-6 py-8 shadow-[0_30px_80px_rgba(23,58,64,0.08)] sm:px-10 sm:py-12">
            <div className="absolute -top-16 right-0 size-40 rounded-full bg-[rgba(79,184,178,0.22)] blur-3xl" />
            <div className="absolute bottom-0 left-0 size-32 rounded-full bg-[rgba(47,106,74,0.16)] blur-3xl" />

            <div className="relative">
              <Badge
                variant="outline"
                className="mb-6 rounded-full border-[var(--chip-line)] bg-[color:var(--chip-bg)] px-4 py-2 text-xs font-semibold tracking-[0.24em] uppercase text-[var(--kicker)]"
              >
                <Sparkles className="size-4" />
                Start and run your property business
              </Badge>

              <h1 className="max-w-3xl font-['Fraunces',serif] text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Launch your real estate business and manage every property from one platform.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--sea-ink-soft)] sm:text-lg">
                Suiteonix helps real estate agents get started easily. Register your business, list properties, manage inventory,
                and handle rent, lease, or sales activity with workflows built for teams that move fast.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-[linear-gradient(135deg,var(--lagoon),var(--palm))] px-7 text-white shadow-[0_20px_35px_rgba(47,106,74,0.28)] hover:opacity-95"
                >
                  <a href="#pricing">
                    Get Started
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-[var(--chip-line)] bg-white/70 px-7 text-[var(--sea-ink)] hover:bg-white"
                >
                  <a href="/about">Login</a>
                </Button>
              </div>

              <Separator className="mt-10 bg-[var(--line)]" />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-extrabold text-[var(--sea-ink)]">{stat.value}</div>
                    <div className="mt-1 text-sm text-[var(--sea-ink-soft)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[2rem] border-[var(--line)] bg-[rgba(255,255,255,0.78)] p-0 shadow-[0_20px_50px_rgba(23,58,64,0.06)] backdrop-blur">
              <CardHeader className="mb-0 flex flex-row items-center justify-between gap-4 px-6 pt-6">
                <div>
                  <p className="text-sm font-semibold text-[var(--kicker)]">Operations Snapshot</p>
                  <h2 className="mt-1 text-2xl font-bold">Built for daily property work</h2>
                </div>
                <BadgeCheck className="size-10 text-[var(--lagoon-deep)]" />
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {[
                  ['New business setup', 'Create your brand profile, invite your team, and publish your first listings.'],
                  ['Property management', 'Track vacant units, active leases, open offers, and recent tenant or buyer activity.'],
                  ['Revenue visibility', 'Monitor rent collection, deal flow, and portfolio performance with one clear view.'],
                ].map(([title, text]) => (
                  <Card key={title} className="gap-2 rounded-[1.4rem] border-[var(--line)] bg-[rgba(243,250,245,0.78)] py-4 shadow-none">
                    <CardHeader className="gap-1 px-4 pb-0">
                      <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pt-0">
                      <CardDescription className="mt-0 text-sm leading-7 text-[var(--sea-ink-soft)]">{text}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-5 sm:grid-cols-2">
              <FeatureCard
                icon={Handshake}
                title="Faster deal handling"
                text="Capture leads and move them into rent, lease, or sales workflows without manual follow-up chaos."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Confident team ops"
                text="Keep agents, admins, and managers aligned with a shared view of listings and property activity."
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="page-wrap py-8 sm:py-12 lg:py-16">
          <SectionHeading
            eyebrow="How it works"
              title="A simple operating system for new and growing real estate teams."
              description="From first registration to active listings and signed deals, Suiteonix keeps the core flow straightforward."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="rounded-[1.8rem] border-[var(--line)] bg-[rgba(255,255,255,0.8)] p-0 shadow-[0_20px_40px_rgba(23,58,64,0.05)]"
              >
                <CardHeader className="flex flex-row items-center justify-between px-6 pt-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
                    <step.icon className="size-5" />
                  </span>
                  <Badge variant="outline" className="border-[var(--chip-line)] bg-white/70 text-[var(--sea-ink-soft)]">
                    0{index + 1}
                  </Badge>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <CardTitle className="mt-2 text-xl font-bold">{step.title}</CardTitle>
                  <CardDescription className="mt-3 text-sm leading-7 text-[var(--sea-ink-soft)]">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="page-wrap py-8 sm:py-12 lg:py-16">
          <div className="rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(231,243,236,0.88))] p-6 sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Pricing"
              title="Choose the plan that matches your current stage."
              description="Start lean, expand when your listing volume and team operations demand more structure."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    'rounded-[1.75rem] p-0 shadow-[0_20px_40px_rgba(23,58,64,0.05)]',
                    plan.featured
                      ? 'border-[rgba(50,143,151,0.35)] bg-[linear-gradient(180deg,rgba(79,184,178,0.16),rgba(255,255,255,0.95))]'
                      : 'border-[var(--line)] bg-white/80',
                  )}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-6">
                    <div>
                      <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="mt-2 text-sm leading-7 text-[var(--sea-ink-soft)]">{plan.description}</CardDescription>
                    </div>
                    {plan.featured ? (
                      <Badge className="rounded-full bg-[var(--sea-ink)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        Popular
                      </Badge>
                    ) : null}
                  </CardHeader>

                  <CardContent className="px-6">
                    <div className="mt-0 flex items-end gap-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="pb-1 text-sm text-[var(--sea-ink-soft)]">{plan.note}</span>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-[var(--sea-ink-soft)]">
                          <Check className="mt-0.5 size-4 text-[var(--palm)]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-2">
                    <Button
                      asChild
                      size="lg"
                      variant={plan.featured ? 'default' : 'outline'}
                      className={cn(
                        'h-11 w-full rounded-full',
                        plan.featured
                          ? 'bg-[linear-gradient(135deg,var(--lagoon),var(--palm))] text-white hover:opacity-95'
                          : 'border-[var(--chip-line)] bg-white/70 text-[var(--sea-ink)] hover:bg-white',
                      )}
                    >
                      <a href="#top">Get Started</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="page-wrap py-8 sm:py-12 lg:py-16">
          <SectionHeading
            eyebrow="Loved by teams that move fast"
            title="Operators choose Suiteonix when they need speed without operational mess."
            description="These teams use the platform to launch faster, manage properties cleanly, and keep deals moving."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="rounded-[1.8rem] border-[var(--line)] bg-[rgba(255,255,255,0.82)] p-0 shadow-[0_20px_40px_rgba(23,58,64,0.05)]"
              >
                <CardHeader className="px-6 pt-6">
                  <MessageSquareQuote className="size-8 text-[var(--lagoon-deep)]" />
                </CardHeader>
                <CardContent className="px-6 pt-0">
                  <p className="text-base leading-8 text-[var(--sea-ink)]">“{testimonial.quote}”</p>
                </CardContent>
                <CardFooter className="flex-col items-start px-6 pb-6">
                  <Separator className="mb-4 bg-[var(--line)]" />
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-[var(--sea-ink-soft)]">{testimonial.role}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="team" className="page-wrap py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading
                eyebrow="Company members"
                title="The team behind the Suiteonix platform."
                description="A practical product needs a practical team. These are the roles shaping the business, product, and market presence."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="rounded-[1.8rem] border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(243,250,245,0.9))] p-0 shadow-[0_20px_40px_rgba(23,58,64,0.05)]"
                >
                  <CardHeader className="flex flex-row items-center gap-4 px-6 pt-6">
                    <Avatar className="size-14 bg-[linear-gradient(135deg,var(--lagoon),var(--palm))] text-lg font-bold text-white">
                      <AvatarFallback className="bg-transparent text-lg font-bold text-white">
                        {member.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                      <CardDescription className="text-sm font-medium text-[var(--kicker)]">{member.role}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="text-sm leading-7 text-[var(--sea-ink-soft)]">{member.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faqs" className="page-wrap py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 rounded-[2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_20px_50px_rgba(23,58,64,0.05)] sm:p-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <SectionHeading
                eyebrow="FAQs"
                title="Answers for teams preparing to launch."
                description="If your agency is evaluating the platform, these are the questions that usually come up first."
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-[var(--line)]">
                  <AccordionTrigger className="text-base font-semibold text-[var(--sea-ink)] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-[var(--sea-ink-soft)]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="page-wrap pb-14 pt-8 sm:pb-20">
          <Card className="rounded-[2.25rem] border-[rgba(50,143,151,0.22)] bg-[linear-gradient(135deg,rgba(23,58,64,0.95),rgba(47,106,74,0.92))] px-6 py-10 text-white shadow-[0_30px_80px_rgba(23,58,64,0.16)] sm:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Ready to launch</p>
                <h2 className="mt-3 font-['Fraunces',serif] text-3xl font-bold sm:text-4xl">
                  Put your agency, listings, and deal flow on one system.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
                  Suiteonix gives new real estate businesses a cleaner way to start, manage properties, and scale operations with less friction.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-[var(--sea-ink)] hover:bg-white/90">
                  <a href="#pricing">Get Started</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10"
                >
                  <a href="/about">Login</a>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-white/60">
        <div className="page-wrap flex flex-col gap-3 py-6 text-sm text-[var(--sea-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>Suiteonix helps real estate teams start easily and manage properties with less friction.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <Users className="size-4" />
              Team-ready workflows
            </span>
            <span className="inline-flex items-center gap-2">
              <CircleDollarSign className="size-4" />
              Rent, lease, or sell
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--kicker)]">{eyebrow}</p>
      <h2 className="mt-3 font-['Fraunces',serif] text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[var(--sea-ink-soft)] sm:text-base">{description}</p>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Handshake
  title: string
  text: string
}) {
  return (
    <Card className="rounded-[1.8rem] border-[var(--line)] bg-[rgba(255,255,255,0.78)] p-0 shadow-[0_20px_40px_rgba(23,58,64,0.05)]">
      <CardHeader className="px-5 pt-5">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
          <Icon className="size-5" />
        </div>
        <CardTitle className="mt-1 text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <CardDescription className="text-sm leading-7 text-[var(--sea-ink-soft)]">{text}</CardDescription>
      </CardContent>
    </Card>
  )
}
