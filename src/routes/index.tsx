import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Instagram, Menu, Phone, X } from "lucide-react";

import founderImage from "@/assets/founder-editorial.jpg";
import heroImage from "@/assets/velocity-hero.jpg";
import mealImage from "@/assets/social-meal.jpg";
import journalImage from "@/assets/social-journal.jpg";
import walkImage from "@/assets/social-walk.jpg";
import studioImage from "@/assets/social-studio.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velocity Fit | Personalized Transformation Coaching" },
      { name: "description", content: "Personalized nutrition, fat-loss and transformation coaching from Velocity Fit, led by Dr. Lubna Fatima." },
      { property: "og:title", content: "Velocity Fit | Transformation Coaching" },
      { property: "og:description", content: "A personalized path to fat loss, nutrition and sustainable wellness." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  ["Journey", "#journey"], ["Programs", "#programs"], ["Formula", "#formula"],
  ["Founder", "#founder"], ["Stories", "#stories"],
];

const goals = [
  { n: "01", title: "Weight loss", text: "A personalized nutrition path for steady, sustainable progress." },
  { n: "02", title: "Fat loss & transformation", text: "Structured nutrition, accountability and expert guidance." },
  { n: "03", title: "Better nutrition", text: "Build practical habits around the food and life you already know." },
  { n: "04", title: "Not sure where to start", text: "Begin with an assessment and find the right way forward." },
];

const formula = [
  ["01", "Assess", "Understand your lifestyle, goals and current habits."],
  ["02", "Plan", "Build a customized nutrition strategy around your needs."],
  ["03", "Guide", "Put the plan into practice with clear, ongoing support."],
  ["04", "Evolve", "Review progress, refine the plan and build sustainable habits."],
];

function Brand() {
  return <a href="#top" className="flex items-baseline gap-2" aria-label="Velocity Fit home"><span className="font-display text-xl font-semibold">Velocity</span><span className="font-mono text-[10px] uppercase tracking-[.25em] text-olive-deep">Fit</span></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [open]);

  return <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/90 backdrop-blur-xl">
    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-10">
      <Brand />
      <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
        {navItems.map(([label, href]) => <a key={href} href={href} className="text-sm text-ink-soft transition-colors hover:text-ink">{label}</a>)}
      </nav>
      <div className="flex items-center gap-3">
        <Button asChild className="hidden sm:inline-flex"><a href="#contact">Start your journey</a></Button>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
    </div>
    {open && <div className="fixed inset-x-0 top-18 z-50 min-h-[calc(100dvh-4.5rem)] bg-ivory px-5 py-8 lg:hidden">
      <nav className="flex flex-col" aria-label="Mobile navigation">
        {navItems.map(([label, href], i) => <a key={href} href={href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-ink/10 py-5 font-display text-3xl"><span>{label}</span><span className="font-mono text-xs text-olive">0{i + 1}</span></a>)}
        <Button asChild size="lg" className="mt-8"><a href="#contact" onClick={() => setOpen(false)}>Start your journey</a></Button>
      </nav>
    </div>}
  </header>;
}

function Index() {
  return <div id="top" className="min-h-screen bg-ivory text-ink">
    <Header />
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_70%_20%,var(--champagne),transparent_55%)] opacity-20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-22 pt-12 lg:grid-cols-12 lg:px-10 lg:pb-28 lg:pt-20">
          <div className="reveal-up lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[.28em] text-olive-deep">Personalized transformation · Hyderabad</p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">Your health journey, shaped around you.</h1>
            <p className="mt-7 max-w-[43ch] text-lg leading-relaxed text-ink-soft">Personalized nutrition and fat-loss guidance built for real life—with the structure and support to keep moving forward.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><a href="#journey">Find your path <ArrowRight /></a></Button>
              <Button asChild size="lg" variant="outline"><a href="#formula">See the method</a></Button>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[.2em] text-ink-soft/70">Personal · Structured · Sustainable</p>
          </div>
          <div className="relative lg:col-span-7">
            <img src={heroImage} width={1200} height={1504} fetchPriority="high" alt="Woman exercising with dumbbells in a warm wellness studio" className="aspect-[4/5] w-full rounded-[1.75rem] object-cover" />
            <div className="absolute -bottom-6 left-4 max-w-60 rounded-2xl border border-ink/10 bg-paper/90 p-5 shadow-xl backdrop-blur sm:-left-6">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-olive-deep">Velocity Fit</p>
              <p className="mt-2 font-display text-lg leading-snug">Reverse obesity. Reinvent yourself.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="eyebrow">Choose your path</p><h2 className="section-title">Where would you like to begin?</h2><p className="section-copy">Choose what feels closest to your goal. Your plan is personalized after the first assessment.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {goals.map((goal) => <a href="#programs" key={goal.n} className="group flex min-h-52 flex-col justify-between rounded-3xl border border-ink/10 bg-paper/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-olive/50 hover:bg-paper">
              <div className="flex items-center justify-between"><span className="font-mono text-xs text-ink-soft/60">{goal.n}</span><ArrowRight className="size-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" /></div>
              <div><h3 className="font-display text-2xl font-medium">{goal.title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{goal.text}</p></div>
            </a>)}
          </div>
        </div>
      </section>

      <section id="programs" className="bg-mist/55 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-end gap-6 md:grid-cols-2"><div><p className="eyebrow">VelocityFit Transformation</p><h2 className="section-title max-w-xl">A program you can shape to your journey.</h2></div><p className="section-copy md:justify-self-end">Choose a dietary approach, level of support and duration based on your assessment.</p></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <article className="relative overflow-hidden rounded-3xl bg-ink p-8 text-ivory lg:col-span-7 lg:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[.24em] text-champagne">Dietary approach</p><h3 className="mt-4 font-display text-4xl">FLEX · GRIT · PRO</h3><p className="mt-4 max-w-xl leading-relaxed text-ivory/70">Move from a sustainable start with foundational habits, through strategic structure, to the strictest transformation protocol.</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">{[["Flex","Foundational habits"],["Grit","Strategic discipline"],["Pro","Strict protocol"]].map(([name,desc]) => <div key={name} className="border-t border-ivory/20 pt-4"><p className="font-display text-xl">{name}</p><p className="mt-1 text-xs text-ivory/60">{desc}</p></div>)}</div>
            </article>
            <div className="grid gap-5 lg:col-span-5">
              <article className="rounded-3xl bg-paper p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Team support</p><h3 className="mt-3 font-display text-3xl">Prime</h3></div><p className="font-display text-2xl">₹2,000<span className="font-body text-xs text-ink-soft"> / month</span></p></div><p className="mt-4 text-sm text-ink-soft">Team-guided support and group accountability for general weight-loss goals.</p><p className="mt-4 font-mono text-[10px] uppercase tracking-[.15em] text-olive-deep">3 months · ₹5,500</p></article>
              <article className="rounded-3xl bg-olive-deep p-7 text-ivory"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.24em] text-champagne">By assessment only</p><h3 className="mt-3 font-display text-3xl">Elite</h3></div><p className="font-display text-2xl">₹3,000<span className="font-body text-xs text-ivory/60"> / month</span></p></div><p className="mt-4 text-sm text-ivory/70">Direct one-to-one guidance with Dr. Lubna for advanced protocols and complex cases.</p><p className="mt-4 font-mono text-[10px] uppercase tracking-[.15em] text-champagne">3 months · ₹8,000</p></article>
            </div>
          </div>
          <Button asChild size="lg" className="mt-8"><a href="https://velocityfit.in/product/velocityfit-transformation/">Explore the program <ArrowRight /></a></Button>
        </div>
      </section>

      <section id="formula" className="relative overflow-hidden bg-ink py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10"><p className="eyebrow text-champagne">The Velocity Fit Formula</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">A clear progression from understanding to sustainable change.</h2>
          <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{formula.map(([n,title,text]) => <li key={n} className="border-t border-ivory/20 pt-6"><span className="font-display text-6xl text-champagne">{n}</span><h3 className="mt-5 font-display text-2xl">{title}</h3><p className="mt-2 text-sm leading-relaxed text-ivory/65">{text}</p></li>)}</ol>
        </div>
      </section>

      <section id="stories" className="py-24 lg:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12"><div className="lg:col-span-4"><p className="eyebrow">Transformation stories</p><h2 className="section-title">Progress deserves to be seen honestly.</h2><p className="section-copy">We’ll only feature real client journeys here when they are verified and shared with consent.</p></div>
        <div className="lg:col-span-8"><div className="relative min-h-96 overflow-hidden rounded-3xl bg-mist"><img src={walkImage} loading="lazy" width={900} height={900} alt="Woman walking confidently in a garden" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-ink/80 p-7 text-ivory backdrop-blur"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-champagne">Stories coming soon</p><p className="mt-2 font-display text-2xl">Your story could begin here.</p></div></div></div></div>
      </div></section>

      <section id="founder" className="bg-paper py-24 lg:py-32"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12 lg:px-10"><div className="lg:col-span-5"><div className="relative"><img src={founderImage} loading="lazy" width={1024} height={1280} alt="Editorial placeholder for the Velocity Fit founder portrait" className="aspect-[4/5] w-full rounded-3xl object-cover"/><p className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 font-mono text-[9px] uppercase tracking-[.16em] backdrop-blur">Founder portrait placeholder</p></div></div><div className="lg:col-span-7"><p className="eyebrow">The human behind Velocity Fit</p><h2 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">Personal guidance begins with listening.</h2><p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">Dr. Lubna Fatima founded Velocity Fit to empower people through expert nutrition advice, customized fat-loss plans and consistent support.</p><div className="mt-8 border-l-2 border-champagne pl-5"><p className="font-display text-2xl">Integrity. Compassion. Excellence.</p><p className="mt-2 text-sm text-ink-soft">The values at the heart of the practice.</p></div><Button asChild variant="outline" size="lg" className="mt-9"><a href="https://velocityfit.in/about/">Read the founder story</a></Button></div></div></section>

      <section id="community" className="py-24 lg:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">From the community</p><h2 className="section-title">Wellness, in real life.</h2></div><Button asChild variant="outline"><a href="https://instagram.com/velocityfit.official" target="_blank" rel="noreferrer"><Instagram /> Follow @velocityfit.official</a></Button></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"><a href="https://instagram.com/velocityfit.official" target="_blank" rel="noreferrer" className="group col-span-2 row-span-2 overflow-hidden rounded-3xl"><img src={mealImage} loading="lazy" width={900} height={900} alt="Balanced Indian meal inspiration" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" /></a>{[[journalImage,"Writing wellness goals"],[studioImage,"Wellness studio essentials"],[walkImage,"A confident morning walk"]].map(([src,alt],i) => <a key={i} href="https://instagram.com/velocityfit.official" target="_blank" rel="noreferrer" className={`group overflow-hidden rounded-3xl ${i===2 ? "col-span-2" : ""}`}><img src={src} loading="lazy" width={900} height={900} alt={alt} className="aspect-square size-full object-cover transition duration-500 group-hover:scale-[1.04]" /></a>)}</div>
      </div></section>

      <section id="faq" className="border-t border-ink/10 py-24"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-12 lg:px-10"><div className="lg:col-span-4"><p className="eyebrow">Before you begin</p><h2 className="section-title">Questions, answered.</h2></div><Accordion type="single" collapsible className="lg:col-span-8">{[
        ["What happens first?","Your journey begins with an initial consultation and assessment of your goals, habits and needs."],
        ["How is my plan created?","Velocity Fit creates a customized nutrition plan based on your assessment and chosen program level."],
        ["What support is included?","Support varies by tier. Prime includes team guidance and group accountability; Elite includes direct one-to-one guidance with Dr. Lubna."],
        ["How long are the programs?","The current VelocityFit Transformation program is available for one month or three months."],
      ].map(([q,a],i) => <AccordionItem value={`item-${i}`} key={q}><AccordionTrigger className="py-6 font-display text-xl hover:no-underline">{q}</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <section id="contact" className="relative overflow-hidden bg-ink py-28 text-ivory lg:py-36"><div className="mx-auto max-w-4xl px-5 text-center lg:px-10"><p className="eyebrow text-champagne">Ready when you are</p><h2 className="mt-6 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">Begin with one intentional step.</h2><p className="mx-auto mt-6 max-w-xl text-lg text-ivory/70">Tell us where you are today. We’ll help you find the right path forward.</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild variant="inverse" size="lg"><a href="https://velocityfit.in/start-your-journey-now/">Start your assessment <ArrowRight /></a></Button><Button asChild variant="glass" size="lg"><a href="tel:+919966827968"><Phone /> Call 99668 27968</a></Button></div></div></section>
    </main>
    <footer className="bg-ink text-ivory"><div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-ivory/10 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10"><Brand/><nav className="flex flex-wrap gap-5 text-sm text-ivory/60">{navItems.slice(0,4).map(([label,href]) => <a href={href} key={href} className="hover:text-ivory">{label}</a>)}<a href="mailto:velocityfit55@gmail.com" className="hover:text-ivory">Email</a></nav><p className="font-mono text-[10px] uppercase tracking-[.15em] text-ivory/40">© 2026 Velocity Fit</p></div></footer>
  </div>;
}