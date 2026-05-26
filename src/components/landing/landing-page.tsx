import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SiteFooter from "@/components/layout/site-footer";
import { siteConfig } from "@/constants/site";

const features = [
  {
    icon: Receipt,
    title: "Expense Management",
    description:
      "Track business spending by category, vendor, and date with powerful search and filters.",
  },
  {
    icon: FileText,
    title: "Invoice Tracking",
    description:
      "Create professional invoices with line items, tax, and status tracking from draft to paid.",
  },
  {
    icon: Sparkles,
    title: "AI Financial Insights",
    description:
      "Get concise, actionable observations powered by your real revenue and expense data.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualize trends, category breakdowns, and recent activity in one clean overview.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              Built for small businesses & freelancers
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Manage finances with clarity and confidence
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Everything you need to stay on top of cash flow
              </h2>
              <p className="mt-3 text-muted-foreground">
                Four core modules designed to keep bookkeeping simple.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-border/60 bg-card/80 transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <span className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-muted/40 via-background to-muted/30 p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Your dashboard at a glance
                </h2>
                <p className="mt-4 text-muted-foreground">
                  See revenue, expenses, pending invoices, and net balance on one
                  screen. Charts highlight monthly trends and category splits so
                  you can spot patterns quickly.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Revenue", value: "₹4.2L" },
                  { label: "Expenses", value: "₹1.8L" },
                  { label: "Pending", value: "3" },
                  { label: "Balance", value: "₹2.4L" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border/60">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-xl font-semibold">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
          <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground sm:px-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Ready to simplify your books?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
              Create a free account and start tracking expenses, invoices, and AI
              insights in minutes.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8"
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
