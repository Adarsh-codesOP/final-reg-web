import Image from "next/image"
import { Suspense } from "react"
import { EventCard } from "@/components/event-card"
import { RegisterSection } from "@/components/register-section"
import { RegisterDialogProvider } from "@/components/register-dialog-provider"
import DecryptedText from "@/components/DecryptedText"
import TextType from "@/components/TextType"

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
            src="https://xlfzqufxcfykxqrehyxa.supabase.co/storage/v1/object/public/extra/file%20(1).svg"
            alt="XL Pro Community Logo"
            width={36}
            height={36}
            className="rounded-sm"
            priority
          />
          <span className="font-mono text-sm tracking-wide text-muted-foreground">
            XL Pro Community
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="#event" className="hover:text-primary transition-colors">
              Event
            </a>
            <a href="#register" className="hover:text-primary transition-colors">
              Register
            </a>
            <a href="#help" className="hover:text-primary transition-colors">
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <h1 className="text-pretty text-3xl md:text-5xl font-semibold">
          <TextType
            text={[
             "XL Pro Developers",
             "Build. Learn. Ship. Together",
             "Join Codeathon 2.0 – Compete & Collaborate"
            ]}
            typingSpeed={50}
            deletingSpeed={40} 
            pauseDuration={2000}
            showCursor={true}
            cursorCharacter="_"
            loop={true}  
          />
        </h1>

        <DecryptedText
          text="XL Pro Community is a developer collective pushing boundaries with code, hardware, and product thinking. Join a league of builders who ship fast, collaborate, and level up together."
          animateOn="hover"
          className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl"
          encryptedClassName="text-muted-foreground/50 text-lg md:text-xl leading-relaxed max-w-2xl"
          parentClassName="block"
        />

        <div className="flex items-center gap-3">
          <a href="#about" className="text-sm text-primary underline underline-offset-4">
            Learn more
          </a>
        </div>
      </div>

      <div id="event">
        <Suspense fallback={<div className="h-[420px] rounded-lg bg-muted" />} >
          <EventCard />
        </Suspense>
      </div>
    </section>
  );
}



function AboutSection() {
  return (
    <section id="about" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <DecryptedText
            text="About the Club"
            animateOn="hover"
            className="text-2xl font-semibold text-primary"
            encryptedClassName="text-2xl font-semibold text-primary/50"
            parentClassName="inline-block"
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <DecryptedText
            text="We’re a community of developers passionate about software, circuits, and solving real problems."
            animateOn="hover"
            className="text-muted-foreground text-lg md:text-base leading-relaxed"
            encryptedClassName="text-muted-foreground/50 text-lg md:text-base leading-relaxed"
            parentClassName="block"
          />
          <DecryptedText
            text="Expect hands-on workshops, peer code reviews, lightning talks, and hack-style events that keep you sharp and shipping."
            animateOn="hover"
            className="text-muted-foreground text-lg md:text-base leading-relaxed"
            encryptedClassName="text-muted-foreground/50 text-lg md:text-base leading-relaxed"
            parentClassName="block"
          />
          <DecryptedText
            text="Whether you’re into web, mobile, AI, or hardware—there’s a squad for you."
            animateOn="hover"
            className="text-muted-foreground text-lg md:text-base leading-relaxed"
            encryptedClassName="text-muted-foreground/50 text-lg md:text-base leading-relaxed"
            parentClassName="block"
          />
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
    <>
      {/* Help Section */}
      <section
        id="help"
        className="max-w-6xl mx-auto px-4 py-4 bg-card border border-border rounded-md mt-10 text-center"
      >
        <h2 className="text-base font-semibold text-primary mb-1">Need Help?</h2>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <a href="tel:8590900584" className="hover:text-primary transition-colors">
            8590900584
          </a>
          <a href="tel:6362756437" className="hover:text-primary transition-colors">
            6362756437
          </a>
          <a href="tel:8618587738" className="hover:text-primary transition-colors">
            8618587738
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-6">
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
    </>
  )
}
