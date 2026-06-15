import React, { useState, useEffect } from "react";
import { Language, Currency } from "../types";
import { translations } from "../utils/translations";
import { 
  Globe, ChevronDown, Send, CreditCard, Receipt, Award, MessageSquare, Menu, X, Landmark, ShieldCheck, TicketCheck, UsersRound
} from "lucide-react";

interface HeaderProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  currency: Currency;
  onChangeCurrency: (curr: Currency) => void;
  userPhone: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Header({ 
  lang, onChangeLang, 
  currency, onChangeCurrency, 
  userPhone, onOpenAuth, onLogout,
  currentPath, onNavigate
}: HeaderProps) {
  const t = translations[lang];
  const isFR = lang === "fr";

  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scrolling to handle transparent vs dark blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle path dispatch
  const handleNav = (enPath: string, frPath: string) => {
    const target = isFR ? frPath : enPath;
    window.history.pushState({}, "", target);
    onNavigate(target);
    setShowMegaMenu(false);
    setMobileMenuOpen(false);
  };

  const getLanguagePath = (l: Language): string => {
    if (l === "fr") {
      if (currentPath === "/" || currentPath === "/fr") return "/fr";
      if (currentPath.includes("transfer")) return "/fr/transferts";
      if (currentPath.includes("bill") || currentPath.includes("facture")) return "/fr/factures";
      if (currentPath.includes("card") || currentPath.includes("carte")) return "/fr/cartes";
      if (currentPath.includes("account") || currentPath.includes("compte")) return "/fr/compte";
      if (currentPath.includes("contact")) return "/fr/contact";
      return "/fr";
    } else {
      if (currentPath === "/" || currentPath === "/fr") return "/";
      if (currentPath.includes("transfers") || currentPath.includes("transferts")) return "/transfers";
      if (currentPath.includes("bills") || currentPath.includes("factures")) return "/bills";
      if (currentPath.includes("cards") || currentPath.includes("cartes")) return "/cards";
      if (currentPath.includes("account") || currentPath.includes("compte")) return "/account";
      if (currentPath.includes("contact")) return "/contact";
      return "/";
    }
  };

  const onLanguageChangeSelect = (newLang: Language) => {
    onChangeLang(newLang);
    const resolvedPath = getLanguagePath(newLang);
    window.history.pushState({}, "", resolvedPath);
    onNavigate(resolvedPath);
  };

  const servicesDetails = [
    {
      label: isFR ? "National & Local" : "National Transfer",
      desc: isFR ? "Envoyez des fonds en cash par code SMS ou de portefeuille à portefeuille." : "Dispatch instant cash pick-up SMS codes or direct wallet routes.",
      icon: Send,
      color: "text-emerald-400 bg-emerald-500/10",
      enPath: "/transfers",
      frPath: "/fr/transferts"
    },
    {
      label: isFR ? "Factures & Vignettes" : "Bill Payments",
      desc: isFR ? "Réglez vos charges courantes (eau, électricité, internet, vignettes) sans commissions." : "Settle water, electricity, fibers, and traffic violations free.",
      icon: Receipt,
      color: "text-indigo-400 bg-indigo-500/10",
      enPath: "/bills",
      frPath: "/fr/factures"
    },
    {
      label: isFR ? "Cartes de Débit" : "Card Services",
      desc: isFR ? "Visa Classic, Mastercard Elite physiques et virtuelles rattachées au solde." : "Request emergency replacements, freeze/unfreeze cards instantly.",
      icon: CreditCard,
      color: "text-amber-400 bg-amber-500/10",
      enPath: "/cards",
      frPath: "/fr/cartes"
    },
    {
      label: isFR ? "Création & KYC" : "Account Verification",
      desc: isFR ? "Onboarding dématérialisé et identification certifiée par nos administrateurs." : "Digital onboarding, ID validation, and safe SMS OTP safeguards.",
      icon: UsersRound,
      color: "text-rose-400 bg-rose-500/10",
      enPath: "/account",
      frPath: "/fr/compte"
    },
    {
      label: isFR ? "Réclamations & FAQs" : "Support & Disputes",
      desc: isFR ? "Canal d'arbitrage de litiges avec suivi interactif de tickets d'assistance." : "Track active complaint logs and audit correspondence threads.",
      icon: MessageSquare,
      color: "text-sky-400 bg-sky-500/10",
      enPath: "/contact",
      frPath: "/fr/contact"
    }
  ];

  return (
    <header 
      id="header-nav" 
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300 ${isScrolled ? "bg-[#091e21]/90 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-transparent border-b border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        
        {/* LOGO LINK */}
        <div 
          onClick={() => handleNav("/", "/fr")}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="h-10 w-10 bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0d7e67]/20">
            <span className="font-extrabold tracking-tighter text-base">TS</span>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            {t.logo}
          </span>
        </div>

        {/* MIDDLE NAV LINKS WITH MEGA MENU */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#e7fdf8]/70">
          <button 
            onClick={() => handleNav("/", "/fr")}
            className={`hover:text-white transition-colors cursor-pointer ${currentPath === "/" || currentPath === "/fr" ? "text-[#12b886]" : ""}`}
          >
            {t.navHome}
          </button>
          
          {/* MEGA MENU LINK */}
          <div 
            className="relative"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            <button 
              className={`hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-4 ${currentPath !== "/" && currentPath !== "/fr" && currentPath !== "/fr/contact" && currentPath !== "/contact" ? "text-[#12b886]" : ""}`}
            >
              <span>{isFR ? "Services & Cartes" : "Services & Cards"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showMegaMenu ? "rotate-180 text-[#12b886]" : ""}`} />
            </button>

            {/* EXPANDED DRIP MEGA MENU PANEL */}
            {showMegaMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-[#0b2a2f] border border-white/10 rounded-2xl p-5 shadow-2xl grid grid-cols-1 gap-3 animate-scale-up z-50">
                <div className="text-[10px] font-mono text-[#12b886] font-bold pb-2 border-b border-white/5 uppercase select-none tracking-widest">
                  {isFR ? "SÉLECTION DES SERVICES FISCAUX & MONÉTAIRES" : "SELECT REGISTERED FISCAL SEGMENT"}
                </div>
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {servicesDetails.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleNav(service.enPath, service.frPath)}
                        className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/5 group text-left"
                      >
                        <div className={`p-2.5 rounded-lg shrink-0 ${service.color} group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#12b886] transition-colors">{service.label}</h4>
                          <p className="text-[10px] text-[#e7fdf8]/50 leading-relaxed font-normal">{service.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNav("/contact", "/fr/contact")}
            className={`hover:text-white transition-colors cursor-pointer ${currentPath.includes("contact") ? "text-[#12b886]" : ""}`}
          >
            {isFR ? "Réclamations & Support" : "Support & Complaints"}
          </button>
        </nav>

        {/* CONTROLS (Lang Switcher, Currency context, Auth buttons) */}
        <div className="flex items-center gap-3">
          
          {/* 1. Language switcher */}
          <div className="relative flex items-center bg-black/35 border border-white/10 rounded-lg px-2 py-1 gap-1">
            <Globe className="w-3.5 h-3.5 text-[#12b886]" />
            <select
              value={lang}
              onChange={(e) => onLanguageChangeSelect(e.target.value as Language)}
              className="bg-transparent border-none text-[10.5px] text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-[#0b2a2f]">EN</option>
              <option value="fr" className="bg-[#0b2a2f]">FR</option>
            </select>
          </div>

          {/* 2. Currency context Switcher (For client logged-in context) */}
          {userPhone && !userPhone.endsWith("+212600000000") && (
            <div className="relative flex items-center bg-black/35 border border-white/10 rounded-lg px-2 py-1 gap-1">
              <span className="text-[10px] text-[#12b886] font-bold">Format:</span>
              <select
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value as Currency)}
                className="bg-transparent border-none text-[10.5px] text-white font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="MAD" className="bg-[#0b2a2f]">MAD</option>
                <option value="EUR" className="bg-[#0b2a2f]">EUR (€)</option>
                <option value="USD" className="bg-[#0b2a2f]">USD ($)</option>
              </select>
            </div>
          )}

          {/* 3. Auth Actions */}
          {userPhone ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline px-3 py-1 bg-[#12b886]/10 border border-[#12b886]/20 text-[#12b886] rounded-full text-[10px] font-mono whitespace-nowrap">
                {userPhone === "+212600000000" ? "ADMIN SECURE CONTROL" : `Client: ${userPhone}`}
              </span>
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer text-white"
              >
                {t.ctaLogout}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg shadow-lg shadow-[#0d7e67]/15 transition-all transform active:scale-95 cursor-pointer"
            >
              {t.ctaLogin}
            </button>
          )}

          {/* MOBILE BURGER BUTTON */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white bg-white/5 rounded-lg border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* MOBILE FULLSCREEN DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-[#091e21] z-30 flex flex-col p-6 space-y-4 border-t border-white/10 animate-fade-in md:hidden">
          <button 
            onClick={() => handleNav("/", "/fr")}
            className={`py-3 px-4 rounded-xl font-bold bg-white/5 text-left flex items-center justify-between ${currentPath === "/" || currentPath === "/fr" ? "border-l-4 border-[#12b886]" : ""}`}
          >
            <span>{t.navHome}</span>
          </button>

          <p className="text-[10px] uppercase font-mono tracking-wider text-[#12b886] px-4 pt-2">
            {isFR ? "Services Économiques" : "Primary Services"}
          </p>

          <div className="space-y-1 pl-2">
            {servicesDetails.map((service, idx) => (
              <button
                key={idx}
                onClick={() => handleNav(service.enPath, service.frPath)}
                className="w-full py-2.5 px-4 text-left font-semibold text-white/80 hover:text-white flex items-center justify-between text-xs"
              >
                <span>{service.label}</span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-white/40" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => handleNav("/contact", "/fr/contact")}
            className={`py-3 px-4 rounded-xl font-bold bg-white/5 text-left flex items-center justify-between ${currentPath.includes("contact") ? "border-l-4 border-[#12b886]" : ""}`}
          >
            <span>{isFR ? "Réclamations & Support" : "Support Desk"}</span>
          </button>
        </div>
      )}

    </header>
  );
}
