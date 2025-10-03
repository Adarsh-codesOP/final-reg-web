import Image from "next/image"
import { Suspense } from "react"
import { EventCard } from "@/components/event-card"
import { RegisterSection } from "@/components/register-section"
import { RegisterDialogProvider } from "@/components/register-dialog-provider"

export default async function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <RegisterDialogProvider>
        <SiteHeader />
        <Hero />
        <AboutSection />
        <Footer />
      </RegisterDialogProvider>
    </main>
  )
}

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/placeholder-logo.svg"
            alt="XL Pro Community Logo"
            width={36}
            height={36}
            className="rounded-sm"
            priority
          />
          <span className="font-mono text-sm tracking-wide text-muted-foreground">XL Pro Community</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
          <a href="#event" className="hover:text-primary transition-colors">
            Event
          </a>
          <a href="#register" className="hover:text-primary transition-colors">
            Register
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <h1 className="text-pretty text-3xl md:text-5xl font-semibold">
          <span className="font-mono text-primary">Build. Learn. Ship.</span> Together
          <span className="text-primary/70">_</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          XL Pro Community is a developer collective pushing boundaries with code, hardware, and product thinking. Join
          a league of builders who ship fast and help each other level up.
        </p>
        <div className="flex items-center gap-3">
          {/* Removed hero-side register button; keep learn more */}
          <a href="#about" className="text-sm text-primary underline underline-offset-4">
            Learn more
          </a>
        </div>
      </div>
      <div id="event">
        <Suspense fallback={<div className="h-[420px] rounded-lg bg-muted" />}>
          <EventCard />
        </Suspense>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold text-primary">{"About the Club"}</h2>
        </div>
        <div className="md:col-span-2 space-y-4 text-muted-foreground leading-relaxed">
          <p>{"We’re a community of developers passionate about software, circuits, and solving real problems."}</p>
          <p>
            {
              "Expect hands-on workshops, peer code reviews, lightning talks, and hack-style events that keep you sharp and shipping."
            }
          </p>
          <p>{"Whether you’re into web, mobile, AI, or hardware—there’s a squad for you."}</p>
        </div>
      </div>
      <div id="register" className="mx-auto max-w-6xl px-4 pb-16">
        <RegisterSection />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Image src="/placeholder-logo.svg" alt="" width={18} height={18} />
          <span>XL Pro Community</span>
        </div>
        <p className="mt-2">
          {"© "}
          {new Date().getFullYear()} {" XL Pro. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
