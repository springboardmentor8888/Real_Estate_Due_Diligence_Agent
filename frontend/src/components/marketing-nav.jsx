import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const NAV = [
    { label: "Product", to: "#product" },
    { label: "Features", to: "#features" },
    { label: "Solutions", to: "#solutions" },
    { label: "Pricing", to: "#pricing" },
    { label: "Resources", to: "#resources" },
    { label: "About", to: "#about" },
];

export function MarketingNav() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (e, hash) => {
        e.preventDefault();
        setOpen(false);
        const el = document.querySelector(hash);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
        >
            <div
                className={`mx-auto flex max-w-[1200px] items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 glass-strong ${
                    scrolled ? "shadow-elevated" : ""
                }`}
            >
                {/* ========================================== */}
                {/* ✅ FIXED: LOGO SECTION REPLACED WITH IMAGE */}
                {/* ========================================== */}
                <Link to="/" className="flex items-center gap-3">
                    <img 
                        src="/logo.png" 
                        alt="RealEstate Logo" 
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    {/* Fallback if image fails */}
                    <div className="hidden h-10 w-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <span className="text-white font-bold text-sm">RE</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900">RealEstate</span>
                        <span className="text-[10px] text-emerald-600 font-medium">Due Diligence</span>
                    </div>
                </Link>
                {/* ========================================== */}
                {/* ✅ END LOGO SECTION */}
                {/* ========================================== */}

                {/* Desktop nav links */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {NAV.map((i) => (
                        <a
                            key={i.label}
                            href={i.to}
                            onClick={(e) => handleNavClick(e, i.to)}
                            className="rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.03] hover:text-foreground"
                        >
                            {i.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA buttons */}
                <div className="hidden items-center gap-3 lg:flex">
                    <Link to="/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
                        >
                            Sign in
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button
                            size="sm"
                            className="rounded-lg bg-emerald px-4 text-[13px] font-medium text-primary-foreground shadow-glow hover:bg-emerald/90"
                        >
                            Book demo
                        </Button>
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="grid h-9 w-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-foreground/[0.03] lg:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="glass-strong mx-auto mt-2 max-w-[1200px] rounded-2xl p-4 shadow-elevated lg:hidden"
                    >
                        <div className="flex flex-col gap-1">
                            {NAV.map((i) => (
                                <a
                                    key={i.label}
                                    href={i.to}
                                    onClick={(e) => handleNavClick(e, i.to)}
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.03] hover:text-foreground"
                                >
                                    {i.label}
                                </a>
                            ))}
                            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                                <Link to="/login" onClick={() => setOpen(false)}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-lg"
                                    >
                                        Sign in
                                    </Button>
                                </Link>
                                <Link to="/register" onClick={() => setOpen(false)}>
                                    <Button
                                        size="sm"
                                        className="w-full rounded-lg bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90"
                                    >
                                        Book demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}