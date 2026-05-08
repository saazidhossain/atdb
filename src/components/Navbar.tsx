import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { Menu, X, Phone, Mail, Globe } from "lucide-react";
import { getWhatsAppQuoteUrl } from "@/data/equipment";
import { useLang } from "@/hooks/useLang";
import AnimatedLogo from "@/components/AnimatedLogo";
import { CartButton } from "@/components/CartDrawer";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { to: "/", en: "Home", bn: "হোম" },
  { to: "/equipment", en: "Equipment", bn: "যন্ত্রপাতি" },
  { to: "/projects", en: "Projects", bn: "প্রকল্প" },
  { to: "/about", en: "About", bn: "সম্পর্কে" },
  { to: "/contact", en: "Contact", bn: "যোগাযোগ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLang();
  const rafRef = useRef(0);

  // RAF-throttled scroll detection
  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 20);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${scrolled ? "h-[60px]" : "h-[72px]"}`}>
          <AnimatedLogo size={scrolled ? 36 : 42} withWordmark asLink />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-lg ${
                    isActive ? "text-orange-400" : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {lang === "bn" ? link.bn : link.en}
                  {/* Animated active indicator */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-orange-400 rounded-full transition-all duration-300 ${
                      isActive ? "w-6 opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <CartButton />
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full glass text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className={lang === "en" ? "text-orange-400" : "text-white/60"}>EN</span>
              <span className="text-white/30">|</span>
              <span className={lang === "bn" ? "text-orange-400" : "text-white/60"}>বাং</span>
            </button>

            <a href="https://www.facebook.com/atdbtrade" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors hover:scale-110 active:scale-95">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="tel:+8801712106242" className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-500 transition-colors hover:scale-110 active:scale-95">
              <Phone className="w-4 h-4" />
            </a>
            <a href="mailto:saifulaapi@gmail.com" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors hover:scale-110 active:scale-95">
              <Mail className="w-4 h-4" />
            </a>
            <a href={getWhatsAppQuoteUrl()} target="_blank" rel="noopener noreferrer" className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-400/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {t("Get Quote", "কোটেশন নিন")}
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <CartButton />
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full glass text-[10px] font-semibold text-white/80"
            >
              <Globe className="w-3 h-3" />
              {lang === "en" ? "বাং" : "EN"}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — animated slide-in */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
              className="md:hidden glass-strong rounded-2xl p-4 mb-4 overflow-hidden"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    to={link.to}
                    className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      location.pathname === link.to
                        ? "text-orange-400 bg-orange-500/10"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {lang === "bn" ? link.bn : link.en}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25 }}
                href={getWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-green-600 text-white text-sm font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {t("Get Quote on WhatsApp", "হোয়াটসঅ্যাপে কোটেশন নিন")}
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
