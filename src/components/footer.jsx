import React from "react";
import { Logo } from "./logo";

const cols = [
  { title: "Product", links: ["Features", "How it works", "Use cases", "Pricing", "Changelog"] },
  { title: "Solutions", links: ["Institutional", "Brokerage", "REIT", "Family Office", "Lenders"] },
  { title: "Resources", links: ["Documentation", "API", "Guides", "Blog", "Security"] },
  { title: "Company", links: ["About", "Careers", "Customers", "Press", "Contact"] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            AI-powered property intelligence for confident investment decisions.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
            All systems operational
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="mb-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{c.title}</div>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-foreground/80 transition-colors hover:text-foreground" onClick={(e) => e.preventDefault()}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Parcel Intelligence, Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" className="hover:text-foreground" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" className="hover:text-foreground" onClick={(e) => e.preventDefault()}>Security</a>
            <a href="#" className="hover:text-foreground" onClick={(e) => e.preventDefault()}>SOC 2</a>
          </div>
        </div>
      </div>
    </footer>
  );
}