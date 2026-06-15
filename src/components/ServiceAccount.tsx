import React, { useState } from "react";
import { Language } from "../types";
import { 
  Users, ShieldCheck, Check, ArrowRight, Smartphone, FileCheck2, UserCheck, Lock 
} from "lucide-react";

interface ServiceAccountProps {
  lang: Language;
  onOpenAuth: () => void;
}

export default function ServiceAccount({ lang, onOpenAuth }: ServiceAccountProps) {
  const isFR = lang === "fr";

  // State for illustrative step form simulator
  const [step, setStep] = useState(1);
  const [simName, setSimName] = useState("");
  const [simPhone, setSimPhone] = useState("");
  const [simIdCard, setSimIdCard] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsDone(true);
    }
  };

  const handleResetSim = () => {
    setStep(1);
    setSimName("");
    setSimPhone("");
    setSimIdCard("");
    setIsDone(false);
  };

  return (
    <div className="bg-[#091e21] text-white min-h-screen pt-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12b886]/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 bg-[#12b886]/10 border border-[#12b886]/25 rounded-full text-xs font-semibold text-[#12b886] uppercase tracking-wider">
                {isFR ? "Création & Sécurisation de Compte" : "Account Creation & Client Onboarding"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {isFR ? "Ouvrez votre compte en" : "Digital Bank Onboarding, "}{" "}
                <span className="text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {isFR ? "quelques secondes." : "Simplified."}
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#e7fdf8]/70 leading-relaxed max-w-2xl">
                {isFR 
                  ? "Rejoignez TrustSend de manière 100% dématérialisée. Saisissez vos coordonnées, déposez vos pièces d'identité nationales de manière sécurisée et configurez votre validation de transaction par SMS OTP. Aucune paperasse, aucun frais d'ouverture cache."
                  : "Onboard with TrustSend without ever visiting a branch. Submit contacts, upload legal ID cards (CIN) to our validated gateway, and anchor transactions with immediate SMS authentication limits."
                }
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-2 transform active:scale-95 shadow-lg transition-all cursor-pointer"
                >
                  <span>{isFR ? "Ouvrir un compte" : "Onboard Account Online"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#onboarding-simulator"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  {isFR ? "Essayer l'inscription simulée" : "Test Onboarding Demo"}
                </a>
              </div>
            </div>

            {/* Right Side Step Form Simulator */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div id="onboarding-simulator" className="w-full max-w-[360px] bg-[#0b2a2f] border border-white/10 rounded-2xl p-6 shadow-2xl text-left space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[10px] font-mono text-[#12b886] font-bold uppercase">{isFR ? "INSCRIPTION SIMULÉE" : "SIMULATED ACCOUNT SETUP"}</span>
                  <span className="text-[10px] text-white/40">{isDone ? "COMPLETE" : `STEP ${step} OF 3`}</span>
                </div>

                {isDone ? (
                  <div className="text-center py-6 space-y-4 animate-fade-in">
                    <div className="h-10 w-10 bg-emerald-500/20 text-[#12b886] rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{isFR ? "Dossier Complet !" : "Dossier Successfully Logged"}</h4>
                      <p className="text-[11px] text-[#e7fdf8]/60 mt-1">
                        {isFR 
                          ? "Votre compte simulé a été créé. Pour de vrai, connectez-vous avec votre téléphone !"
                          : "This simulated flow has been compiled. Initiate real onboarding on the connect portal."
                        }
                      </p>
                    </div>
                    <button
                      onClick={handleResetSim}
                      className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold border border-white/10"
                    >
                      {isFR ? "Réinitialiser" : "Reset Simulator"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleNextStep} className="space-y-4 text-xs animate-fade-in">
                    
                    {step === 1 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-white/50">{isFR ? "Veuillez spécifier votre profil de base pour ouvrir un dossier" : "Provide core identities to provision the wallet"}</p>
                        <div>
                          <label className="block text-[10px] text-white/60 mb-1">{isFR ? "Nom complet légal" : "Full Legal Name"}</label>
                          <input
                            type="text"
                            required
                            value={simName}
                            onChange={(e) => setSimName(e.target.value)}
                            placeholder="e.g. Reda Taghi"
                            className="w-full bg-black/40 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-[#12b886]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/60 mb-1">{isFR ? "Numéro de téléphone" : "Mobile Phone Number"}</label>
                          <input
                            type="tel"
                            required
                            value={simPhone}
                            onChange={(e) => setSimPhone(e.target.value)}
                            placeholder="+212 600000000"
                            className="w-full bg-black/40 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-[#12b886]"
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-white/50">{isFR ? "Chargez une copie recto de votre pièce d'identité (CIN)" : "Verify credentials against a legal Identity Card"}</p>
                        <div>
                          <label className="block text-[10px] text-white/60 mb-1">{isFR ? "Code d'enregistrement (N° CIN / ID)" : "ID Reference Number (e.g. CIN Code)"}</label>
                          <input
                            type="text"
                            required
                            value={simIdCard}
                            onChange={(e) => setSimIdCard(e.target.value)}
                            placeholder="e.g. G781292"
                            className="w-full bg-black/40 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-[#12b886]"
                          />
                        </div>
                        <div className="border border-dashed border-white/10 rounded-xl p-3 text-center bg-black/20">
                          <span className="text-[9px] text-[#12b886] font-semibold">{isFR ? "✓ Copie ID_Recto_Mock.png sélectionnée" : "✓ ID_Scan_Front.png attached"}</span>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-white/50">{isFR ? "Vérification OTP : Saisissez le code d'authentification reçu" : "Security Checkpoint: Validate with simulated code '1234'"}</p>
                        <div className="bg-[#12b886]/5 border border-[#12b886]/10 p-2 text-[10px] rounded-lg">
                          <p>{isFR ? "Dispositif OTP : Code simulator SMS : 1234" : "Onboarding OTP Code: SMS simulator: 1234"}</p>
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/60 mb-1">{isFR ? "Saisir le code SMS à 4 chiffres" : "Type 4-digit verification code"}</label>
                          <input
                            type="text"
                            maxLength={4}
                            required
                            defaultValue="1234"
                            className="w-full bg-black/40 border border-white/10 rounded py-1.5 px-2.5 text-center font-mono font-bold text-xs focus:outline-none focus:border-[#12b886]"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-[10px] font-bold"
                        >
                          {isFR ? "Retour" : "Back"}
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-[#12b886] hover:bg-[#12b886]/90 text-white rounded text-[10px] font-bold text-center"
                      >
                        {step === 3 ? (isFR ? "Terminer" : "Complete Onboarding") : (isFR ? "Continuer" : "Continue")}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. SPECIFIC ACCOUNT PROCESS MODULES */}
      <section className="py-16 bg-[#091e21] border-t border-white/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">
            {isFR ? "Le Protocole de Vérification d'Identité" : "Onboarding Compliance & Security Rules"}
          </h2>
          <p className="text-xs text-[#e7fdf8]/60 mt-2">
            {isFR 
              ? "Chez TrustSend, nous opérons sous licence financière de premier plan. La sécurité de nos clients est garantie par des exigences KYC strictes."
              : "As a compliant fintech, TrustSend protects capital limits against malicious use with robust KYC architectures."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl text-left space-y-3">
            <div className="p-2.5 bg-[#12b886]/10 text-[#12b886] rounded-xl w-fit">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">{isFR ? "1. Enregistrement KYC numérique" : "1. Digital KYC Submission"}</h3>
            <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
              {isFR 
                ? "Déposez une copie de votre carte d'identité marocaine (CIN). Vos informations font l'objet d'audits chiffrés pour prévenir l'usurpation d'identité."
                : "Submit digital scans of your official identification. Encrypted credentials pass verification to prevent active identity theft."
              }
            </p>
          </div>

          <div className="p-6 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl text-left space-y-3">
            <div className="p-2.5 bg-[#12b886]/10 text-[#12b886] rounded-xl w-fit">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">{isFR ? "2. Authentification Forte SMS" : "2. Two Factor SMS Bindings"}</h3>
            <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
              {isFR 
                ? "Chaque session de connexion et chaque exécution de virement nécessite un code à 4 chiffres à usage unique envoyé à votre numéro vérifié."
                : "Every session handshake and transaction debit depends on a secure, single-use OTP SMS dispatch to verify user authority."
              }
            </p>
          </div>

          <div className="p-6 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl text-left space-y-3">
            <div className="p-2.5 bg-[#12b886]/10 text-[#12b886] rounded-xl w-fit">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">{isFR ? "3. Validation Administrateur" : "3. Admin Verification"}</h3>
            <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">
              {isFR 
                ? "Notre équipe d'administration passe en revue vos documents sous 2 heures ouvrées pour libérer vos limites de transfert d'argent."
                : "A certified human administrator audits submitted files within 2 business hours to release transaction constraints safely."
              }
            </p>
          </div>

        </div>
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isFR ? "Rejoignez l'élite neobanking" : "Create Your Fully-Audit Account Now"}
          </h2>
          <p className="text-sm text-[#e7fdf8]/90 max-w-xl mx-auto mt-2 leading-relaxed">
            {isFR 
              ? "Commencez dès maintenant en créant votre profil pour lever les plafonds de transfert et de paiement de factures au Maroc."
              : "Access robust conversion multipliers, low-cost routing pathways, and printable utility bill receipts in a centralized vault."
            }
          </p>
          <button
            onClick={onOpenAuth}
            className="mt-6 px-8 py-3 bg-white text-[#091e21] hover:bg-white/95 text-xs font-extrabold rounded-lg shadow-lg transform active:scale-95 transition-all cursor-pointer"
          >
            {isFR ? "Devenir client TrustSend" : "Launch Registration Protocol"}
          </button>
        </div>
      </section>

    </div>
  );
}
