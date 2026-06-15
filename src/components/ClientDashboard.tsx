import React, { useState, useEffect } from "react";
import { translations } from "../utils/translations";
import { Language, Currency, User, Transaction, Transfer, BillPayment, CardRequest, Complaint } from "../types";
import { 
  DollarSign, ArrowRightLeft, CreditCard, Receipt, 
  PlusCircle, RefreshCw, Layers, ShieldCheck, 
  FileText, Ticket, Send, Search, Filter, 
  HelpCircle, MoreHorizontal, Bell, Eye, EyeOff, CheckCircle2,
  Trash2, X, Download, FileUp
} from "lucide-react";

interface ClientDashboardProps {
  lang: Language;
  currency: Currency;
  userPhone: string;
  onLogout: () => void;
}

export default function ClientDashboard({ lang, currency, userPhone, onLogout }: ClientDashboardProps) {
  const t = translations[lang];

  // Global Sync States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cards, setCards] = useState<CardRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  // UI Tab & state triggers
  const [activeTab, setActiveTab] = useState<"HOME" | "TRANSFERS" | "BILLS" | "CARDS" | "HISTORY" | "COMPLAINTS" | "VERIFICATION">("HOME");
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  // Search & Filter state on transaction overview
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Transfer Forms State
  const [transferType, setTransferType] = useState<"NATIONAL" | "INTERNATIONAL">("NATIONAL");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferReason, setTransferReason] = useState("Family support");
  const [intlCountry, setIntlCountry] = useState("");
  const [intlCurrency, setIntlCurrency] = useState<"MAD" | "USD" | "EUR">("USD");

  // Bill payment form
  const [serviceType, setServiceType] = useState<"WATER" | "ELECTRICITY" | "INTERNET" | "RECHARGE" | "TAX" | "FINE" | "TICKET">("WATER");
  const [billerName, setBillerName] = useState("REDAL Rabat");
  const [billAccount, setBillAccount] = useState("");
  const [billAmount, setBillAmount] = useState("");
  // Simulation for payment cards
  const [simCardNum, setSimCardNum] = useState("");
  const [simCardCVV, setSimCardCVV] = useState("");

  // Card order states
  const [orderCardType, setOrderCardType] = useState<"VISA_CLASSIC" | "MASTERCARD_PREMIUM">("VISA_CLASSIC");

  // Identity document uploading states
  const [dragActive, setDragActive] = useState(false);
  const [frontUploadedFile, setFrontUploadedFile] = useState<string | null>(null);
  const [backUploadedFile, setBackUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Complaints form states
  const [compTitle, setCompTitle] = useState("");
  const [compDesc, setCompDesc] = useState("");
  const [compDoc, setCompDoc] = useState("");
  const [activeTicket, setActiveTicket] = useState<Complaint | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Fresh Data Sync Fetcher
  const syncDashboardData = async () => {
    try {
      const res = await fetch(`/api/user/me?phone=${encodeURIComponent(userPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setWalletBalance(data.wallet.balance);
        setCards(data.cards);
        setNotifications(data.notifications);

        // Fetch User specific tx
        if (data.user?.id) {
          const txRes = await fetch(`/api/transactions?userId=${data.user.id}`);
          if (txRes.ok) {
            const txData = await txRes.json();
            setTransactions(txData);
          }

          // Fetch Complaints
          const compRes = await fetch(`/api/admin/complaints`); // Mock route returns all, filter for client
          if (compRes.ok) {
            const compData = await compRes.json();
            const clientTickets = compData.filter((c: any) => c.userId === data.user.id);
            setComplaints(clientTickets);
            if (activeTicket) {
              const freshTicket = clientTickets.find((t: any) => t.id === activeTicket.id);
              if (freshTicket) setActiveTicket(freshTicket);
            }
          }
        }
      }
    } catch (err) {
      console.error("Dashboard synchronization error", err);
    }
  };

  useEffect(() => {
    syncDashboardData();
    // Continuous polling for live admin feedback updates
    const interval = setInterval(syncDashboardData, 4000);
    return () => clearInterval(interval);
  }, [userPhone]);

  // Handle Toast helper
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  // Convert funds mathematically based on selected Currency
  const formatAmount = (balanceInMAD: number) => {
    if (currency === "USD") {
      return `$ ${(balanceInMAD * 0.1).toFixed(2)}`;
    } else if (currency === "EUR") {
      return `€ ${(balanceInMAD * 0.091).toFixed(2)}`;
    }
    return `${balanceInMAD.toLocaleString()} MAD`;
  };

  // --- TRANSFERS SUBMISSION ---
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.status !== "VERIFIED") {
      setErrorBanner("Your account is unverified. Identity status validation is required before executing remittances.");
      return;
    }
    if (!beneficiaryName || !beneficiaryPhone || !transferAmount) return;

    setErrorBanner("");
    setLoading(true);

    try {
      const payload = {
        senderId: currentUser.id,
        beneficiaryName,
        beneficiaryPhone,
        beneficiaryId: beneficiaryId || "N/A",
        amount: parseFloat(transferAmount),
        reason: transferReason,
        country: intlCountry,
        currency: intlCurrency
      };

      const url = transferType === "NATIONAL" ? "/api/transfers/national" : "/api/transfers/international";
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        triggerToast(`Transfer to ${beneficiaryName} completed successfully!`);
        // Clean fields
        setBeneficiaryName("");
        setBeneficiaryPhone("");
        setBeneficiaryId("");
        setTransferAmount("");
        setIntlCountry("");
        syncDashboardData();
        setActiveTab("HOME");
      } else {
        setErrorBanner(data.error || t.errorMsg);
      }
    } catch {
      setErrorBanner(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- BILL PAYMENTS ---
  const handleBillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!billAccount || !billAmount) return;

    setErrorBanner("");
    setLoading(true);

    try {
      const res = await fetch("/api/bills/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          serviceType,
          billerName,
          accountNumber: billAccount,
          amount: parseFloat(billAmount),
        })
      });

      const data = await res.json();
      if (res.ok) {
        triggerToast(`Paid standard bill for ${billerName} with reference code ${data.bill.reference}!`);
        setBillAccount("");
        setBillAmount("");
        setSimCardNum("");
        setSimCardCVV("");
        syncDashboardData();
        
        // Dynamic auto-download of TXT Receipt on success block!
        window.open(`/api/receipt/${data.bill.reference}`, "_blank");
        
        setActiveTab("HOME");
      } else {
        setErrorBanner(data.error || t.errorMsg);
      }
    } catch {
      setErrorBanner(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- CARD ORDER REQUEST ---
  const handleCardOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (walletBalance < 50.00) {
      setErrorBanner(t.cardMinRequirement);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cards/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, cardType: orderCardType })
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast("Physical Card order registered. Standard dispatch underway");
        syncDashboardData();
      } else {
        setErrorBanner(data.error);
      }
    } catch {
      setErrorBanner(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (cardId: string, action: string) => {
    try {
      const res = await fetch("/api/cards/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, action })
      });
      if (res.ok) {
        triggerToast(`Card safety state updated successfully.`);
        syncDashboardData();
      }
    } catch {
      triggerToast(t.errorMsg);
    }
  };

  // --- COMPLAINT SUBMISSION ---
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !compTitle || !compDesc) return;

    setLoading(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          title: compTitle,
          description: compDesc,
          documentName: compDoc || "Proof-Capture.png"
        })
      });
      if (res.ok) {
        triggerToast("Dispute ticket raised. AI automated assistant initialized.");
        setCompTitle("");
        setCompDesc("");
        setCompDoc("");
        syncDashboardData();
      }
    } catch {
      setErrorBanner(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const sendComplaintMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !newMessage) return;

    try {
      const res = await fetch("/api/complaints/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          sender: "CLIENT",
          message: newMessage
        })
      });
      if (res.ok) {
        setNewMessage("");
        syncDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- FILE DRAG & DROP UPLOAD SIMULATOR ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, side: "FRONT" | "BACK") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(e.dataTransfer.files[0]);
        if (side === "FRONT") setFrontUploadedFile(fileUrl);
        else setBackUploadedFile(fileUrl);
        setIsUploading(false);
        triggerToast("Identity document page successfully parsed local storage.");
      }, 800);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>, side: "FRONT" | "BACK") => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(e.target.files[0]);
        if (side === "FRONT") setFrontUploadedFile(fileUrl);
        else setBackUploadedFile(fileUrl);
        setIsUploading(false);
        triggerToast("Identity document loaded.");
      }, 700);
    }
  };

  const handleRequestAuditApproval = async () => {
    if (!currentUser) return;
    setErrorBanner("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: currentUser.fullName,
          nationalId: currentUser.nationalId,
          birthDate: currentUser.birthDate,
          address: currentUser.address,
          city: currentUser.city,
          phone: currentUser.phoneNumber,
          email: currentUser.email,
          idFrontUrl: frontUploadedFile || undefined,
          idBackUrl: backUploadedFile || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast("Account re-submitted for full administrative verification.");
        syncDashboardData();
      } else {
        setErrorBanner(data.error);
      }
    } catch {
      setErrorBanner(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };


  // Filtering transactions logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "ALL" || tx.type === filterType;
    const matchesStatus = filterStatus === "ALL" || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="bg-[#091e21] text-white min-h-screen font-sans">
      
      {/* Toast Notice */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#12b886] border border-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Core Full-Width Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Upper Client Brief */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl">
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {t.logo} Dashboard Client Area
            </h1>
            <p className="text-xs text-[#e7fdf8]/75 mt-0.5">
              Ref ID Profile: <strong className="font-mono text-[#12b886]">{currentUser?.id || "N/A"}</strong> — Registered phone: {userPhone}
            </p>
          </div>

          {/* Verification indicator */}
          <div className="flex items-center gap-3">
            {currentUser?.status === "VERIFIED" ? (
              <span className="px-3 py-1 bg-emerald-950/40 border border-[#12b886]/40 text-[#12b886] rounded-full text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.verificationVerified}
              </span>
            ) : currentUser?.status === "PENDING" ? (
              <span className="px-3 py-1 bg-yellow-950/20 border border-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                Status: Administrative Verification Pending
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-950/20 border border-red-500/20 text-red-300 rounded-full text-xs font-semibold">
                Status: LOCKED / SUSPENDED
              </span>
            )}

            <button
              onClick={onLogout}
              className="text-xs text-[#e7fdf8]/50 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {t.ctaLogout}
            </button>
          </div>
        </div>

        {errorBanner && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500/30 rounded-xl text-xs text-red-200 text-left">
            <strong>System Notification Block:</strong> {errorBanner}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Dashboard Left Navigation Rail */}
          <div className="lg:col-span-1 space-y-2 text-left">
            
            <button
              onClick={() => { setActiveTab("HOME"); setErrorBanner(""); }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${activeTab === 'HOME' ? 'bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.navHome}</span>
            </button>

            <button
              onClick={() => { setActiveTab("TRANSFERS"); setErrorBanner(""); }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${activeTab === 'TRANSFERS' ? 'bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{t.navTransfers}</span>
            </button>

            <button
              onClick={() => { setActiveTab("BILLS"); setErrorBanner(""); }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${activeTab === 'BILLS' ? 'bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <Receipt className="w-4 h-4" />
              <span>{t.navBills}</span>
            </button>

            <button
              onClick={() => { setActiveTab("CARDS"); setErrorBanner(""); }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${activeTab === 'CARDS' ? 'bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t.navCards}</span>
            </button>

            <button
              onClick={() => { setActiveTab("HISTORY"); setErrorBanner(""); }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${activeTab === 'HISTORY' ? 'bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.navTransactions}</span>
            </button>

            <button
              onClick={() => { setActiveTab("COMPLAINTS"); setErrorBanner(""); }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${activeTab === 'COMPLAINTS' ? 'bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <Ticket className="w-4 h-4" />
              <span>{t.navComplaints}</span>
              {complaints.filter(c => c.status === 'IN_PROGRESS').length > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#12b886] animate-ping" />
              )}
            </button>

            {currentUser?.status !== 'VERIFIED' && (
              <button
                onClick={() => { setActiveTab("VERIFICATION"); setErrorBanner(""); }}
                className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold border border-dashed border-[#12b886]/40 text-[#12b886] hover:bg-[#12b886]/10 transition-all`}
              >
                <ShieldCheck className="w-4 h-4 animate-bounce" />
                <span>Submit ID Docs</span>
              </button>
            )}

          </div>

          {/* Right Core Details Switcher */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* TAB 1: HOME PANEL */}
            {activeTab === "HOME" && (
              <div className="space-y-6 text-left">
                
                {/* Available Balance KPI */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  <div className="md:col-span-7 bg-gradient-to-r from-[#0b2a2f] to-[#091e21] border border-white/15 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-12 w-24 bg-gradient-to-bl from-[#12b886]/20 to-transparent" />
                    
                    <p className="text-xs uppercase tracking-widest text-[#e7fdf8]/60 font-mono font-medium">{t.walletBalance}</p>
                    <p className="text-4xl font-extrabold text-white mt-1">{formatAmount(walletBalance)}</p>

                    <div className="flex gap-4 items-center mt-6 text-[10.5px] text-[#e7fdf8]/60">
                      <div>
                        <span>Currency Context: </span>
                        <strong className="text-[#12b886]">{currency}</strong>
                      </div>
                      <div className="h-3.5 w-[1px] bg-white/10" />
                      <div>
                        <span>Converted from base rate in </span>
                        <strong className="text-white">MAD</strong>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-[#0b2a2f] border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs uppercase font-mono tracking-wider text-[#e7fdf8]/60 font-semibold mb-3">{t.quickActions}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveTab("TRANSFERS")}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-center transition-all cursor-pointer"
                        >
                          Send Money
                        </button>
                        <button
                          onClick={() => setActiveTab("BILLS")}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-center transition-all cursor-pointer"
                        >
                          Utility Bills
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#e7fdf8]/40 mt-3 leading-tight">
                      All outbound transfer bounds PCI DSS Level 1 encrypted with mandatory live Ledger logging.
                    </p>
                  </div>

                </div>

                {/* Simulated Expenditures Charts Vector graphic inside box */}
                <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white">Expenditures Remittance Analytics</h3>
                      <p className="text-[11px] text-[#e7fdf8]/50">Computed monthly expenditures in MAD weekly</p>
                    </div>
                    <span className="text-xs font-bold text-[#12b886]">+8.29% Trends</span>
                  </div>

                  {/* Clean Animated Vector SVG Layout replacing heavy Recharts library to prevent React 19 incompatibilities */}
                  <div className="w-full h-44 relative flex items-end">
                    
                    {/* Y-axis labels */}
                    <div className="absolute left-0 bottom-0 top-0 w-8 flex flex-col justify-between text-[9px] font-mono text-white/30 text-left border-r border-white/5 pr-1.5 pt-1 select-none">
                      <span>10k</span>
                      <span>5k</span>
                      <span>2k</span>
                      <span>0</span>
                    </div>

                    {/* SVG Line path & fill with simple dots points representing weeks */}
                    <svg className="w-full h-full pl-10" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#12b886" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0d7e67" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path d="M 0,150 L 0,120 Q 100,60 180,95 T 320,30 T 500,70 L 500,150 Z" fill="url(#chartGrad)" />

                      {/* Line Curve */}
                      <path d="M 0,120 Q 100,60 180,95 T 320,30 T 500,70" fill="none" stroke="#12b886" strokeWidth="3" />

                      {/* Animated hover point pulses */}
                      <circle cx="180" cy="95" r="4" fill="#091e21" stroke="#12b886" strokeWidth="2" />
                      <circle cx="320" cy="30" r="4" fill="#091e21" stroke="#12b886" strokeWidth="2" />
                    </svg>

                    {/* X Axis weeks bar */}
                    <div className="absolute left-10 right-0 bottom-[-20px] flex justify-between text-[9px] font-mono text-white/40">
                      <span>Week 1 (MAD 1,200)</span>
                      <span>Week 2 (MAD 2,400)</span>
                      <span>Week 3 (MAD 1,800)</span>
                      <span>Week 4 (MAD 3,900)</span>
                    </div>

                  </div>
                </div>

                {/* Notifications Stack */}
                <div className="bg-[#0b2a2f] border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#e7fdf8]/60 mb-3 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#12b886]" />
                    <span>Real-time Alerts & Push Communications</span>
                  </h3>
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#e7fdf8]/40 italic">No alerts logged at present.</p>
                    ) : (
                      notifications.map((n, idx) => (
                        <div key={idx} className="p-3 bg-black/15 border-l-2 border-[#12b886] text-xs">
                          <p className="font-bold text-white">{n.title}</p>
                          <p className="text-[11px] text-[#e7fdf8]/70 mt-0.5">{n.message}</p>
                          <span className="text-[8.5px] text-[#e7fdf8]/30 font-mono italic block mt-1">{n.createdAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REMITTANCE FLOW MODULE */}
            {activeTab === "TRANSFERS" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold">Initiate Secure Money Transfer</h2>
                    <p className="text-xs text-[#e7fdf8]/50 mt-0.5">National/International transfers routed instantaneously.</p>
                  </div>
                  
                  {/* Selector pill toggle */}
                  <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      onClick={() => setTransferType("NATIONAL")}
                      className={`px-3 py-1 rounded-lg transition-all ${transferType === 'NATIONAL' ? 'bg-[#0d7e67] text-white font-semibold' : 'text-[#e7fdf8]/50'}`}
                    >
                      {t.serviceNational}
                    </button>
                    <button
                      onClick={() => setTransferType("INTERNATIONAL")}
                      className={`px-3 py-1 rounded-lg transition-all ${transferType === 'INTERNATIONAL' ? 'bg-[#0d7e67] text-white font-semibold' : 'text-[#e7fdf8]/50'}`}
                    >
                      {t.serviceInternational}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  
                  {transferType === "INTERNATIONAL" && (
                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.countryLabel} *
                      </label>
                      <select
                        required
                        value={intlCountry}
                        onChange={(e) => setIntlCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#0d7e67]"
                      >
                        <option value="">{t.selectCountry}</option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="UAE">United Arab Emirates</option>
                        <option value="USA">United States</option>
                        <option value="Senegal">Senegal</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.beneficiaryName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        placeholder="e.g., Reda Tazi"
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.beneficiaryPhone} *
                      </label>
                      <input
                        type="text"
                        required
                        value={beneficiaryPhone}
                        onChange={(e) => setBeneficiaryPhone(e.target.value)}
                        placeholder="e.g., +212 677889900"
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.beneficiaryIdCard} (CIN)
                      </label>
                      <input
                        type="text"
                        value={beneficiaryId}
                        onChange={(e) => setBeneficiaryId(e.target.value)}
                        placeholder="e.g., G771822"
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-8">
                        <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                          {t.transferAmount} *
                        </label>
                        <input
                          type="number"
                          required
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          placeholder="e.g., 1000"
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                          Unit
                        </label>
                        {transferType === "NATIONAL" ? (
                          <div className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-lg text-white/50 text-xs font-bold text-center">
                            MAD
                          </div>
                        ) : (
                          <select
                            value={intlCurrency}
                            onChange={(e: any) => setIntlCurrency(e.target.value)}
                            className="w-full px-1 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                          >
                            <option value="MAD">MAD</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                      {t.transferReason}
                    </label>
                    <select
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    >
                      <option value="Family support">{t.reasonFamily}</option>
                      <option value="Purchase / Business">{t.reasonPurchase}</option>
                      <option value="Personal savings">{t.reasonSavings}</option>
                    </select>
                  </div>

                  <div className="p-3 bg-black/15 border border-white/10 rounded-xl text-[10.5px] text-[#e7fdf8]/60 space-y-1">
                    <p className="font-bold text-white">Interactive routing rules:</p>
                    {transferType === "NATIONAL" ? (
                      <>
                        <p>• {t.caseDirect}</p>
                        <p>• {t.caseWithdrawalCode}</p>
                      </>
                    ) : (
                      <>
                        <p>• Interbank conversions are executed instantly with mid-market indexes.</p>
                        <p>• Standard premium 1.5% transmission charge will be added to checkout totals.</p>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg transition-all cursor-pointer"
                  >
                    <span>{t.initiateButton}</span>
                  </button>

                </form>

              </div>
            )}

            {/* TAB 3: BILL SETTLEMENTS */}
            {activeTab === "BILLS" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <div className="mb-6">
                  <h2 className="text-lg font-bold">{t.payBillsTitle}</h2>
                  <p className="text-xs text-[#e7fdf8]/50 mt-0.5">Pay standard water, electric, vignette taxes, and transport tickets online.</p>
                </div>

                <form onSubmit={handleBillSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.billServiceType}
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e: any) => {
                          const val = e.target.value;
                          setServiceType(val);
                          if (val === "WATER") setBillerName("REDAL Rabat");
                          else if (val === "ELECTRICITY") setBillerName("Lydec Casablanca");
                          else if (val === "INTERNET") setBillerName("Maroc Telecom Fibre");
                          else if (val === "TAX") setBillerName("Direction Generale des Impots");
                          else if (val === "FINE") setBillerName("AMENDE INFRACTIONS");
                          else setBillerName("ONCF Office des Chemins de Fer");
                        }}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      >
                        <option value="WATER">Water Bill (EAU)</option>
                        <option value="ELECTRICITY">Electricity Bill (ÉLECTRICITÉ)</option>
                        <option value="INTERNET">Internet Subscription</option>
                        <option value="RECHARGE">Phone Recharge</option>
                        <option value="TAX">Vehicle Tax (Vignette)</option>
                        <option value="FINE">Traffic Fines / Violations</option>
                        <option value="TICKET">Train / Bus tickets</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.billBiller} *
                      </label>
                      <input
                        type="text"
                        required
                        value={billerName}
                        onChange={(e) => setBillerName(e.target.value)}
                        className="w-full px-3 py-2 bg-black/15 border border-white/5 rounded-lg text-white/50 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.billAccount} *
                      </label>
                      <input
                        type="text"
                        required
                        value={billAccount}
                        onChange={(e) => setBillAccount(e.target.value)}
                        placeholder="e.g., 992388122-A"
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1">
                        {t.billAmount} (MAD) *
                      </label>
                      <input
                        type="number"
                        required
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder="e.g., 450"
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Simulator for PFE Bank checkouts */}
                  <div className="border border-white/5 rounded-2xl p-4 bg-black/20 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#12b886]" />
                      <span>Simulate Standard Card Payment (PFE Sandbox Validation)</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={simCardNum}
                          onChange={(e) => setSimCardNum(e.target.value)}
                          placeholder="Credit Card: 4111 2222 3333 4444"
                          className="w-full px-3 py-1.5 bg-[#0b2a2f] border border-white/10 rounded-lg text-[11px] text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          value={simCardCVV}
                          onChange={(e) => setSimCardCVV(e.target.value)}
                          placeholder="CVV: e.g. 123"
                          className="w-full px-3 py-1.5 bg-[#0b2a2f] border border-white/10 rounded-lg text-[11px] text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>{t.submitBillPayment}</span>
                  </button>

                </form>

              </div>
            )}

            {/* TAB 4: CARDS MANAGER */}
            {activeTab === "CARDS" && (
              <div className="space-y-6 text-left">
                
                <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold">{t.cardManagementTitle}</h2>
                      <p className="text-xs text-[#e7fdf8]/50 mt-0.5">Physical card issuance requests and life cycle status parameters.</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        const form = document.getElementById("card-order-form");
                        if (form) form.classList.toggle("hidden");
                      }}
                      className="text-xs font-semibold bg-[#0d7e67] hover:bg-[#12b886] text-white px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{t.requestCardBtn}</span>
                    </button>
                  </div>

                  {/* Order form hidden toggle */}
                  <div id="card-order-form" className="hidden mb-6 p-4 bg-black/15 border border-[#12b886]/20 rounded-xl">
                    <form onSubmit={handleCardOrderSubmit} className="space-y-4">
                      
                      <div>
                        <label className="block text-xs font-medium text-[#e7fdf8]/85 mb-1.5">
                          {t.chooseCardType}
                        </label>
                        <select
                          value={orderCardType}
                          onChange={(e: any) => setOrderCardType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0b2a2f] border border-white/10 rounded-lg text-white text-xs"
                        >
                          <option value="VISA_CLASSIC">{t.cardClassic} — Fee: Free</option>
                          <option value="MASTERCARD_PREMIUM">{t.cardPremium} — Fee: Free</option>
                        </select>
                      </div>

                      <div className="text-[10px] text-[#e7fdf8]/50 leading-normal">
                        ★ Conditions: Possess an active validated account. Maintain at least 50.00 MAD available wallet to check out activation bounds. Card will be printed physically and delivered safely.
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white text-xs font-bold rounded-lg hover:opacity-90"
                      >
                        {loading ? "Ordering..." : "Confirm Physical Card Order"}
                      </button>
                    </form>
                  </div>

                  {/* Active cards display */}
                  <div className="space-y-4">
                    {cards.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-[#e7fdf8]/40 text-xs">
                        No active debits registered. Demand a new physical neobank card above to initiate.
                      </div>
                    ) : (
                      cards.map((c) => (
                        <div key={c.id} className="p-5 bg-gradient-to-br from-[#0b2a2f] via-[#091e21] to-[#091e21] border border-white/10 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                          
                          {/* Financial card representation */}
                          <div className="bg-gradient-to-r from-[#0d7e67] to-[#12b886] rounded-xl p-4 text-left shadow-lg space-y-4 aspect-[1.58/1] max-w-[240px]">
                            <p className="text-[8px] font-mono opacity-80 uppercase tracking-widest">{c.cardType.replace("_", " ")}</p>
                            <p className="text-sm font-mono tracking-widest text-white font-bold">{c.cardNumber || "•••• •••• •••• ••••"}</p>
                            <div className="flex justify-between items-baseline pt-1 text-[9px]">
                              <span>Status: <strong>{c.status}</strong></span>
                              <span className="font-extrabold italic">TrustSend</span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="space-y-2 text-left md:col-span-2">
                            <h4 className="text-sm font-bold text-white">Physical Card Manager</h4>
                            <p className="text-xs text-[#e7fdf8]/60">Status Tracking: <strong className="text-[#12b886]">{c.status}</strong></p>
                            
                            {/* Tracking lifecycle meters represent */}
                            <div className="grid grid-cols-4 gap-1 pt-1.5 pb-3">
                              <span className={`h-1.5 rounded-full ${['REQUESTED', 'PRINTING', 'SHIPPED', 'DELIVERED', 'ACTIVE'].includes(c.status) ? 'bg-[#12b886]' : 'bg-white/10'}`} />
                              <span className={`h-1.5 rounded-full ${['PRINTING', 'SHIPPED', 'DELIVERED', 'ACTIVE'].includes(c.status) ? 'bg-[#12b886]' : 'bg-white/10'}`} />
                              <span className={`h-1.5 rounded-full ${['SHIPPED', 'DELIVERED', 'ACTIVE'].includes(c.status) ? 'bg-[#12b886]' : 'bg-white/10'}`} />
                              <span className={`h-1.5 rounded-full ${['DELIVERED', 'ACTIVE'].includes(c.status) ? 'bg-[#12b886]' : 'bg-white/10'}`} />
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleCardAction(c.id, "TOGGLE_STATUS")}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white rounded-lg transition-colors cursor-pointer"
                              >
                                {c.status === "ACTIVE" ? t.cardInactive.split("/")[0] : "Activate Card"}
                              </button>
                              <button
                                onClick={() => handleCardAction(c.id, "REPORT_LOST")}
                                className="px-3 py-1.5 bg-red-950/20 text-[#ff6868] border border-red-500/10 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                {t.cardReportLost}
                              </button>
                              <button
                                onClick={() => handleCardAction(c.id, "REPLACE")}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-white/70 rounded-lg transition-colors cursor-pointer"
                              >
                                Request Replacement
                              </button>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* TAB 5: TRANSACTIONS ARCHIVES */}
            {activeTab === "HISTORY" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold">Ledger Transactions Archives</h2>
                    <p className="text-xs text-[#e7fdf8]/50 mt-0.5">Filter, search, or download compliant PDF text receipts instantly.</p>
                  </div>
                </div>

                {/* Filter and search controls row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
                  
                  <div className="md:col-span-6 relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search description reference codes... (e.g. TX-992182)"
                      className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#091e21] border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="TRANSFER">Remittance Out</option>
                      <option value="DEPOSIT">Deposits</option>
                      <option value="BILL_PAY">Bills Paid</option>
                      <option value="RECEIVED">Inbound Funds</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-[#091e21] border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="ALL">All Status</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="PENDING">InProgress</option>
                      <option value="FAILED">Declined</option>
                    </select>
                  </div>

                </div>

                {/* Ledger Archives Table */}
                <div className="overflow-x-auto border border-white/5 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-black/25 text-[#e7fdf8]/50">
                      <tr>
                        <th className="p-3.5">Reference</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Allocation Description</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Amount</th>
                        <th className="p-3.5 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/5">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#e7fdf8]/40 italic">
                            {t.noTransactions}
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-white">{tx.reference}</td>
                            <td className="p-3.5 text-[#e7fdf8]/60 text-[11px] whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3.5 text-white/95 max-w-[200px] truncate">{tx.description}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${tx.status === 'COMPLETED' ? 'bg-emerald-950/30 text-[#12b886]' : 'bg-yellow-950/20 text-yellow-300'}`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className={`p-3.5 text-right font-semibold font-mono whitespace-nowrap ${['DEPOSIT', 'RECEIVED'].includes(tx.type) ? 'text-[#12b886]' : 'text-white'}`}>
                              {['DEPOSIT', 'RECEIVED'].includes(tx.type) ? "+" : "-"} {formatAmount(tx.amount)}
                            </td>
                            <td className="p-3.5 text-center">
                              <a
                                href={`/api/receipt/${tx.reference}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 px-2.5 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-95 text-white text-[10.5px] font-bold rounded flex items-center justify-center gap-1 mx-auto"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 6: SUPPORT & COMPLAINTS MESSAGES AREA */}
            {activeTab === "COMPLAINTS" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                
                {/* Tickets list */}
                <div className="md:col-span-5 bg-[#0b2a2f] border border-white/10 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">{t.complaintHistory}</h3>
                    <p className="text-[11px] text-[#e7fdf8]/50 mb-4">Dedicated direct messaging with compliance admin.</p>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {complaints.length === 0 ? (
                        <p className="text-xs text-[#e7fdf8]/40 italic py-4 text-center">No active claims raised.</p>
                      ) : (
                        complaints.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setActiveTicket(c)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${activeTicket?.id === c.id ? 'bg-[#0d7e67]/20 border-[#12b886]' : 'bg-black/15 border-white/5 hover:border-white/10'}`}
                          >
                            <div className="flex justify-between items-center font-bold text-white mb-1">
                              <span>{c.reference}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] tracking-wide uppercase ${c.status === 'OPEN' ? 'bg-green-950/30 text-green-300' : 'bg-yellow-950/20 text-yellow-300'}`}>
                                {c.status}
                              </span>
                            </div>
                            <p className="text-[#e7fdf8]/80 line-clamp-1">{c.title}</p>
                            <span className="text-[9px] text-white/30 block mt-1">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                      )))}
                    </div>
                  </div>

                  {/* Add complaints form */}
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-[#12b886] mb-3">{t.newComplaintBtn}</h4>
                    <form onSubmit={handleComplaintSubmit} className="space-y-3">
                      <input
                        type="text"
                        required
                        value={compTitle}
                        onChange={(e) => setCompTitle(e.target.value)}
                        placeholder="Subject Topic (Delayed Remit?)"
                        className="w-full px-2.5 py-1.5 bg-black/30 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                      />
                      <textarea
                        required
                        rows={2}
                        value={compDesc}
                        onChange={(e) => setCompDesc(e.target.value)}
                        placeholder="Explain incident with reference numbers..."
                        className="w-full px-2.5 py-1.5 bg-black/30 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={compDoc}
                        onChange={(e) => setCompDoc(e.target.value)}
                        placeholder="Optional filename attachment... (Recto.png)"
                        className="w-full px-2.5 py-1.5 bg-black/30 border border-white/5 rounded-lg text-[10.5px] text-white/70 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Submit Ticket
                      </button>
                    </form>
                  </div>

                </div>

                {/* Messaging Box */}
                <div className="md:col-span-7 bg-[#0b2a2f] border border-white/10 rounded-2xl flex flex-col justify-between h-[450px]">
                  {activeTicket ? (
                    <>
                      {/* Chat header */}
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/10 rounded-t-2xl">
                        <div>
                          <span className="text-xs font-mono text-[#12b886] font-bold">{activeTicket.reference}</span>
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px] mt-0.5">{activeTicket.title}</h4>
                        </div>
                        <span className="text-[10px] text-white/50">Status: {activeTicket.status}</span>
                      </div>

                      {/* Chat messages body */}
                      <div className="p-4 flex-1 overflow-y-auto space-y-3">
                        {activeTicket.messages.map((m, idx) => {
                          const isAdmin = m.sender === "ADMIN";
                          return (
                            <div key={idx} className={`flex flex-col ${isAdmin ? "items-start text-left" : "items-end text-right"}`}>
                              <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${isAdmin ? "bg-black/30 text-[#e7fdf8]/95 rounded-tl-none border border-white/5" : "bg-[#0d7e67]/30 text-white rounded-tr-none border border-[#12b886]/20"}`}>
                                {m.message}
                              </div>
                              <span className="text-[8px] text-white/30 font-mono mt-1 px-1">{m.sender} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Msg Form */}
                      <form onSubmit={sendComplaintMessage} className="p-3 border-t border-white/5 bg-black/15 rounded-b-2xl flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Reply to the customer support panel..."
                          className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 bg-[#12b886] text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#e7fdf8]/30">
                      <HelpCircle className="w-8 h-8 opacity-20 mb-2" />
                      <p className="text-xs">Select any historic ticket complaint from left rail to engage dialogue.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 7: IDENTITY DOCUMENTS MANAGE */}
            {activeTab === "VERIFICATION" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left space-y-5">
                
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-lg font-bold">{t.accountVerificationRequired}</h2>
                  <p className="text-xs text-[#e7fdf8]/50 mt-0.5">{t.verificationSub}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                  
                  {/* Recto Drop section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#e7fdf8]/90 block">{t.idFrontFile} *</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, "FRONT")}
                      className={`border-2 border-dashed rounded-xl p-6 text-center relative transition-colors ${dragActive ? "border-[#12b886] bg-[#12b886]/5" : "border-white/10 hover:border-white/15 bg-black/10"}`}
                    >
                      {frontUploadedFile ? (
                        <div className="space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-[#12b886] mx-auto" />
                          <p className="text-xs font-semibold text-white">ID Cover Loaded</p>
                          <button onClick={() => setFrontUploadedFile(null)} className="text-[10px] text-red-400 hover:underline">Remove</button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <FileUp className="w-7 h-7 text-[#12b886] mx-auto opacity-70 mb-1" />
                          <p className="text-[11px] text-[#e7fdf8]/80">Drag ID cover photo (Front) or upload</p>
                          <input
                            type="file"
                            onChange={(e) => handleManualUpload(e, "FRONT")}
                            className="text-[10px] text-white/50 block mx-auto pt-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verso Drop Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#e7fdf8]/90 block">{t.idBackFile} *</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, "BACK")}
                      className={`border-2 border-dashed rounded-xl p-6 text-center relative transition-colors ${dragActive ? "border-[#12b886] bg-[#12b886]/5" : "border-white/10 hover:border-white/15 bg-black/10"}`}
                    >
                      {backUploadedFile ? (
                        <div className="space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-[#12b886] mx-auto" />
                          <p className="text-xs font-semibold text-white">ID Back Loaded</p>
                          <button onClick={() => setBackUploadedFile(null)} className="text-[10px] text-red-400 hover:underline">Remove</button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <FileUp className="w-7 h-7 text-[#12b886] mx-auto opacity-70 mb-1" />
                          <p className="text-[11px] text-[#e7fdf8]/80">Drag ID cover photo (Back) or upload</p>
                          <input
                            type="file"
                            onChange={(e) => handleManualUpload(e, "BACK")}
                            className="text-[10px] text-white/50 block mx-auto pt-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="p-3 bg-black/20 text-[10.5px] border border-white/5 text-[#e7fdf8]/60 rounded-xl leading-normal">
                  ★ Identity verification reviews can be approved instantly on our <strong>Admin Console Panel</strong>. To view document inspect overlays, make sure to login under ADMIN credentials at the top switcher!
                </div>

                <button
                  onClick={handleRequestAuditApproval}
                  disabled={loading || !frontUploadedFile}
                  className="w-full py-2.5 bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.005] cursor-pointer disabled:opacity-50"
                >
                  Confirm Upload & Resubmit Identification Audit Request
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
