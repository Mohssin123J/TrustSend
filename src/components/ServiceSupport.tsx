import React, { useState } from "react";
import { Language } from "../types";
import { 
  MessageSquare, ShieldCheck, Mail, Send, ChevronDown, Check, Search, Calendar, User, UserCheck 
} from "lucide-react";

interface ServiceSupportProps {
  lang: Language;
  onOpenAuth: () => void;
}

export default function ServiceSupport({ lang, onOpenAuth }: ServiceSupportProps) {
  const isFR = lang === "fr";

  // State for Contact message
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactDone, setContactDone] = useState(false);

  // State for Ticket Tracking
  const [ticketSearch, setTicketSearch] = useState("");
  const [trackedTicket, setTrackedTicket] = useState<{
    reference: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    messages: { sender: string; msg: string; time: string }[];
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [newReplyText, setNewReplyText] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactDone(true);
    setTimeout(() => {
      setContactDone(false);
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setContactSubject("");
    }, 4000);
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const ref = ticketSearch.trim().toUpperCase();

    if (ref === "TKT-8271-MAD") {
      setTrackedTicket({
        reference: "TKT-8271-MAD",
        title: isFR ? "Retard sur Transfert International (France)" : "Delayed International Transfer (France)",
        description: isFR 
          ? "J'ai initié un transfert de 500 EUR, mais le destinataire dit n'avoir aucune notification." 
          : "I initiated an international transfer of 500 EUR, but the recipient states they have not received any notification yet.",
        status: "IN_PROGRESS",
        createdAt: "2026-06-11T12:00:00Z",
        messages: [
          {
            sender: "CLIENT",
            msg: isFR 
              ? "J'ai initié un transfert de 500 EUR, mais le destinataire dit n'avoir aucune notification." 
              : "I completed an international transfer of 500 EUR, but the recipient states they have not received any notice yet. Please check.",
            time: "2026-06-11T12:00:00Z"
          },
          {
            sender: "ADMIN",
            msg: isFR 
              ? "Bonjour Mohamed, la validation de roulement pour Paris prend d'ordinaire 24h ouvrées. Arrivée prévue demain matin." 
              : "Hello Mohamed, your transfer reference is currently under routing validations. It takes up to 24 business hours. We expect delivery by tomorrow morning.",
            time: "2026-06-11T16:00:00Z"
          }
        ]
      });
    } else {
      setTrackedTicket(null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim() || !trackedTicket) return;

    const updatedMsgs = [...trackedTicket.messages, {
      sender: "CLIENT",
      msg: newReplyText,
      time: new Date().toISOString()
    }];

    setTrackedTicket({
      ...trackedTicket,
      messages: updatedMsgs
    });

    setNewReplyText("");

    // Simulate Admin Response
    setTimeout(() => {
      setTrackedTicket(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              sender: "ADMIN",
              msg: isFR 
                ? "Merci pour ces informations complémentaires. Notre service d'assistance prend en charge votre mise à jour." 
                : "Thank you for these further details. Our administrative desk is logging this update directly.",
              time: new Date().toISOString()
            }
          ]
        };
      });
    }, 2000);
  };

  const faqSupport = [
    {
      q: isFR ? "Comment soumettre une réclamation officielle ?" : "How to submit an official dispute complaint?",
      a: isFR 
        ? "Connectez-vous à votre espace client, rendez-vous dans la rubrique 'Support & Réclamations', remplissez le formulaire et déposez vos pièces de rechange. Un ticket de type TKT-****-MAD est immédiatement ouvert."
        : "Once logged inside your client area, check the Support & Complaints panel to submit active complaints and enclose files. A designated administrative desk will track audit logs directly."
    },
    {
      q: isFR ? "Quels sont les délais de résolution d'un litige ?" : "What are the standard dispute response timers?",
      a: isFR 
        ? "Notre support client répond sous 2 heures ouvrées. Les investigations de routage bancaire international prennent au maximum 48h ouvrées sous l'autorité PCI-DSS."
        : "Initial support triage averages under 2 business hours. Complete international routing investigations take up to 48 working hours maximum."
    }
  ];

  return (
    <div className="bg-[#091e21] text-white min-h-screen pt-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-[#0b2a2f] to-[#091e21] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12b886]/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 bg-[#12b886]/10 border border-[#12b886]/25 rounded-full text-xs font-semibold text-[#12b886] uppercase tracking-wider">
                {isFR ? "Service Clients & Assistance 24/7" : "Interactive Support & Disputes Desk"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {isFR ? "Le support à l'écoute de vos" : "We Answer Every Inquiry, "}{" "}
                <span className="text-[#12b886] bg-gradient-to-r from-[#0d7e67] to-[#12b886] bg-clip-text text-transparent">
                  {isFR ? "besoins au quotidien." : "Anytime Round-the-Clock."}
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#e7fdf8]/70 leading-relaxed max-w-2xl">
                {isFR 
                  ? "Un doute concernant la tarification ? Un virement transfrontalier retardé ? Nos gestionnaires de comptes réglementés répondent de manière transparente. Soumettez un ticket de réclamation ou suivez l'avancement d'un ticket en cours en temps réel."
                  : "Assisting you with transfer inquiries or utility payment delays. Submit complaints, attach billing proof files, or check active ticket progress on our real-time support ledger."
                }
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#ticket-tracker"
                  className="px-6 py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-2 transform active:scale-95 shadow-lg transition-all"
                >
                  <span>{isFR ? "Suivre un ticket d'incident" : "Track Support Ticket"}</span>
                  <Search className="w-4 h-4" />
                </a>
                <a
                  href="#contact-form"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  {isFR ? "Formulaire de contact" : "Online Contact Form"}
                </a>
              </div>
            </div>

            {/* Right side interactive ticket tracker illustration */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[360px] bg-gradient-to-b from-[#0b2a2f] to-[#091e21] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <MessageSquare className="w-5 h-5 text-[#12b886]" />
                  <span className="text-[10px] font-mono text-[#12b886] font-bold">{isFR ? "SÉLECTION ASSISTANCE REÇUE" : "SUPPORT ESCALATION PROTOCOL"}</span>
                </div>
                
                <p className="text-xs text-white/50">{isFR ? "Veuillez essayer d'entrer la référence suivante en dessous : 'TKT-8271-MAD'" : "Try typing reference code 'TKT-8271-MAD' below into our interactive tracer!"}</p>
                <div className="p-3.5 bg-black/30 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-white/40">
                    <span>{isFR ? "Réf" : "Ticket Ref"}</span>
                    <span className="font-mono text-[#12b886] font-bold">TKT-8271-MAD</span>
                  </div>
                  <h4 className="font-bold text-white">{isFR ? "Retard sur Transfert International" : "Delayed International Remit"}</h4>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/50 font-semibold">{isFR ? "Priorité" : "Priority"}</span>
                    <span className="text-[10.5px] text-orange-400 font-bold">{isFR ? "Haute" : "High"}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. LIVE TICKET TRACKING SYSTEM */}
      <section id="ticket-tracker" className="py-16 bg-black/20 border-t border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0b2a2f] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              {isFR ? "Recherche & Correspondance de Ticket" : "Complaint Ticket Correspondence Ledger"}
            </h2>

            <form onSubmit={handleTrackTicket} className="flex gap-2 mb-8">
              <input
                type="text"
                required
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder={isFR ? "Saisir la réf du ticket (ex. TKT-8271-MAD)" : "Enter Ticket Code (e.g. TKT-8271-MAD)"}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#12b886] text-white placeholder-white/25 uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#12b886] hover:opacity-95 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all text-center whitespace-nowrap"
              >
                <span>{isFR ? "Rechercher" : "Track Complaint"}</span>
              </button>
            </form>

            {hasSearched && (
              trackedTicket ? (
                <div className="space-y-6 text-left animate-fade-in">
                  
                  {/* Metadata Block */}
                  <div className="p-4 bg-black/30 rounded-xl border border-white/5 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-white/40 text-[9px] uppercase">{isFR ? "Sujet du litige" : "Subject Topic"}</span>
                      <p className="font-bold mt-0.5">{trackedTicket.title}</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-[9px] uppercase">{isFR ? "Statut de traitement" : "Legal Progress"}</span>
                      <p className="font-mono text-xs text-orange-400 font-bold mt-0.5">{trackedTicket.status}</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-[9px] uppercase">{isFR ? "Date d'ouverture" : "Date opened"}</span>
                      <p className="font-semibold text-white/80 mt-0.5">{trackedTicket.createdAt.slice(0, 10)}</p>
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="space-y-3 bg-black/25 p-4 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto">
                    {trackedTicket.messages.map((m, index) => {
                      const isAdmin = m.sender === "ADMIN";
                      return (
                        <div key={index} className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
                          <div className={`p-3 rounded-xl max-w-[85%] text-xs ${isAdmin ? "bg-white/5 border border-white/10 text-white" : "bg-[#0d7e67] text-white"}`}>
                            <p className="font-semibold opacity-60 text-[9px] mb-1">{isAdmin ? "Support Agent" : "Mohamed (You)"}</p>
                            <p className="leading-relaxed">{m.msg}</p>
                          </div>
                          <span className="text-[8px] text-white/30 mt-1">{m.time.slice(11, 16)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Send Reply box */}
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newReplyText}
                      onChange={(e) => setNewReplyText(e.target.value)}
                      placeholder={isFR ? "Écrire une réponse à l'assistance..." : "Type reply details to administrative desk..."}
                      className="flex-1 bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#12b886] text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#12b886] hover:opacity-95 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isFR ? "Envoyer" : "Send"}</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </form>

                </div>
              ) : (
                <div className="text-center py-6 text-xs text-white/50">
                  {isFR 
                    ? "Aucun ticket de réclamation retrouvé sous cette référence. Veuillez vérifier et réessayer. Conseil : Essayez 'TKT-8271-MAD'."
                    : "Ticket not found. Ensure the spelling is correct and retry. Pro-tip: Try tracking 'TKT-8271-MAD'."
                  }
                </div>
              )
            )}

          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM SECTION */}
      <section id="contact-form" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 text-left space-y-4">
            <h2 className="text-2xl font-bold">{isFR ? "Soumettre un Contact" : "Submit Direct Contact Inquiry"}</h2>
            <p className="text-xs text-[#e7fdf8]/70 leading-relaxed">
              {isFR 
                ? "Vous n'avez pas encore de compte client ? Remplissez notre formulaire officiel de prise de contact ci-contre. Nos agents s'engagent à vous recontacter sous un délai de 2 heures."
                : "Need general assistance before signing up? Fully transmit the adjacent contact sheet. A sector helper will update your email inbox within 2 business hours."
              }
            </p>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg text-[#12b886] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">{isFR ? "Support par e-mail" : "Email Support"}</p>
                  <p className="text-[#e7fdf8]/50">support@trustsend.co</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#0b2a2f] p-6 rounded-2xl border border-white/10">
            {contactDone ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="h-10 w-10 bg-emerald-500/20 text-[#12b886]/90 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{isFR ? "Message Envoyé avec Succès !" : "Message Transmitted successfully!"}</h4>
                  <p className="text-[11px] text-[#e7fdf8]/60 mt-1">
                    {isFR 
                      ? "Merci pour votre intérêt. Un conseiller fiscal TrustSend va analyser votre demande."
                      : "Thank you. A TrustSend manager will consult your details and reply shortly."
                    }
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs text-left">
                <div>
                  <label className="block text-white/60 mb-1">{isFR ? "Nom complet" : "Your Name"}</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Reda Taghi"
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-[#12b886]"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">{isFR ? "Adresse e-mail de correspondance" : "Your Email"}</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="taghi@domain.ma"
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-[#12b886]"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">{isFR ? "Sujet ou motif du contact" : "Inquiry Subject"}</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Premium Corporate Account Inquiry"
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-[#12b886]"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">{isFR ? "Message / détails de la demande" : "Detailed Inquiry"}</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Provide complete inquiries details here..."
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-[#12b886]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#12b886] hover:bg-[#12b886]/90 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-colors"
                >
                  <span>{isFR ? "Transmettre le message" : "Send Inquiry"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 4. FAQ LIST AND ACCORDIONS */}
      <section className="py-16 bg-[#091e21] border-t border-white/5 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">{isFR ? "Questions & Réponses sur l'Assistance" : "Help Desk & Disputes FAQ"}</h2>
        
        <div className="space-y-4">
          {faqSupport.map((fq, idx) => (
            <div key={idx} className="bg-[#0b2a2f] border border-white/10 rounded-xl p-4 text-left">
              <h4 className="text-xs font-bold text-white mb-2">{fq.q}</h4>
              <p className="text-xs text-[#e7fdf8]/60 leading-relaxed">{fq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
