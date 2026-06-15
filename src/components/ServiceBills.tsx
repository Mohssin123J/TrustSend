import React, { useState } from "react";
import { Language } from "../types";
import { 
  Receipt, ShieldCheck, Check, Info, ArrowRight, Droplet, 
  Flame, Wifi, Smartphone, Landmark, Car, Train, Ticket, CreditCard, ChevronRight 
} from "lucide-react";

interface ServiceBillsProps {
  lang: Language;
  onOpenAuth: () => void;
}

export default function ServiceBills({ lang, onOpenAuth }: ServiceBillsProps) {
  const isFR = lang === "fr";

  // Active Simulated Biller
  const [activeBiller, setActiveBiller] = useState<string | null>(null);
  const [accountRef, setAccountRef] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("120");
  const [paymentStep, setPaymentStep] = useState<"SELECT" | "REF_CHECK" | "CONFIRM" | "RECEIPT">("SELECT");
  const [errorMessage, setErrorMessage] = useState("");

  const billerCategories = [
    {
      id: "WATER",
      label: isFR ? "Factures d'Eau" : "Water Bills",
      icon: Droplet,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/25",
      sampleBillers: ["Lydec (Casablanca)", "Amendis (Tanger)", "Redal (Rabat)", "Radeema (Marrakech)"]
    },
    {
      id: "ELECTRICITY",
      label: isFR ? "Électricité" : "Electricity Bills",
      icon: Flame,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/25",
      sampleBillers: ["ONEE d'Électricité", "Redal Électricité", "Lydec Électricité"]
    },
    {
      id: "INTERNET",
      label: isFR ? "Factures Internet / Fibre" : "Internet Bills",
      icon: Wifi,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
      sampleBillers: ["Maroc Telecom Fibre", "Orange Internet ADSL", "inwi Home LH"]
    },
    {
      id: "RECHARGE",
      label: isFR ? "Recharges Mobiles" : "Mobile Recharge",
      icon: Smartphone,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/25",
      sampleBillers: ["IAM Recharge *3", "Orange Recharge *6", "inwi Recharge Win"]
    },
    {
      id: "FINE",
      label: isFR ? "Amendes de Circulation" : "Traffic Fines",
      icon: Landmark,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/25",
      sampleBillers: ["Amendes RADAR National", "Tribunal Administratif"]
    },
    {
      id: "TAX",
      label: isFR ? "Taxe de Véhicule (Vignette)" : "Vehicle Tax",
      icon: Car,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/25",
      sampleBillers: ["Vignette Automobile Maroc", "DGI Taxe Spéciale Annuelle"]
    },
    {
      id: "TRAIN",
      label: isFR ? "Billets de Train (ONCF)" : "Train Tickets",
      icon: Train,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      sampleBillers: ["ONCF Al Boraq", "ONCF Train de Ligne"]
    },
    {
      id: "BUS",
      label: isFR ? "Billets d'Autobus (CTM)" : "Bus Tickets",
      icon: Ticket,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/25",
      sampleBillers: ["CTM Voyageurs", "Supratours National", "Ghazala Trans"]
    }
  ];

  const handleBillerSelect = (bId: string) => {
    setActiveBiller(bId);
    setPaymentStep("REF_CHECK");
    setErrorMessage("");
  };

  const handleRefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountRef.length < 5) {
      setErrorMessage(isFR ? "La référence de l'abonné doit faire plus de 5 caractères." : "The subscriber reference identifier must contain at least 5 alphanumeric characters.");
      return;
    }
    setPaymentStep("CONFIRM");
    setErrorMessage("");
  };

  const handlePayConfirm = () => {
    setPaymentStep("RECEIPT");
  };

  const selectedCategory = billerCategories.find(b => b.id === activeBiller);

  return (
    <div className="bg-[#091e21] text-white min-h-screen pt-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#12b886]/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 bg-[#12b886]/10 border border-[#12b886]/25 rounded-full text-xs font-semibold text-[#12b886] uppercase tracking-wider">
                {isFR ? "Regroupement de Factures de Services Publics" : "Unified Utility & Bills Settlement Hub"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {isFR ? "Réglez vos charges en" : "Settle All Personal Charges, "}{" "}
                <span className="text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {isFR ? "un seul clic." : "Instantly."}
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#e7fdf8]/70 leading-relaxed max-w-2xl">
                {isFR 
                  ? "Eau, électricité, abonnement internet, péages ou vignettes automobiles... Gagnez du temps grâce à notre agrégateur de facturation agréé par l'État. Des reçus PDF officiels de paiement sont générés en direct après règlement securisé."
                  : "Water, electricity, internet fibres, municipal traffic fines, or transport tickets — avoid agency lines by organizing settlements on our certified gateway. Official PDF records are securely logged and archived immediately."
                }
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#billers"
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-2 transform active:scale-95 shadow-lg transition-all"
                >
                  <span>{isFR ? "Consulter les créanciers" : "Browse Service Providers"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#workflow-demo"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-lg transition-all flex items-center justify-center"
                >
                  {isFR ? "Voir la démonstration" : "Simulate Payment"}
                </a>
              </div>
            </div>

            {/* Right Side Visual Illustration Representational */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[360px] bg-gradient-to-tr from-[#12b886]/20 via-[#0d7e67]/5 to-transparent border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <Receipt className="w-10 h-10 text-[#12b886] mx-auto animate-bounce mt-4" />
                <h3 className="text-base font-bold text-center mt-2">{isFR ? "Émission d'Attestations PDF" : "Compliance PDF Dispatch"}</h3>
                <p className="text-xs text-center text-[#e7fdf8]/60 px-2 leading-relaxed">
                  {isFR 
                    ? "Chaque paiement transmet un reçu codé par jeton cryptographique certifié auprès de la DGI et des régies d'eau marocaines."
                    : "Every settlement registers a cryptographic token certified with standard public and tax ministries."
                  }
                </p>
                
                <div className="border border-white/10 bg-black/30 rounded-lg p-3 text-left font-mono text-[9.5px] text-white/50 space-y-1">
                  <p className="text-[#12b886]">✔ METROPOLITAN REGISTRY: IN-STAMP</p>
                  <p>✔ FISCAL ID: TS-BILL-992381</p>
                  <p>✔ REDAL AMORTISATION: COMPLETE</p>
                  <p>✔ STATUS: COMPLIANT</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DEDICATED BILLERS SERVICES GRID */}
      <section id="billers" className="py-16 bg-[#091e21] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              {isFR ? "8 Catégories de Paiement Direct" : "8 Key Direct Billing Sectors"}
            </h2>
            <p className="text-xs text-[#e7fdf8]/60 mt-2">
              {isFR 
                ? "Sélectionnez une catégorie ci-dessous pour tester notre workflow illustré interactif."
                : "Choose a segment below to launch our interactive multi-step workflow simulator."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {billerCategories.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  onClick={() => handleBillerSelect(b.id)}
                  className={`p-5 bg-[#0b2a2f] border border-white/10 rounded-2xl hover:border-[#12b886]/40 transition-all hover:-translate-y-1 text-left cursor-pointer flex flex-col justify-between group`}
                >
                  <div className="space-y-4">
                    <div className={`p-3 rounded-xl border w-fit ${b.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{b.label}</h3>
                      <p className="text-[11px] text-[#e7fdf8]/50">
                        {isFR ? "Organismes agréés :" : "Supported Billers:"} {b.sampleBillers.slice(0, 2).join(", ")}...
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] text-[#12b886] font-semibold mt-4 flex items-center gap-1 group-hover:underline">
                    {isFR ? "Ouvrir le simulateur" : "Open Simulator"} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. SIMULATOR WORKFLOW DEMO */}
      <section id="workflow-demo" className="py-16 bg-black/20 border-t border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold">
              {isFR ? "Simulateur de Règlement de Factures" : "Interactive Payment Workflow Simulator"}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {isFR 
                ? "Expérimentez notre parcours premium de règlement en 4 étapes simples sans carte de crédit !"
                : "Review the standard neobanking transaction workflow in 4 responsive mock stages."
              }
            </p>
          </div>

          <div className="bg-[#0b2a2f] border border-white/10 rounded-2xl p-6 md:p-8">
            
            {/* Step Indicators */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/10 -z-10" />
              
              {["SELECT", "REF_CHECK", "CONFIRM", "RECEIPT"].map((st, idx) => {
                const isActive = paymentStep === st;
                const isCompleted = ["SELECT", "REF_CHECK", "CONFIRM", "RECEIPT"].indexOf(paymentStep) >= idx;
                return (
                  <div
                    key={st}
                    className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#0b2a2f] ${isActive ? "bg-[#12b886] text-white" : isCompleted ? "bg-[#0d7e67] text-white" : "bg-white/5 text-white/30 border border-white/10"}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            {/* Step 1: SELECT CATEGORY */}
            {paymentStep === "SELECT" && (
              <div className="space-y-4 text-center py-6">
                <p className="text-xs text-[#e7fdf8]/70">
                  {isFR ? "Étape 1 : Choisissez d'abord l'un des postes de facturation ci-dessus." : "Stage 1: Please select one of the utility segments from our direct grids above."}
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {billerCategories.slice(0, 4).map(bc => (
                    <button
                      key={bc.id}
                      onClick={() => handleBillerSelect(bc.id)}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#12b886] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {bc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: VERIFY EXPOSITION */}
            {paymentStep === "REF_CHECK" && selectedCategory && (
              <form onSubmit={handleRefSubmit} className="space-y-4 text-left">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 mb-2">
                  <div className="p-2 bg-[#12b886]/10 text-[#12b886] rounded-lg">
                    <selectedCategory.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{selectedCategory.label}</h4>
                    <p className="text-[10px] text-white/50">{isFR ? "Organismes certifiés connectés" : "Real-time state verification online"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#e7fdf8]/70 mb-1.5">{isFR ? "Sélectionnez le créancier" : "Choose the billing organization"}</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#12b886] text-white">
                    {selectedCategory.sampleBillers.map((op, i) => (
                      <option key={i} value={op} className="bg-[#0b2a2f]">{op}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#e7fdf8]/70 mb-1.5">{isFR ? "Référence Contrat / Facture (min 5 chiffres)" : "Billing Account Reference Number (Min 5 alphanumeric)"}</label>
                  <input
                    type="text"
                    required
                    value={accountRef}
                    onChange={(e) => setAccountRef(e.target.value)}
                    placeholder="e.g. REF-REG-10928a"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#12b886] text-white"
                  />
                  {errorMessage && <p className="text-xs text-rose-400 mt-1">{errorMessage}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentStep("SELECT")}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    {isFR ? "Retour" : "Back"}
                  </button>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#12b886] hover:opacity-95 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    {isFR ? "Auditer la facture" : "Verify Invoice"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: INTERACTIVE BALANCE & CONFIRM CHIP */}
            {paymentStep === "CONFIRM" && selectedCategory && (
              <div className="space-y-4 text-left">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-white/50 uppercase block tracking-wider">{isFR ? "Détails de l'obligation" : "Verified invoice specifics"}</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-white">{isFR ? "Référence Contrat" : "Account Ref"}</span>
                    <span className="font-mono text-xs text-white">{accountRef}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-bold text-white">{isFR ? "Niveau de charge" : "Assessed outstanding dues"}</span>
                    <span className="text-sm font-bold text-[#12b886]">120.00 MAD</span>
                  </div>
                </div>

                <div className="flex gap-2.5 bg-[#12b886]/5 border border-[#12b886]/10 p-3 rounded-lg text-xs leading-relaxed text-[#e7fdf8]/80">
                  <Info className="w-4 h-4 text-[#12b886] shrink-0 mt-0.5" />
                  <p>
                    {isFR 
                      ? "Paiement direct depuis votre compte TrustSend. Aucun frais additionnel n'est retenu." 
                      : "Direct debt authorization. Settlement processes instantly without credit card fees."
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentStep("REF_CHECK")}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    {isFR ? "Retour" : "Modify Details"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePayConfirm}
                    className="w-full py-2 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    {isFR ? "Confirmer et Payer" : "Authorize Settlement"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: SUCCESS WITH PDF RECEIPT */}
            {paymentStep === "RECEIPT" && (
              <div className="text-center py-6 space-y-4">
                <div className="h-12 w-12 bg-emerald-500/20 text-[#12b886] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 animate-scale-up" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{isFR ? "Facture acquittée avec succès !" : "Invoice Settle successfully!"}</h3>
                  <p className="text-xs text-[#e7fdf8]/70">
                    {isFR ? "La transaction a été validée avec les fonds du portefeuille." : "A certificate receipt has been registered."}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-xl p-3 max-w-sm mx-auto text-left font-mono text-[10px] space-y-1">
                  <p className="text-white/40">{isFR ? "REÇU NUMÉRIQUE AUTONOME" : "OFFICIAL RECEIPT METADATA"}</p>
                  <p><span className="text-white/40">REF:</span> TS-BILL-{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p><span className="text-white/40">PROVIDER:</span> REDAL INC</p>
                  <p><span className="text-white/40">DEBITED:</span> 120.00 MAD</p>
                </div>

                <div className="flex gap-2 justify-center max-w-xs mx-auto">
                  <button
                    onClick={() => { setPaymentStep("SELECT"); setActiveBiller(null); setAccountRef(""); }}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-lg cursor-pointer flex-1"
                  >
                    {isFR ? "Nouveau paiement" : "Settle another"}
                  </button>
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg cursor-pointer flex-1 whitespace-nowrap"
                  >
                    {isFR ? "Se Connecter" : "Access Webapp"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 4. SECURITY & FEES SUMMARY */}
      <section className="py-16 bg-[#091e21] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="text-left space-y-4">
            <h2 className="text-2xl font-bold">{isFR ? "Frais de Règlement" : "Settlement Surcharge Policy"}</h2>
            <p className="text-xs text-[#e7fdf8]/70 leading-relaxed">
              {isFR 
                ? "Chez TrustSend, le règlement de vos charges courantes (eau, électricité, amendes ou vignettes) est exempt de frais. Aucun coût additionnel ou frais de commodité n'est imposé, contrairement aux guichets classiques."
                : "While other neobanks and physical bureaus append high transaction convenience fees, TrustSend organizes direct public agency linkages completely charge-free."
              }
            </p>
            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="p-3 bg-[#0b2a2f] border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-white">0.00 MAD</p>
                <p className="text-[9px] text-white/50">{isFR ? "Factures d'Eau" : "Water Utilities"}</p>
              </div>
              <div className="p-3 bg-[#0b2a2f] border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-white">0.00 MAD</p>
                <p className="text-[9px] text-white/50">{isFR ? "Électricité" : "Electricity"}</p>
              </div>
              <div className="p-3 bg-[#0b2a2f] border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-white">0.00 MAD</p>
                <p className="text-[9px] text-white/50">{isFR ? "Amendes" : "Fines"}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0b2a2f] p-6 rounded-2xl border border-white/10 text-left space-y-4 relative">
            <div className="p-3 bg-[#12b886]/10 text-[#12b886] rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-white">{isFR ? "Paiement Direct Certifié" : "Certified Direct Settlement protocol"}</h3>
            <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
              {isFR 
                ? "Notre plateforme est certifiée conforme à la norme de sécurité PCI-DSS de niveau 1. Les connexions à vos espaces créanciers sont sécurisées avec un cryptage matériel AES-256."
                : "Your connection holds continuous military-grade AES-256 transport security. Transaction receipts generated automatically can be presented to public utilities as definitive physical amortization proof."
              }
            </p>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isFR ? "Vos factures s'accumulent ?" : "Streamline Your Obligations Today"}
          </h2>
          <p className="text-sm text-[#e7fdf8]/90 max-w-xl mx-auto mt-2 leading-relaxed">
            {isFR 
              ? "Accédez à notre tableau de bord pour payer l'ensemble de vos factures CTM, CGE, Redal, Vignettes et amendes marocaines en un clin d'œil."
              : "Access the client cockpit now to settle your water, electricity, and transport ticket dues immediately with instant receipt downloads."
            }
          </p>
          <button
            onClick={onOpenAuth}
            className="mt-6 px-8 py-3 bg-white text-[#091e21] hover:bg-white/95 text-xs font-extrabold rounded-lg shadow-lg transform active:scale-95 transition-all cursor-pointer"
          >
            {isFR ? "Créer mon compte gratuit" : "Sign Up and Pay Bills"}
          </button>
        </div>
      </section>

    </div>
  );
}
