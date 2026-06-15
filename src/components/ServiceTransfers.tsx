import React, { useState } from "react";
import { Language } from "../types";
import { CheckCircle2, ChevronRight, Search, ShieldCheck, ArrowRight, TrendingUp, DollarSign, Wallet } from "lucide-react";

interface ServiceTransfersProps {
  lang: Language;
  onOpenAuth: () => void;
}

export default function ServiceTransfers({ lang, onOpenAuth }: ServiceTransfersProps) {
  const isFR = lang === "fr";

  // Tracker State
  const [trackRef, setTrackRef] = useState("");
  const [trackingResult, setTrackingResult] = useState<{
    found: boolean;
    step: number;
    reference: string;
    sender: string;
    receiver: string;
    amount: string;
    type: string;
    status: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fee calculator states
  const [calcType, setCalcType] = useState<"NATIONAL" | "INTERNATIONAL">("NATIONAL");
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcCurrency, setCalcCurrency] = useState<"USD" | "EUR" | "MAD">("MAD");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleaned = trackRef.trim().toUpperCase();

    // Default mock reference from server
    if (cleaned === "TS-441292") {
      setTrackingResult({
        found: true,
        step: 4,
        reference: "TS-441292",
        sender: "Mohamed El Idrissi",
        receiver: "Reda Tazi",
        amount: "1,100.00 MAD",
        type: isFR ? "National" : "National",
        status: isFR ? "Livré / Retiré" : "Delivered / Disbursed"
      });
    } else if (cleaned.startsWith("TS-GBL")) {
      setTrackingResult({
        found: true,
        step: 3,
        reference: cleaned,
        sender: "Mohamed El Idrissi",
        receiver: "Youssef Benziane",
        amount: "500.00 EUR",
        type: "International",
        status: isFR ? "En Transit International" : "In International Transit"
      });
    } else if (cleaned.length > 4) {
      // Mock any other input gracefully
      setTrackingResult({
        found: true,
        step: 2,
        reference: cleaned,
        sender: isFR ? "Émetteur Authentifié" : "Verified Sender",
        receiver: isFR ? "Bénéficiaire Désigné" : "Designated Beneficiary",
        amount: "1,500.00 MAD",
        type: isFR ? "En attente" : "Pending Action",
        status: isFR ? "Vérification OTP passée" : "OTP validation passed"
      });
    } else {
      setTrackingResult(null);
    }
  };

  // Safe Math
  const getCalculatedFees = () => {
    if (calcType === "NATIONAL") {
      return { fee: 10, total: calcAmount + 10, rate: "1:1" };
    } else {
      const multiplyRate = calcCurrency === "EUR" ? 11.2 : 10.3;
      const amountInMad = calcAmount * (calcCurrency === "MAD" ? 1 : multiplyRate);
      const fee = amountInMad * 0.015 + 20;
      return {
        fee: parseFloat(fee.toFixed(2)),
        total: parseFloat((amountInMad + fee).toFixed(2)),
        rate: calcCurrency === "MAD" ? "1:1" : `1 ${calcCurrency} = ${multiplyRate} MAD`
      };
    }
  };

  const calculated = getCalculatedFees();

  return (
    <div className="bg-[#091e21] text-white min-h-screen pt-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12b886]/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 bg-[#12b886]/10 border border-[#12b886]/25 rounded-full text-xs font-semibold text-[#12b886] uppercase tracking-wider">
                {isFR ? "Remises Nationales & Internationales" : "National & International Remittances"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {isFR ? "Transférez vos fonds en toute" : "Transfer Funds with Ultimate"}{" "}
                <span className="text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {isFR ? "sérénité." : "Peace of Mind."}
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#e7fdf8]/70 leading-relaxed max-w-2xl">
                {isFR 
                  ? "Que ce soit pour un membre de votre famille au Maroc sans compte bancaire ou pour une facture fournisseur en Europe, TrustSend achemine votre argent de manière instantanée, sécurisée et certifiée PCI-DSS."
                  : "Whether assisting family members in Morocco with instant cash codes or settling invoices directly in the European Union, TrustSend guarantees PCI-DSS compliant routes with real-time status updates."
                }
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-xs font-bold rounded-lg flex items-center gap-2 transform active:scale-95 shadow-lg transition-all cursor-pointer"
                >
                  <span>{isFR ? "Envoyer des fonds" : "Initiate Direct Transfer"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#tracker"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-lg transition-all flex items-center justify-center"
                >
                  {isFR ? "Suivre un transfert" : "Track Remittance Status"}
                </a>
              </div>
            </div>

            {/* Right Asset Mockup representational */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[360px] bg-gradient-to-br from-[#0b2a2f]/80 to-[#091e21] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#12b886]/10 rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-[#12b886] font-bold">LIVE MID-MARKET CONVERSION</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#12b886]" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                    <span className="text-[10px] text-white/50">{isFR ? "Vous envoyez" : "You send"}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-lg font-bold">1,000.00</span>
                      <span className="px-2 py-1 bg-white/5 rounded text-xs font-bold">EUR</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center px-4 text-xs font-mono text-white/40">
                    <span>{isFR ? "Taux de change interbancaire" : "Mid-Market Exchange Rate"}</span>
                    <span className="text-[#12b886]">1 EUR = 11.20 MAD</span>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-[#0d7e67]/20 to-[#12b886]/10 rounded-xl border border-[#12b886]/20">
                    <span className="text-[10px] text-[#12b886] font-bold">{isFR ? "Bénéficiaire reçoit" : "Recipient gets"}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-bold text-[#12b886]">11,200.00</span>
                      <span className="px-2 py-1 bg-[#12b886]/20 text-[#12b886] rounded text-xs font-bold">MAD</span>
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-[#e7fdf8]/40 text-center uppercase tracking-wide">
                  {isFR ? "Calculs de transfert réglementés PCI-DSS" : "Calculated under PCI-DSS standards"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC FEE CALCULATOR */}
      <section className="py-16 border-t border-b border-white/5 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              {isFR ? "Simulateur de Frais de Transfert" : "Dynamic Transfer Fee Estimator"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#e7fdf8]/70 mb-1">{isFR ? "Type de transfert" : "Remittance Class"}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setCalcType("NATIONAL"); setCalcCurrency("MAD"); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${calcType === "NATIONAL" ? "bg-[#12b886] text-white" : "bg-white/5 hover:bg-white/10 text-white"}`}
                    >
                      {isFR ? "National (Maroc)" : "National (Morocco)"}
                    </button>
                    <button
                      onClick={() => setCalcType("INTERNATIONAL")}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${calcType === "INTERNATIONAL" ? "bg-[#12b886] text-white" : "bg-white/5 hover:bg-white/10 text-white"}`}
                    >
                      {isFR ? "International" : "International"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#e7fdf8]/70 mb-1">{isFR ? "Montant à envoyer" : "Amount to dispatch"}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#12b886]"
                    />
                    <div className="absolute right-2 top-1.5 flex gap-1">
                      {calcType === "INTERNATIONAL" ? (
                        <select
                          value={calcCurrency}
                          onChange={(e) => setCalcCurrency(e.target.value as any)}
                          className="bg-transparent border-none text-xs font-bold text-[#12b886] focus:outline-none pr-1 cursor-pointer"
                        >
                          <option value="EUR" className="bg-[#0b2a2f]">EUR (€)</option>
                          <option value="USD" className="bg-[#0b2a2f]">USD ($)</option>
                          <option value="MAD" className="bg-[#0b2a2f]">MAD</option>
                        </select>
                      ) : (
                        <span className="text-xs font-bold text-[#12b886] px-2">MAD</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimate Outputs */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">{isFR ? "Frais de transmission" : "Routing Network Fee"}</span>
                  <span className="font-bold text-white">{calculated.fee} MAD</span>
                </div>
                {calcType === "INTERNATIONAL" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">{isFR ? "Taux appliqué" : "Exchange conversion"}</span>
                    <span className="font-semibold text-[#12b886]">{calculated.rate}</span>
                  </div>
                )}
                <hr className="border-white/10" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-white/80">{isFR ? "Déduction totale estimée" : "Total estimated deduction"}</span>
                  <span className="text-base font-bold text-[#12b886]">{calculated.total} MAD</span>
                </div>

                <button
                  onClick={onOpenAuth}
                  className="w-full mt-3 py-2 bg-[#12b886] hover:bg-[#12b886]/90 text-white font-bold text-xs rounded-lg transition-all"
                >
                  {isFR ? "Procéder au paiement" : "Continue to transfer"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TRACKER SECTION */}
      <section id="tracker" className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isFR ? "Suivre un Transfert en Temps Réel" : "Real-Time Remittance Tracker"}
          </h2>
          <p className="text-xs text-[#e7fdf8]/60 mt-2">
            {isFR 
              ? "Saisissez la référence de votre virement ou transfert national / international (ex. TS-441292 ou TS-GBL-...) pour l'auditer immédiatement."
              : "Locate your standard invoice transfer reference (such as TS-441292 or TS-GBL-...) to review step status logs."
            }
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto shadow-xl">
          <form onSubmit={handleTrack} className="flex gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
              <input
                type="text"
                required
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder={isFR ? "Saisir la référence (ex: TS-441292)" : "Enter Reference (e.g. TS-441292)"}
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#12b886] text-white placeholder-white/20 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{isFR ? "Rechercher" : "Track"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {hasSearched && (
            trackingResult ? (
              <div className="space-y-6">
                
                {/* Visual Metadata Panel */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/25 p-4 rounded-xl border border-white/5 text-left text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isFR ? "Référence" : "Reference"}</span>
                    <span className="font-mono font-bold text-white">{trackingResult.reference}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isFR ? "Expéditeur" : "Sender"}</span>
                    <span className="font-semibold text-white">{trackingResult.sender}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isFR ? "Bénéficiaire" : "Beneficiary"}</span>
                    <span className="font-semibold text-white">{trackingResult.receiver}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isFR ? "Montant" : "Amount"}</span>
                    <span className="font-bold text-[#12b886]">{trackingResult.amount}</span>
                  </div>
                </div>

                {/* Timeline Progress Tracker */}
                <div className="relative pt-6">
                  
                  {/* Progress Line */}
                  <div className="absolute top-[38px] left-4 md:left-[12.5%] right-4 md:right-[12.5%] h-1 bg-white/10 -z-10 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0d7e67] to-[#12b886] transition-all duration-700"
                      style={{ width: trackingResult.step === 1 ? '0%' : trackingResult.step === 2 ? '33%' : trackingResult.step === 3 ? '66%' : '100%' }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${trackingResult.step >= 1 ? "bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg" : "bg-white/5 text-white/50 border border-white/10"}`}>
                        1
                      </div>
                      <span className="text-[10px] font-bold mt-2 block">{isFR ? "Enregistré" : "Registered"}</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${trackingResult.step >= 2 ? "bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg" : "bg-white/5 text-white/50 border border-white/10"}`}>
                        2
                      </div>
                      <span className="text-[10px] font-bold mt-2 block">{isFR ? "Validé OTP" : "OTP Validated"}</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${trackingResult.step >= 3 ? "bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg" : "bg-white/5 text-white/50 border border-white/10"}`}>
                        3
                      </div>
                      <span className="text-[10px] font-bold mt-2 block">{isFR ? "En Transit" : "In Transit"}</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${trackingResult.step >= 4 ? "bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg" : "bg-white/5 text-white/50 border border-white/10"}`}>
                        4
                      </div>
                      <span className="text-[10px] font-bold mt-2 block">{isFR ? "Décaissé" : "Disbursed"}</span>
                    </div>

                  </div>
                </div>

                {/* Tracking Status Note Card */}
                <div className="p-4 bg-[#12b886]/5 border border-[#12b886]/20 rounded-xl flex items-center gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-[#12b886] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">{isFR ? "Statut Actuel" : "Active Status Note"}</p>
                    <p className="text-[#e7fdf8]/75">{trackingResult.status}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-xs text-white/50 font-medium">
                {isFR 
                  ? "Référence introuvable. Veuillez vérifier et réessayer. Conseil : Essayez 'TS-441292'." 
                  : "No record matching this transfer. Verify spelling and attempt again. Pro-tip: Try searching 'TS-441292'."
                }
              </div>
            )
          )}
        </div>
      </section>

      {/* 4. DETAILS - HOW IT WORKS & BENEFITS */}
      <section className="py-16 bg-gradient-to-b from-[#091e21] to-[#0b2a2f] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isFR ? "Pourquoi choisir TrustSend ?" : "Engineered for Rapid Delivery"}
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-full h-fit mt-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{isFR ? "Conformité Strictement Bancaire" : "Strict Regulatory Compliance"}</h4>
                    <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
                      {isFR 
                        ? "Vérifications de conformité PCI-DSS de niveau 1 et double validation par OTP SMS assurant une protection bancaire à toute épreuve."
                        : "Level 1 PCI-DSS audits combined with dynamic SMS authentication keep transactions completely locked and safe against fraud."
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-full h-fit mt-1">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{isFR ? "Frais de Transfert Transparent" : "Transparent Processing Rates"}</h4>
                    <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
                      {isFR 
                        ? "Seulement 10 DH fixes de frais pour l'envoi national, et un taux transparent de 1,5% de commission pour les envois internationaux."
                        : "Flat 10 MAD processing fees for local remittances, and only a 1.5% interbank mid-market commission markup internationally."
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-full h-fit mt-1">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{isFR ? "Retraits sur Mesure par Code SMS" : "SMS Pickup Capabilities"}</h4>
                    <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
                      {isFR 
                        ? "Vos bénéficiaires ne sont pas équipés de téléphones intelligents ? Ils peuvent retirer l'argent en agence avec un simple SMS et leur CIN."
                        : "For non-registered mobile clients, TrustSend dispatches immediate SMS-coded pickup references payable instantly in cash."
                      }
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 text-left">
              <h3 className="text-lg font-bold text-[#12b886]">
                {isFR ? "Comment ça marche ?" : "How to initiate in 3 steps"}
              </h3>
              
              <ol className="space-y-5 text-xs">
                <li className="flex gap-3">
                  <span className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-[#12b886]/20 text-[#12b886]">1</span>
                  <div>
                    <p className="font-bold text-white">{isFR ? "Complétez l'identité" : "Register & Authenticate ID"}</p>
                    <p className="text-white/50">{isFR ? "Enregistrez votre CIN et complétez la vérification AML." : "Sign up in 30 seconds and verify with your national ID card."}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-[#12b886]/20 text-[#12b886]">2</span>
                  <div>
                    <p className="font-bold text-white">{isFR ? "Spécifiez le destinataire" : "Submit Recipient Protocol"}</p>
                    <p className="text-white/50">{isFR ? "Saisissez les coordonnées de votre bénéficiaire." : "Indicate the destination country, phone credentials, and total MAD sum."}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-[#12b886]/20 text-[#12b886]">3</span>
                  <div>
                    <p className="font-bold text-white">{isFR ? "Validez par code OTP" : "OTP Security Handshake"}</p>
                    <p className="text-white/50">{isFR ? "Confirmez le débit avec le code reçu sur votre téléphone." : "Validate with the dual factor code. Receipt is processed instantly."}</p>
                  </div>
                </li>
              </ol>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isFR ? "Prêt à envoyer de l'argent ?" : "Ready to Dispatch Money Safely?"}
          </h2>
          <p className="text-sm text-[#e7fdf8]/90 max-w-xl mx-auto mt-2 leading-relaxed">
            {isFR 
              ? "Rejoignez TrustSend dès aujourd'hui pour bénéficier de transferts à bas coût agréés et sécurisés sous de très hautes normes."
              : "Access the cockpit to experience beautiful instant transfers, smart wallet conversions, and downloadable compliance receipts."
            }
          </p>
          <button
            onClick={onOpenAuth}
            className="mt-6 px-8 py-3 bg-white text-[#091e21] hover:bg-white/95 text-xs font-extrabold rounded-lg shadow-lg transform active:scale-95 transition-all cursor-pointer"
          >
            {isFR ? "Obtenir mon accès gratuit" : "Access TrustSend Platform"}
          </button>
        </div>
      </section>

    </div>
  );
}
