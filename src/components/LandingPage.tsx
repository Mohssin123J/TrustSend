import React, { useState } from "react";
import { translations } from "../utils/translations";
import { Language } from "../types";
import { 
  ArrowRight, ShieldCheck, Zap, Receipt, LineChart, 
  Smartphone, CreditCard, ChevronDown, Award,
  MapPin, Send, MessageSquareText, Check, Landmark, Wifi
} from "lucide-react";

interface LandingPageProps {
  lang: Language;
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

export default function LandingPage({ lang, onOpenAuth, onNavigate }: LandingPageProps) {
  const t = translations[lang];
  const isFR = lang === "fr";

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact form submission simulator
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Hover 3D coordinate effect for card
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactMsg("");
    }, 3000);
  };

  const testimonials = [
    {
      name: "Abdellah Lamrani",
      role: isFR ? "Entrepreneur E-Commerce" : "E-Commerce Entrepreneur",
      text: isFR 
        ? "TrustSend a totalement fluidifié mes transferts fournisseurs à l'étranger. Je règle mes factures en Europe en quelques minutes avec des frais dérisoires."
        : "TrustSend completely reformed my international trade remittance flows. I pay suppliers in Europe effortlessly in minutes with extremely low fees.",
      city: "Casablanca"
    },
    {
      name: "Sonia Ghaouti",
      role: isFR ? "Consultante d'Entreprise" : "Corporate Consultant",
      text: isFR 
        ? "Une solution extrêmement fiable. La double validation OTP et l'édition instantanée des reçus PDF apportent un grand confort comptable au quotidien."
        : "Highly reliable neobanking utility. The SMS verification and automated PDF receipts give high accounting reassurance for all local bill settlements.",
      city: "Rabat"
    },
    {
      name: "Yassine Taghi",
      role: isFR ? "Nomade Digital" : "Digital Nomad",
      text: isFR 
        ? "La commande de carte Visa à bas prix et le suivi d'expédition physique en agence est d'un soin rare. Je recommande vivement TrustSend."
        : "The instant physical Visa Classic request and status tracking app is pristine. Highly recommended neobank interface.",
      city: "Tangier"
    }
  ];

  const faqList = [
    {
      q: isFR ? "Comment puis-je envoyer de l'argent au niveau national à quelqu'un qui n'a pas de compte ?" :
         "How do I send money nationally to someone with no bank account?",
      a: isFR ? "Avec le transfert national, TrustSend génère automatiquement un code de retrait envoyé par SMS. Le bénéficiaire retire les fonds directement dans l'une de nos agences marocaines sur présentation de sa CIN." :
         "With our National Transfer flow, TrustSend automatically generates a secure withdrawal reference code sent directly via SMS. The recipient can easily draft cash at any partner agency upon presenting their National ID (CIN)."
    },
    {
      q: isFR ? "Quelles sont les conditions pour demander une carte de guichet ?" :
         "What are the requirements to request a physical banking card?",
      a: isFR ? "Vous devez posséder un compte TrustSend vérifié et un solde disponible d'au moins 50 DH. Vous pouvez suivre la production, suspendre ou activer votre carte en un clic." :
         "You need to maintain an active, verified account with a minor balance of at least 50 MAD. Once ordered, you can track the lifecycle status of your card and toggle block state instantly."
    },
    {
      q: isFR ? "Y a-t-il des frais supplémentaires sur les paiements de factures ?" :
         "Are there additional service rates or fees on utility bill payments?",
      a: isFR ? "Le règlement de vos factures d'eau, d'électricité ou vignettes est totalement gratuit et sécurisé. Un reçu officiel de paiement PDF est généré instantanément après validation." :
         "Symptomatically, all water, electricity, internet, and transport ticket payments are completely free of extra service charges. An official transaction PDF is generated instantly to archive locally."
    }
  ];

  // Language mapping helper for navigation
  const handlePageNav = (enPath: string, frPath: string) => {
    const target = isFR ? frPath : enPath;
    window.history.pushState({}, "", target);
    onNavigate(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Badges computed URL according to active language
  const googlePlayBadge = isFR 
    ? "https://upload.wikimedia.org/wikipedia/commons/c/c8/Google_Play_Store_badge_FR.svg"
    : "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";

  const appStoreBadge = isFR
    ? "https://upload.wikimedia.org/wikipedia/commons/5/51/Download_on_the_App_Store_Badge_FR.svg"
    : "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge_EN.svg";

  return (
    <div className="bg-[#091e21] text-white min-h-screen overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:py-36 bg-gradient-to-b from-[#0b2a2f] via-[#091e21] to-[#091e21] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0d7e67]/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#12b886]/5 rounded-full blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d7e67]/20 border border-[#0d7e67]/40 rounded-full text-xs font-semibold text-[#12b886] uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isFR ? "Agrément Bancaire Réglementaire" : "Licensed Fintech Platform"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="block text-white">{t.heroTitle}</span>
                <span className="block text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {t.heroTitleSecondary}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#e7fdf8]/70 max-w-xl leading-relaxed">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white font-bold text-xs rounded-lg flex items-center gap-2 transform active:scale-95 shadow-lg transition-all cursor-pointer"
                >
                  <span>{isFR ? "Ouvrir un compte" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageNav("/transfers", "/fr/transferts")}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  {isFR ? "Simuler un transfert" : "Try Transfer Estimator"}
                </button>
              </div>

              <div className="flex gap-6 items-center pt-8 border-t border-white/5 text-left select-none">
                <div>
                  <div className="text-base font-bold text-white">99.98%</div>
                  <div className="text-[10px] text-[#e7fdf8]/50 uppercase tracking-widest">{isFR ? "Succès" : "Transaction Success"}</div>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div>
                  <div className="text-base font-bold text-white">PCI-DSS</div>
                  <div className="text-[10px] text-[#e7fdf8]/50 uppercase tracking-widest">{isFR ? "Niveau 1" : "Level 1 Audit"}</div>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div>
                  <div className="text-base font-bold text-white">Bank-Grade</div>
                  <div className="text-[10px] text-[#e7fdf8]/50 uppercase tracking-widest">ISO 27001</div>
                </div>
              </div>

            </div>

            {/* Right Column Layout */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[360px] bg-gradient-to-tr from-[#12b886]/10 via-[#0b2a2f] to-transparent border border-white/10 rounded-2xl p-5 shadow-2xl overflow-hidden aspect-[4/5] flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#12b886]/10 rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-mono text-[#12b886] tracking-widest font-bold">TRUSTSEND COCKPIT</span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#12b886] animate-pulse" />
                </div>

                <div className="space-y-3 my-4">
                  <div className="bg-[#0b2a2f] border border-white/10 rounded-xl p-3 shadow-lg flex items-center gap-3">
                    <div className="p-2 bg-[#12b886]/15 rounded-lg text-[#12b886]">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{isFR ? "Transfert International Envoyé" : "International Remittance Dispatched"}</h4>
                      <p className="text-[10px] text-white/50">{isFR ? "Destinataire : Youssef B (Paris)" : "Recipient: Youssef B. (Paris)"}</p>
                    </div>
                  </div>

                  <div className="bg-[#0b2a2f] border border-white/10 rounded-xl p-3 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{isFR ? "Facture Redal Réglée" : "Redal Utility Settle"}</h4>
                        <p className="text-[10px] text-white/50">Contract: RED-209a3</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">120.00 MAD</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-xl p-3 text-left">
                  <span className="text-[8px] font-mono tracking-widest opacity-85">VISA CLASSIC</span>
                  <p className="text-xs font-semibold mt-1">4532 •••• •••• 9821</p>
                  <p className="text-[9px] font-bold mt-1 text-white/80">MOHAMED EL IDRISSI</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-20 bg-[#091e21] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              {t.servicesTitle}
            </h2>
            <p className="text-sm text-[#e7fdf8]/70 leading-relaxed">
              {t.servicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* National transfer */}
            <div 
              onClick={() => handlePageNav("/transfers", "/fr/transferts")}
              className="p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 bg-[#0d7e67]/20 rounded-xl flex items-center justify-center text-[#12b886] mb-5 group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t.serviceNational}</h3>
                <p className="text-xs text-[#e7fdf8]/60 leading-relaxed mb-6">{t.serviceNationalDesc}</p>
              </div>
              <span className="text-[#12b886] group-hover:underline inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <span>{isFR ? "Consulter la page dédiée" : "Access Dedicated Page"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* International transfer */}
            <div 
              onClick={() => handlePageNav("/transfers", "/fr/transferts")}
              className="p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 bg-[#12b886]/10 rounded-xl flex items-center justify-center text-[#12b886] mb-5 group-hover:scale-110 transition-transform">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t.serviceInternational}</h3>
                <p className="text-xs text-[#e7fdf8]/60 leading-relaxed mb-6">{t.serviceInternationalDesc}</p>
              </div>
              <span className="text-[#12b886] group-hover:underline inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <span>{isFR ? "Consulter la page dédiée" : "Access Dedicated Page"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Bills settlements */}
            <div 
              onClick={() => handlePageNav("/bills", "/fr/factures")}
              className="p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 bg-[#0d7e67]/20 rounded-xl flex items-center justify-center text-[#12b886] mb-5 group-hover:scale-110 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t.serviceBills}</h3>
                <p className="text-xs text-[#e7fdf8]/60 leading-relaxed mb-6">{t.serviceBillsDesc}</p>
              </div>
              <span className="text-[#12b886] group-hover:underline inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <span>{isFR ? "Consulter la page dédiée" : "Access Dedicated Page"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Card requests */}
            <div 
              onClick={() => handlePageNav("/cards", "/fr/cartes")}
              className="p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 bg-[#0c4035] rounded-xl flex items-center justify-center text-[#12b886] mb-5 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t.serviceCards}</h3>
                <p className="text-xs text-[#e7fdf8]/60 leading-relaxed mb-6">{t.serviceCardsDesc}</p>
              </div>
              <span className="text-[#12b886] group-hover:underline inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <span>{isFR ? "Consulter la page dédiée" : "Access Dedicated Page"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Onboarding */}
            <div 
              onClick={() => handlePageNav("/account", "/fr/compte")}
              className="p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 bg-[#0d7e67]/20 rounded-xl flex items-center justify-center text-[#12b886] mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{isFR ? "Création & Vérification KYC" : "Account Verification & KYC"}</h3>
                <p className="text-xs text-[#e7fdf8]/60 leading-relaxed mb-6">
                  {isFR 
                    ? "Inscrivez-vous en ligne, déposez vos pièces d'identité et validez par OTP SMS sous un haut niveau de conformité."
                    : "Create verified neobanking profiles securely using Recto/Verso legal ID card uploads and OTP protocols."
                  }
                </p>
              </div>
              <span className="text-[#12b886] group-hover:underline inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <span>{isFR ? "Consulter la page dédiée" : "Access Dedicated Page"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Custom Support */}
            <div 
              onClick={() => handlePageNav("/contact", "/fr/contact")}
              className="p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 bg-[#0e494a] rounded-xl flex items-center justify-center text-[#12b886] mb-5 group-hover:scale-110 transition-transform">
                  <MessageSquareText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t.serviceSupport}</h3>
                <p className="text-xs text-[#e7fdf8]/60 leading-relaxed mb-6">{t.serviceSupportDesc}</p>
              </div>
              <span className="text-[#12b886] group-hover:underline inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                <span>{isFR ? "Consulter la page dédiée" : "Access Dedicated Page"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE STATISTICS */}
      <section className="py-16 bg-[#0b2a2f] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center select-none">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#12b886]">250,000+</div>
              <div className="text-[11px] text-[#e7fdf8]/60 font-medium uppercase tracking-wider">{t.statsTransactions}</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#12b886]">50,000+</div>
              <div className="text-[11px] text-[#e7fdf8]/60 font-medium uppercase tracking-wider">{t.statsCustomers}</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#12b886]">99.99%</div>
              <div className="text-[11px] text-[#e7fdf8]/60 font-medium uppercase tracking-wider">{t.statsAvailability}</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#12b886]">24/7 / 365</div>
              <div className="text-[11px] text-[#e7fdf8]/60 font-medium uppercase tracking-wider">{t.statsSupport}</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. EXCLUSIVE CRED-CARD SERVICES HIGH-END SHOWCASE */}
      <section className="py-20 bg-[#091e21] border-t border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 text-left space-y-6">
              
              <span className="px-3 py-1 bg-[#12b886]/10 border border-[#12b886]/25 rounded-full text-[10px] font-mono font-bold text-[#12b886] uppercase tracking-widest">
                {isFR ? "Technologie Métallique & Glassmorphism" : "Metal & Glassmorphic Precision"}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {isFR ? "Gérez vos plafonds de cartes en" : "Lock / Unlock Card Services, "}{" "}
                <span className="text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {isFR ? "temps réel." : "Instantly."}
                </span>
              </h2>

              <p className="text-sm text-[#e7fdf8]/75 leading-relaxed">
                {isFR 
                  ? "Chaque carte TrustSend (Visa Classic ou Mastercard Elite) bénéficie d'une gestion autonome totale. Verrouillez de manière temporaire si vous l'égarez, modifiez vos plafonds journaliers d'achat et retirez dans n'importe quel guichet automatique au Maroc."
                  : "Experience total control over physical limits. Turn on contactless options, request virtual burn-on-use cards, toggle local/ATM restrictions, and configure emergency lost-reports with zero delay."
                }
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2.5 bg-[#0b2a2f] p-3 rounded-xl border border-white/5">
                  <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-md"><Check className="w-4 h-4" /></div>
                  <span>{isFR ? "Paiements internet à l'international" : "International safe web settlements"}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#0b2a2f] p-3 rounded-xl border border-white/5">
                  <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-md"><Check className="w-4 h-4" /></div>
                  <span>{isFR ? "Blocage instantané temporaire" : "One-click security freezing"}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handlePageNav("/cards", "/fr/cartes")}
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white font-bold text-xs rounded-lg flex items-center gap-2"
                >
                  <span>{isFR ? "Voir nos offres de cartes" : "Learn About Card Tiers"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right side: Realistic 3D floating Glassmorphism Card */}
            <div className="lg:col-span-5 flex justify-center perspective-[1000px]">
              
              <div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full max-w-[340px] aspect-[1.58/1] rounded-2xl p-6 relative select-none cursor-pointer transition-all duration-200 shadow-2xl overflow-hidden border border-white/20 hover:shadow-[#12b886]/10"
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
                  backdropFilter: "blur(20px)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Visual glow orb overlay */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#12b886]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0d7e67]/25 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Details */}
                <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-[#12b886] font-extrabold uppercase">MASTERCARD ELITE</span>
                    <h4 className="text-base font-extrabold text-white mt-0.5">TrustSend</h4>
                  </div>
                  
                  {/* EMV Micro Chip Representation */}
                  <div className="h-6 w-8 bg-gradient-to-br from-yellow-100 via-amber-400 to-yellow-600 rounded-md border border-amber-600/20 shadow flex flex-col justify-between p-1">
                    <div className="h-[2px] w-full bg-black/15 rounded" />
                    <div className="h-[2px] w-full bg-black/15 rounded" />
                    <div className="h-[2px] w-full bg-black/15 rounded" />
                  </div>
                </div>

                {/* Wireless Symbol Placeholder */}
                <div className="my-2 text-left text-white/40" style={{ transform: "translateZ(20px)" }}>
                  <Wifi className="w-4 h-4 rotate-90" />
                </div>

                {/* Card Number */}
                <div className="my-3 text-left" style={{ transform: "translateZ(45px)" }}>
                  <p className="font-mono text-sm tracking-widest text-white font-extrabold">
                    5248 9912 8412 9821
                  </p>
                </div>

                {/* Bottom specific logos */}
                <div className="flex justify-between items-end mt-4" style={{ transform: "translateZ(30px)" }}>
                  <div className="text-left">
                    <span className="text-[7px] text-white/50 block font-sans uppercase tracking-wider">{isFR ? "Titulaire" : "Holder Name"}</span>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">MOHAMED EL IDRISSI</p>
                  </div>

                  {/* Red/Yellow dual circle Mastercard layout */}
                  <div className="flex -space-x-2.5 shrink-0">
                    <div className="h-5.5 w-5.5 rounded-full bg-red-600/80" />
                    <div className="h-5.5 w-5.5 rounded-full bg-yellow-500/80" />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. MULTI-DEVICE MOBILE APP SHOWCASE */}
      <section className="py-20 bg-[#0b2a2f] relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left space-y-6">
              
              <span className="px-3 py-1 bg-[#12b886]/10 border border-[#12b886]/20 rounded-full text-[10px] font-mono font-bold text-[#12b886] uppercase tracking-wider">
                {isFR ? "Application mobile en direct" : "Responsive Native Experience"}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {isFR ? "Suivez tous vos transferts en mobilité." : "Audits and Settle Charges on the Go."}
              </h2>
              
              <p className="text-sm text-[#e7fdf8]/75 leading-relaxed">
                {isFR 
                  ? "Emportez votre compte neobancaire partout au Maroc et à l'étranger. Réalisez des transferts d'argent instantanés, réglez vos factures, consultez vos historiques de transactions audités, le tout disponible sur les plateformes officielles."
                  : "Draft cash picking reference codes, lock cards, upload identity front/back scans synchronously, and consult support messages on our secure lightweight wrapper."
                }
              </p>

              {/* Verified Apple App Store and Google Play Badge integration */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#download" 
                  className="inline-block transition-transform hover:scale-105"
                  onClick={(e) => { e.preventDefault(); onOpenAuth(); }}
                >
                  <img 
                    src={appStoreBadge} 
                    alt={isFR ? "Télécharger dans l'App Store" : "Download on the App Store"} 
                    className="h-10 w-auto opacity-95 hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                </a>
                <a 
                  href="#download" 
                  className="inline-block transition-transform hover:scale-105"
                  onClick={(e) => { e.preventDefault(); onOpenAuth(); }}
                >
                  <img 
                    src={googlePlayBadge} 
                    alt={isFR ? "Disponible sur Google Play" : "Get it on Google Play"} 
                    className="h-10 w-auto opacity-95 hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                </a>
              </div>
            </div>

            {/* Smartphone screen mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[9/19] bg-[#091e21] border-[10px] border-slate-900 rounded-[44px] shadow-2xl p-4 overflow-hidden text-left flex flex-col justify-between">
                
                {/* Speaker top camera notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <span className="h-1 w-8 bg-white/10 rounded-full" />
                </div>

                <div className="pt-6 h-full flex flex-col justify-between text-xs space-y-4">
                  
                  {/* Header info */}
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>9:41</span>
                    <span className="text-[#12b886]">5G LTE</span>
                  </div>

                  {/* Balance card */}
                  <div className="bg-white/5 border border-white/15 p-4 rounded-xl space-y-2 mt-4">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest">{isFR ? "Solde instantané" : "Instant Balance"}</span>
                    <h3 className="text-xl font-mono font-extrabold text-[#12b886]">18,450.00 MAD</h3>
                  </div>

                  {/* Transfer timeline log */}
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-[10px] space-y-2">
                    <p className="text-[#12b886] font-bold">✔ REFERENCE COMPLIANCE MATCH</p>
                    <p className="text-white/40 font-mono">CODE: TS-441292</p>
                  </div>

                  <div className="space-y-1 bg-gradient-to-r from-[#0d7e67] to-[#12b886] p-3 rounded-xl text-center text-[10px]">
                    <p className="font-bold text-white">{isFR ? "Service Sécurisé Certifié" : "Certified Security System"}</p>
                    <p className="text-white/70">PCI-DSS Level 1 Encryption</p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 bg-[#091e21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {isFR ? "Le choix de nos clients" : "Global User Endorsement"}
            </h2>
            <p className="text-xs text-[#e7fdf8]/50">
              {isFR ? "Découvrez pourquoi plus de 50 000 marocains font confiance à TrustSend." : "Real testimonies confirming safe and efficient neobanking settlements."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="p-6 bg-[#0b2a2f] border border-white/5 rounded-2xl flex flex-col justify-between text-left relative"
              >
                <div className="absolute top-4 right-4 text-[#12b886]/10 text-6xl font-serif select-none pointer-events-none">“</div>
                
                <p className="text-xs text-[#e7fdf8]/85 leading-relaxed italic mb-8 relative z-10 font-normal">
                  "{t.text}"
                </p>

                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-[#0d7e67]/30 rounded-full flex items-center justify-center font-bold text-sm text-[#12b886]">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-[#e7fdf8]/50 font-normal">{t.role} • <span className="text-[#12b886]">{t.city}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-20 bg-[#091e21] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-2">{t.faqTitle}</h2>
            <p className="text-xs text-[#e7fdf8]/60">{t.faqSubtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqList.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0b2a2f] border border-white/10 rounded-xl overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex justify-between items-center text-sm font-semibold text-white/95 hover:text-white cursor-pointer focus:outline-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#12b886] shrink-0 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#e7fdf8]/75 border-t border-white/5 leading-relaxed bg-black/10">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section id="contact" className="py-20 bg-[#0b2a2f] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Col Info */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-3">{t.contactTitle}</h2>
                <p className="text-xs text-[#e7fdf8]/75">{t.contactSubtitle}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0d7e67]/20 rounded-lg text-[#12b886]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">TrustSend Head Office</p>
                    <p className="text-[#e7fdf8]/60">Avenue Anfa, 5th Floor, Casablanca, Morocco</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0d7e67]/20 rounded-lg text-[#12b886]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Interactive Help Desk</p>
                    <p className="text-[#e7fdf8]/60">support@trustsend.co | +212 522 990011</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#091e21] border border-white/10 rounded-2xl p-4 w-full aspect-[16/9] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#12b886_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-15" />
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10,50 L 300,50 M 50,10 L 50,200 M 120,0 L 250,200" stroke="#12b886" strokeWidth="1" strokeDasharray="4 2" />
                </svg>
                <div className="relative text-center space-y-2 z-10 select-none">
                  <div className="p-2 bg-[#0d7e67] rounded-full w-fit mx-auto text-white shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white">TrustSend Headquarters</p>
                  <p className="text-[10px] text-[#12b886] font-mono">33.5898° N, 7.6031° W</p>
                </div>
              </div>

            </div>

            {/* Right Form Col */}
            <div className="lg:col-span-6 bg-[#091e21]/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
              
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="p-4 bg-emerald-500/20 text-[#12b886] rounded-full">
                    <Check className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isFR ? "Message Envoyé !" : "Message Transmitted"}</h3>
                  <p className="text-xs text-[#e7fdf8]/75">
                    {isFR 
                      ? `Merci, ${contactName}. Un conseiller d'assistance TrustSend va vous recontacter sous 2 heures.` 
                      : `Thank you, ${contactName}. A sector agent will reply to ${contactEmail} within 2 business hours.`
                    }
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-1 text-left">{isFR ? "Demande de Rappel" : "Request Call Back"}</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1.5 text-left">
                      {isFR ? "Nom complet" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g., Mohamed Tazi"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#0d7e67] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1.5 text-left">
                      {isFR ? "Adresse e-mail de contact" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@domain.ma"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#0d7e67] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1.5 text-left">
                      {isFR ? "Message / détails" : "Message details"}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder={isFR ? "Détails de votre demande d'accompagnement..." : "Specify your business inquiry..."}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#0d7e67] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer"
                  >
                    <span>{isFR ? "Envoyer le message" : "Transmit Message"}</span>
                  </button>
                </form>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#091e21] border-t border-white/5 text-center text-xs text-[#e7fdf8]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-fade-in">
          <p className="font-bold text-white tracking-widest text-[#12b886]">TRUSTSEND</p>
          <p className="max-w-md mx-auto">
            Authorized Agentic Payment Services globally under PCI-DSS Level 1 specifications. Local cash draft pickups regulated under Central anti-money laundering laws.
          </p>
          <p className="pt-2">© 2026 TrustSend Financials Inc. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}
