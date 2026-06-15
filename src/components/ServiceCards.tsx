import React, { useState } from "react";
import { Language } from "../types";
import { 
  CreditCard, ShieldCheck, Check, ArrowRight, Eye, EyeOff, Lock, Unlock, Zap, HelpCircle 
} from "lucide-react";

interface ServiceCardsProps {
  lang: Language;
  onOpenAuth: () => void;
}

export default function ServiceCards({ lang, onOpenAuth }: ServiceCardsProps) {
  const isFR = lang === "fr";

  // Mock Card states
  const [isLocked, setIsLocked] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [lostReported, setLostReported] = useState(false);

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
  };

  const handleReportLost = () => {
    setLostReported(true);
    setIsLocked(true);
  };

  const handleResetSimulator = () => {
    setLostReported(false);
    setIsLocked(false);
  };

  return (
    <div className="bg-[#091e21] text-white min-h-screen pt-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12b886]/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 bg-[#12b886]/10 border border-[#12b886]/25 rounded-full text-xs font-semibold text-[#12b886] uppercase tracking-wider">
                {isFR ? "Cartes de débit physiques et virtuelles" : "Physical & Virtual Neobank Cards"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {isFR ? "Une carte conçue pour vos" : "Control Your Capital, "}{" "}
                <span className="text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {isFR ? "achats internationaux." : "Everywhere Globally."}
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#e7fdf8]/70 leading-relaxed max-w-2xl">
                {isFR 
                  ? "Optez pour notre carte Visa Classic ou notre prestigieuse Mastercard Elite. Effectuez vos paiements internet au Maroc comme sur vos abonnements à l'étranger, retirez des espèces et gérez le statut de sécurité de votre carte directement depuis votre application mobile."
                  : "Request our low-cost Visa Classic or premium Mastercard Elite cards. Enable safe international payments, draft cash from any ATM, and manage card limits or locking instantly inside the live neobanking terminal dashboard."
                }
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-2 transform active:scale-95 shadow-lg transition-all cursor-pointer"
                >
                  <span>{isFR ? "Commander ma carte" : "Get Your Card Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#simulator"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  {isFR ? "Essayer le simulateur" : "Launch Lock Simulator"}
                </a>
              </div>
            </div>

            {/* Right Interactive Mockup representation of the Card */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              
              {/* Simulator Card Box */}
              <div id="simulator" className="w-full max-w-[340px] space-y-6 bg-black/30 border border-white/10 rounded-2xl p-6 shadow-2xl text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{isFR ? "DEMO INTERACTIVE" : "LIVE MOCK INTERACTION"}</span>
                  <span className={`h-2 w-2 rounded-full ${lostReported ? "bg-red-500" : isLocked ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`} />
                </div>

                {/* Card representation */}
                <div 
                  className={`w-full aspect-[1.58/1] rounded-2xl p-5 text-left relative overflow-hidden transition-all duration-300 shadow-xl ${lostReported ? "bg-gradient-to-tr from-rose-950 to-slate-900 border border-rose-500/30 opacity-70" : isLocked ? "bg-gradient-to-tr from-amber-950 to-slate-900 border border-amber-500/30" : "bg-gradient-to-tr from-[#0b2a2f] via-[#0d7e67]/50 to-[#12b886]/40 border border-white/15"}`}
                >
                  {/* Glowing background */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#12b886]/10 rounded-full blur-2xl" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest opacity-60">MASTERCARD ELITE</span>
                      <p className="text-sm font-bold mt-1 text-white">TrustSend</p>
                    </div>
                    {/* Chip representation */}
                    <div className="h-6 w-8 bg-gradient-to-br from-amber-200 to-yellow-600 rounded-sm" />
                  </div>

                  {/* Card Number */}
                  <div className="my-4">
                    <p className="text-sm font-mono tracking-widest text-white/95">
                      {showNumbers ? "5248 9912 8412 9821" : "5248 •••• •••• 9821"}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-[7px] text-white/50 uppercase tracking-wider">{isFR ? "Titulaire" : "Card Holder"}</p>
                      <p className="text-[10px] font-semibold tracking-wider text-white">MOHAMED EL IDRISSI</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-white/50 uppercase tracking-wider">{isFR ? "Expire" : "Expires"}</p>
                      <p className="text-[10px] font-mono text-white">09/30</p>
                    </div>
                  </div>

                  {/* Locked visual overlay */}
                  {(isLocked || lostReported) && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center space-y-1">
                      <Lock className={`w-6 h-6 ${lostReported ? "text-rose-500 animate-bounce" : "text-amber-500 animate-pulse"}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        {lostReported ? (isFR ? "Carte Bloquée (Vol/Perte)" : "Card Blocked (Lost/Stolen)") : (isFR ? "Carte Verrouillée" : "Card Temporarily Blocked")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Control Toggles */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={handleToggleLock}
                    disabled={lostReported}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg font-bold border border-white/10 text-white disabled:opacity-40"
                  >
                    {isLocked ? <Unlock className="w-3.5 h-3.5 text-[#12b886]" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{isLocked ? (isFR ? "Débloquer" : "Unlock") : (isFR ? "Verrouiller" : "Lock")}</span>
                  </button>

                  <button
                    onClick={() => setShowNumbers(!showNumbers)}
                    disabled={lostReported}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg font-bold border border-white/10 text-white disabled:opacity-40"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>{showNumbers ? (isFR ? "Masquer" : "Hide") : (isFR ? "Révéler" : "Reveal")}</span>
                  </button>
                </div>

                <div>
                  {lostReported ? (
                    <button
                      onClick={handleResetSimulator}
                      className="w-full text-center py-2 bg-emerald-500/10 border border-emerald-500/20 text-[#12b886] rounded-lg text-xs font-bold"
                    >
                      {isFR ? "✓ Enregistrer un remplacement (Réinitialiser)" : "✓ Reorder EMERGENCY card (Reset demo)"}
                    </button>
                  ) : (
                    <button
                      onClick={handleReportLost}
                      className="w-full text-center py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isFR ? "Signaler Perte / Vol" : "Report Lost or Stolen"}
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. CARD FEATURES & SECURITY GRIDS */}
      <section className="py-16 bg-[#091e21] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              {isFR ? "Fonctionnalités Haut de Gamme" : "Fintech Grade Security & Control"}
            </h2>
            <p className="text-xs text-[#e7fdf8]/60 mt-2">
              {isFR 
                ? "Sentez la souveraineté sur votre budget avec une technologie de pointe."
                : "Continuous control parameters to lock, regulate limits, and protect accounts."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl text-left">
              <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-lg h-fit w-fit mb-4">
                <Unlock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{isFR ? "Verrouillage Instantané" : "On-Demand Lock/Unlock"}</h3>
              <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
                {isFR 
                  ? "Vous ne retrouvez plus votre carte ? Verrouillez-la en un clic dans votre application mobile. Retrouvée ? Déverrouillez-la instantanément."
                  : "Misplaced card? Block further operations in one click on our app. Unblock instantly when retrieved."
                }
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl text-left">
              <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-lg h-fit w-fit mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{isFR ? "Changement Instantané de Code PIN" : "Interactive Digital Pin code"}</h3>
              <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
                {isFR 
                  ? "Définissez ou modifiez votre code PIN sans passer par un guichet automatique. Changement répercuté instantanément sur la puce."
                  : "Configure, view, or rotate security PIN credentials directly on the client area module. Fully synchronized."
                }
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl text-left">
              <div className="p-1.5 bg-[#12b886]/10 text-[#12b886] rounded-lg h-fit w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{isFR ? "Garantie Responsabilité Zéro" : "Zero Liability Guarantee"}</h3>
              <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
                {isFR 
                  ? "Protégé contre les usages frauduleux. En cas de perte, les frais éventuels de ré-émission sont remboursés sous 24h."
                  : "Continuous compliance parameters ensure maximum protection. Unauthorized losses are fully refunded within 24 working hours."
                }
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. REQUEST PROCESS STEPS */}
      <section className="py-16 bg-black/20 border-t border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">{isFR ? "Comment obtenir et activer votre carte ?" : "Card Request & Activation Lifecycle"}</h2>
            <p className="text-xs text-white/50 mt-1">{isFR ? "Un processus rapide en quelques étapes simples" : "Process physical orders in three secure checkpoints."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#0b2a2f] p-5 rounded-xl border border-white/5">
              <span className="text-base font-bold text-[#12b886] block mb-2">01. {isFR ? "Commande et validation" : "Launch Request"}</span>
              <p className="text-xs text-[#e7fdf8]/70 leading-relaxed">
                {isFR 
                  ? "Rendez-vous dans la rubrique 'Mes cartes', choisissez entre Visa et Mastercard, et confirmez l'adresse de réception. Solde minimum de 50 MAD requis."
                  : "Check the cards tab inside client area, choose classic / elite, and confirm dispatch address. Minor 50 MAD balance required."
                }
              </p>
            </div>

            <div className="bg-[#0b2a2f] p-5 rounded-xl border border-white/5">
              <span className="text-base font-bold text-[#12b886] block mb-2">02. {isFR ? "Production et livraison" : "Production & Delivery"}</span>
              <p className="text-xs text-[#e7fdf8]/70 leading-relaxed">
                {isFR 
                  ? "La puce EMV est gravée et configurée. La carte est expédiée sous 3 jours ouvrés par notre coursier vers l'agence sélectionnée."
                  : "We print and program the secure EMV chip. Dispatched via premium express courier right to your local agency cabinet."
                }
              </p>
            </div>

            <div className="bg-[#0b2a2f] p-5 rounded-xl border border-white/5">
              <span className="text-base font-bold text-[#12b886] block mb-2">03. {isFR ? "Activation immédiate" : "Instant Activation"}</span>
              <p className="text-xs text-[#e7fdf8]/70 leading-relaxed">
                {isFR 
                  ? "Une fois la carte récupérée, saisissez le code d'activation fourni par SMS sur l'application. Votre carte est prête !"
                  : "After picking up the package, type the physical activation token code received on your phone. Done!"
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isFR ? "Prêt à commander votre carte ?" : "Get Your Personalized Mastercard Elite"}
          </h2>
          <p className="text-sm text-[#e7fdf8]/90 max-w-xl mx-auto mt-2 leading-relaxed">
            {isFR 
              ? "Rejoignez TrustSend pour débloquer des cartes internationales dotées de plafonds flexibles et configurables en temps réel."
              : "Experience dynamic boundaries, zero liability security covenants, and easy freezing capabilities in one elegant tool."
            }
          </p>
          <button
            onClick={onOpenAuth}
            className="mt-6 px-8 py-3 bg-white text-[#091e21] hover:bg-white/95 text-xs font-extrabold rounded-lg shadow-lg transform active:scale-95 transition-all cursor-pointer"
          >
            {isFR ? "Inscrivez-vous maintenant" : "Connect & Order Card"}
          </button>
        </div>
      </section>

    </div>
  );
}
