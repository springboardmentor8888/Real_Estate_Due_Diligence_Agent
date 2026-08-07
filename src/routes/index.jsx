import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Scale, Leaf, FileSearch, MapPin, Building, Sparkles,
  Check, TrendingUp, Zap, Lock, Globe, Layers, Database, Bot,
} from "lucide-react";
import { MarketingNav } from "../components/marketing-nav";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";

const LOGOS = ["JLL", "Knight Frank", "CBRE", "Cushman & Wakefield", "Colliers", "Newmark"];

const FEATURES = [
  { icon: FileSearch, title: "Instant title & ownership", body: "Chain-of-title verified across 3,200+ county records with lien and encumbrance detection." },
  { icon: Scale, title: "Legal & litigation scan", body: "Surface pending suits, judgments, and code violations before you sign the LOI." },
  { icon: Leaf, title: "Environmental intelligence", body: "Phase I signals, flood, wildfire, seismic and climate exposure modeled to 2050." },
  { icon: TrendingUp, title: "Valuation & comps", body: "AI-tuned cap-rate comparables ranked by adjusted similarity, not zip code." },
  { icon: ShieldCheck, title: "Risk scoring", body: "Composite 0–100 score across seven dimensions, audit-trailed to the source." },
  { icon: Bot, title: "Agent workflows", body: "Delegate diligence to autonomous agents that draft memos in your voice." },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <Pricing />
      <Faq />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald/20 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
          <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald shadow-glow" />
            Series A — backed by Sequoia, Founders Fund & JLL Spark
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.03em] text-gradient sm:text-6xl md:text-[76px] md:leading-[1.02]">
            Due diligence,<br />in the time it takes<br />to read a term sheet.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Parcel is the AI diligence agent for institutional real estate. Verify ownership, quantify risk, and generate investment-committee-ready memos in under 90 seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="rounded-xl bg-emerald px-6 text-primary-foreground shadow-glow hover:bg-emerald/90">
                Start free trial <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl border-border bg-foreground/[0.03] px-6 opacity-50 cursor-not-allowed" disabled>
              View live demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div className="glass-strong relative overflow-hidden rounded-3xl p-2 shadow-elevated">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
                alt="Modern skyscraper"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            {/* floating cards */}
            <FloatCard style={{ top: "8%", left: "-4%" }} delay={0.4}>
              <div className="flex items-center gap-3">
                <div className="relative grid h-12 w-12 place-items-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0">
                    <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground/10" />
                    <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="94.2" strokeDashoffset="16" strokeLinecap="round" className="text-emerald" transform="rotate(-90 18 18)" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">82</span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk score</div>
                  <div className="text-sm font-medium text-foreground">Low exposure</div>
                </div>
              </div>
            </FloatCard>

            <FloatCard style={{ top: "40%", right: "-4%" }} delay={0.6}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Valuation</div>
              <div className="mt-1 text-xl font-semibold text-foreground">$48.5M</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald"><TrendingUp className="h-3 w-3" /> +6.2% YoY · 5.4% cap</div>
            </FloatCard>

            <FloatCard style={{ bottom: "22%", left: "6%" }} delay={0.8}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald" />
                <div className="text-[12px] font-medium text-foreground">Ownership verified</div>
              </div>
              <div className="mt-1 text-[10.5px] text-muted-foreground">Chain-of-title clean · 3 grantors</div>
            </FloatCard>

            <FloatCard style={{ bottom: "8%", right: "8%" }} delay={1}>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-chart-2" />
                <div className="text-[12px] font-medium text-foreground">Env risk: Low</div>
              </div>
              <div className="mt-1 text-[10.5px] text-muted-foreground">Flood 0.4% · Seismic B</div>
            </FloatCard>

            <FloatCard style={{ top: "12%", right: "12%" }} delay={0.5}>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-chart-3" />
                <div className="text-[12px] font-medium text-foreground">Legal: Clear</div>
              </div>
              <div className="mt-1 text-[10.5px] text-muted-foreground">0 open litigation</div>
            </FloatCard>

            <FloatCard style={{ bottom: "38%", left: "38%" }} delay={1.2} wide>
              <div className="flex items-start gap-2">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald/20">
                  <Sparkles className="h-3.5 w-3.5 text-emerald" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Summary</div>
                  <div className="mt-0.5 text-[11.5px] leading-snug text-foreground">
                    Strong Class-A office in prime SF FiDi. Title clean, no environmental flags. Recommend proceed to IC.
                  </div>
                </div>
              </div>
            </FloatCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatCard({ children, style, delay = 0, wide = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={style}
      className={`glass-strong absolute z-10 hidden rounded-xl p-3 shadow-elevated md:block ${wide ? "w-64" : "w-52"}`}
    >
      {children}
    </motion.div>
  );
}

function Marquee() {
  return (
    <section className="border-y border-border/60 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by the world's leading real estate teams
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-14 gap-y-4">
          {LOGOS.map((l) => (
            <div key={l} className="text-lg font-semibold tracking-tight text-foreground/50 transition-colors hover:text-foreground/80">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald">The platform</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-gradient md:text-5xl">Every layer of diligence, unified.</h2>
          <p className="mt-4 text-[15px] text-muted-foreground">One workspace for underwriting, risk, legal, environmental, and IC reporting — grounded in verifiable sources.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass group rounded-2xl p-6 transition-all hover:border-emerald/30"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald/10 text-emerald transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: MapPin, title: "Add an address", body: "Paste any US address, APN, or portfolio CSV. We fetch every public record in seconds." },
    { icon: Layers, title: "Agent runs diligence", body: "Parcel orchestrates 40+ data sources, cross-referencing title, tax, legal and climate exposure." },
    { icon: FileSearch, title: "Ship an IC memo", body: "Get a source-linked risk score, memo draft and downloadable report your team can sign off." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald">How it works</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-gradient md:text-5xl">From address to IC memo in 90 seconds.</h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="glass relative rounded-2xl p-6">
              <div className="absolute right-5 top-5 text-[11px] font-mono text-muted-foreground">0{i + 1}</div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-foreground/[0.03]"><s.icon className="h-5 w-5 text-emerald" /></div>
              <h3 className="mt-5 text-[15px] font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    { icon: Building, title: "Institutional investors", body: "Pre-LOI screening and IC-ready memos across 10,000+ property portfolios." },
    { icon: Globe, title: "Brokerage teams", body: "Give every broker a research analyst that never sleeps." },
    { icon: Database, title: "Lenders & underwriters", body: "Automate collateral verification and environmental review at scale." },
    { icon: Lock, title: "Family offices", body: "Discreet, private diligence with zero-retention data controls." },
  ];
  return (
    <section id="solutions" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald">Solutions</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-gradient md:text-5xl">Built for the entire capital stack.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <div key={c.title} className="glass flex gap-5 rounded-2xl p-6">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald/20 to-chart-2/20 text-emerald">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { quote: "Parcel compressed a two-week diligence workflow into an afternoon. It's changed how we underwrite.", name: "Marcus Levine", role: "Managing Director, Blackstone RE" },
    { quote: "The environmental risk model alone caught two flood exposures our consultants missed.", name: "Priya Rao", role: "Head of Acquisitions, Kilroy" },
    { quote: "Every broker on my floor uses it. It's the fastest ROI we've seen from any tool this year.", name: "James Whitaker", role: "Senior Vice President, JLL" },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {t.map((q, i) => (
            <motion.blockquote key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass rounded-2xl p-6">
              <div className="text-[15px] leading-relaxed text-foreground">"{q.quote}"</div>
              <footer className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald to-chart-2 text-[12px] font-semibold text-primary-foreground">
                  {q.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-foreground">{q.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{q.role}</div>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Starter", price: "$390", per: "/mo", desc: "For solo brokers and analysts.", features: ["50 diligence reports / mo", "US property coverage", "PDF & Excel exports", "Email support"], cta: "Start free trial" },
    { name: "Growth", price: "$1,290", per: "/mo", desc: "For growing acquisition teams.", features: ["500 reports / mo", "Portfolio uploads", "Watchlists & alerts", "API access", "Priority support"], cta: "Start free trial", featured: true },
    { name: "Enterprise", price: "Custom", per: "", desc: "For institutional platforms.", features: ["Unlimited reports", "SSO & SCIM", "Data residency", "Dedicated CSM", "SOC 2 Type II"], cta: "Book a demo" },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald">Pricing</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-gradient md:text-5xl">Simple, transparent, scales with you.</h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`glass relative flex flex-col rounded-2xl p-6 ${p.featured ? "border-emerald/40 shadow-glow" : ""}`}>
              {p.featured && <div className="absolute -top-2.5 right-5 rounded-full bg-emerald px-2 py-0.5 text-[10px] font-medium text-primary-foreground">Most popular</div>}
              <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="text-4xl font-semibold text-foreground">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.per}</div>
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">{p.desc}</div>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8">
                <Button className="w-full rounded-xl bg-emerald text-primary-foreground hover:bg-emerald/90">
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "How does Parcel source its data?", a: "We integrate 3,200+ county records, SEC filings, EPA & FEMA feeds, and licensed valuation data. Every fact in a report links to its source." },
    { q: "Is my data confidential?", a: "Yes. Enterprise workspaces are zero-retention by default. Data never trains our models." },
    { q: "Which markets do you cover?", a: "All 50 US states with expanding coverage in Canada, the UK, and Western Europe." },
    { q: "Can I integrate with my CRM?", a: "Salesforce, HubSpot, VTS, and Yardi ship out of the box. A REST API is available on Growth+." },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-gradient md:text-4xl">Frequently asked</h2>
        <div className="mt-8 space-y-2">
          {items.map((i) => (
            <details key={i.q} className="glass group rounded-xl p-5 open:border-emerald/30">
              <summary className="flex cursor-pointer items-center justify-between text-[14.5px] font-medium text-foreground">
                {i.q}
                <span className="text-emerald transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{i.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="glass-strong relative mx-auto max-w-5xl overflow-hidden rounded-3xl p-12 text-center shadow-elevated md:p-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald/20 via-transparent to-chart-2/20" />
        <div className="relative">
          <Zap className="mx-auto h-8 w-8 text-emerald" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gradient md:text-5xl">Underwrite with conviction.</h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted-foreground">Try Parcel free for 14 days. No credit card. No sales call required.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register"><Button size="lg" className="rounded-xl bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90">Start free trial <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            <Button size="lg" variant="outline" className="rounded-xl border-border bg-foreground/[0.03] opacity-50 cursor-not-allowed" disabled>Explore demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}