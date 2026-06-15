import React, { useState, useEffect } from "react";
import { translations } from "../utils/translations";
import { Language, User, Transaction, Transfer, CardRequest, Complaint, AuditLog } from "../types";
import { 
  Users, ArrowRightLeft, CreditCard, ShieldCheck, 
  Trash2, Send, CheckCircle2, AlertTriangle, 
  MessageSquare, FileText, BarChart3, Clock, 
  Eye, RefreshCw, Layers
} from "lucide-react";

interface AdminDashboardProps {
  lang: Language;
  onLogout: () => void;
}

export default function AdminDashboard({ lang, onLogout }: AdminDashboardProps) {
  const t = translations[lang];

  // Admin Data states
  const [usersList, setUsersList] = useState<User[]>([]);
  const [transfersList, setTransfersList] = useState<any[]>([]);
  const [cardsList, setCardsList] = useState<any[]>([]);
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Tab tracker
  const [adminTab, setAdminTab] = useState<"ANALYTICS" | "USERS" | "TRANSFERS" | "CARDS" | "TICKETS" | "AUDIT">("ANALYTICS");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedUserDoc, setSelectedUserDoc] = useState<User | null>(null);

  // Tickets support form
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [adminReply, setAdminReply] = useState("");

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Fetch admin database metrics
  const fetchAdminData = async () => {
    try {
      const uRes = await fetch("/api/admin/users");
      const users = await uRes.json();
      setUsersList(users);

      const tRes = await fetch("/api/admin/transfers");
      const transfers = await tRes.json();
      setTransfersList(transfers);

      const cRes = await fetch("/api/admin/cards");
      const cards = await cRes.json();
      setCardsList(cards);

      const compRes = await fetch("/api/admin/complaints");
      const tickets = await compRes.json();
      setTicketsList(tickets);
      if (selectedTicket) {
        const freshTicket = tickets.find((tk: any) => tk.id === selectedTicket.id);
        if (freshTicket) setSelectedTicket(freshTicket);
      }

      const lRes = await fetch("/api/admin/logs");
      const logs = await lRes.json();
      setAuditLogsList(logs);

      const aRes = await fetch("/api/admin/analytics");
      const details = await aRes.json();
      setAnalytics(details);

    } catch (err) {
      console.error("Admin data loading error", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 4000); // Poll administrative metrics
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  // User documents status approval
  const handleUserApproval = async (userId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/users/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action })
      });
      if (res.ok) {
        triggerToast(`User Account Identity action ${action} completed!`);
        setSelectedUserDoc(null);
        fetchAdminData();
      }
    } catch {
      triggerToast(t.errorMsg);
    }
  };

  // Physical Card Production status
  const handleCardStatusChange = async (cardId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/cards/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, status })
      });
      if (res.ok) {
        triggerToast(`Card manufacturing dispatch status updated to ${status}`);
        fetchAdminData();
      }
    } catch {
      triggerToast(t.errorMsg);
    }
  };

  // Ticket support messages dispatcher
  const handleAdminTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminReply) return;

    try {
      const res = await fetch("/api/complaints/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          sender: "ADMIN",
          message: adminReply
        })
      });
      if (res.ok) {
        setAdminReply("");
        fetchAdminData();
        triggerToast("Official support reply appended to ticket successfully.");
      }
    } catch {
      triggerToast(t.errorMsg);
    }
  };

  const handleTicketStatusChange = async (ticketId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/complaints/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status })
      });
      if (res.ok) {
        triggerToast(`Claim ticket status resolved as ${status}.`);
        fetchAdminData();
      }
    } catch {
      triggerToast(t.errorMsg);
    }
  };

  return (
    <div className="bg-[#091e21] text-white min-h-screen font-sans">
      
      {/* Dynamic Toast alerts */}
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 bg-[#12b886] border border-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin Panel Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Upper Header Title and Logout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 bg-[#0b2a2f] border border-white/10 rounded-2xl">
          <div className="text-left">
            <span className="px-2.5 py-1 bg-red-950/40 border border-red-500/20 text-red-300 font-bold font-mono text-[9.5px] rounded uppercase tracking-wider">
              Secure Admin Console Panel
            </span>
            <h1 className="text-2xl font-black mt-1.5 text-white">TrustSend Bank-Grade Operations</h1>
            <p className="text-xs text-[#e7fdf8]/50 mt-0.5">Control client wallets, approve legal identity submissions, and answer support tickets synchronously.</p>
          </div>

          <button
            onClick={onLogout}
            className="text-xs text-[#ff7575] font-bold border border-red-500/10 hover:bg-red-500/5 px-4 py-2 rounded-xl transition-all"
          >
            Leave Admin Area
          </button>
        </div>

        {/* Dashboard Top KPIs Section */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
            
            {/* KPI 1 */}
            <div className="bg-[#0b2a2f] border border-white/15 p-5 rounded-2xl space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-8 w-8 bg-[#12b886]/5 rounded-bl-full" />
              <div className="flex justify-between items-center text-white/50">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Active Net Revenue</span>
                <Users className="w-4 h-4 text-[#12b886]" />
              </div>
              <p className="text-2xl font-black text-[#12b886]">{analytics.mockRevenueMAD.toLocaleString()} MAD</p>
              <p className="text-[10px] text-[#e7fdf8]/40">1.5% international remit surcharge profits</p>
            </div>

            {/* KPI 2 */}
            <div className="bg-[#0b2a2f] border border-white/15 p-5 rounded-2xl space-y-2 relative overflow-hidden">
              <p className="text-[10px] uppercase font-mono tracking-wider text-white/50 font-semibold">{t.adminTotalUsers}</p>
              <p className="text-2xl font-black text-white">{usersList.length} Clients</p>
              <p className="text-[10px] text-yellow-300">
                {analytics.pendingVerificationCount} pending identity verifications
              </p>
            </div>

            {/* KPI 3 */}
            <div className="bg-[#0b2a2f] border border-white/15 p-5 rounded-2xl space-y-2 relative overflow-hidden">
              <p className="text-[10px] uppercase font-mono tracking-wider text-white/50 font-semibold">Cumulative Remittance</p>
              <p className="text-2xl font-black text-white">{transfersList.length} Routes</p>
              <p className="text-[10px] text-[#e7fdf8]/40">National/International remit requests</p>
            </div>

            {/* KPI 4 */}
            <div className="bg-[#0b2a2f] border border-white/15 p-5 rounded-2xl space-y-2 relative overflow-hidden">
              <p className="text-[10px] uppercase font-mono tracking-wider text-white/50 font-semibold">Overall Active Vaults</p>
              <p className="text-2xl font-black text-[#12b886]">{analytics.totalBalanceMAD.toLocaleString()} MAD</p>
              <p className="text-[10px] text-[#e7fdf8]/40">Total cash reserves active in neobank wallets</p>
            </div>

          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Admin Navigation Rail */}
          <div className="lg:col-span-1 space-y-2 text-left">
            <button
              onClick={() => setAdminTab("ANALYTICS")}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${adminTab === 'ANALYTICS' ? 'bg-[#0d7e67] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t.systemAnalyticsTitle.replace("System", "Analytics")}</span>
            </button>

            <button
              onClick={() => setAdminTab("USERS")}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${adminTab === 'USERS' ? 'bg-[#0d7e67] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              <span>{t.adminVerifyDocuments}</span>
              {usersList.some(u => u.status === 'PENDING') && (
                <span className="ml-auto w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setAdminTab("TRANSFERS")}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${adminTab === 'TRANSFERS' ? 'bg-[#0d7e67] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{t.adminTransferMgt}</span>
            </button>

            <button
              onClick={() => setAdminTab("CARDS")}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${adminTab === 'CARDS' ? 'bg-[#0d7e67] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t.adminCardRequests}</span>
            </button>

            <button
              onClick={() => setAdminTab("TICKETS")}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${adminTab === 'TICKETS' ? 'bg-[#0d7e67] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.adminComplaintsMgt}</span>
              {ticketsList.some(t => t.status === 'OPEN') && (
                <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setAdminTab("AUDIT")}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${adminTab === 'AUDIT' ? 'bg-[#0d7e67] text-white shadow-lg' : 'bg-[#0b2a2f] text-[#e7fdf8]/70 hover:text-white'}`}
            >
              <Clock className="w-4 h-4" />
              <span>Timeline Audit Logs</span>
            </button>
          </div>

          {/* Admin Details Section Pane */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* SUBTAB 1: ANALYTICS & REVENUE GRAPHS */}
            {adminTab === "ANALYTICS" && (
              <div className="space-y-6 text-left">
                
                {/* SVG Visual Revenue Plot */}
                <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white">{t.revenueAnalytics}</h3>
                      <p className="text-[11px] text-[#e7fdf8]/50">Cumulative interbank transactions income performance</p>
                    </div>
                  </div>

                  {/* Clean responsive SVG Graph representing revenue totals with zero React 19 incompatibilities */}
                  <div className="w-full h-44 relative flex items-end">
                    
                    <div className="absolute left-0 bottom-0 top-0 w-8 flex flex-col justify-between text-[9px] font-mono text-white/30 text-left border-r border-white/5 pr-1.5 pt-1">
                      <span>500</span>
                      <span>250</span>
                      <span>100</span>
                      <span>0</span>
                    </div>

                    <svg className="w-full h-full pl-10" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <rect x="20" y="114" width="30" height="36" fill="#0d7e67" opacity="0.6" rx="4" />
                      <rect x="120" y="78" width="30" height="72" fill="#12b886" opacity="0.8" rx="4" />
                      <rect x="220" y="96" width="30" height="54" fill="#0d7e67" opacity="0.6" rx="4" />
                      <rect x="320" y="33" width="30" height="117" fill="#12b886" opacity="0.8" rx="4" />
                      <rect x="420" y="15" width="30" height="135" fill="#12b886" rx="4" />
                    </svg>

                    <div className="absolute left-10 right-0 bottom-[-20px] flex justify-between text-[9px] font-mono text-white/40">
                      <span>Mon (+120 MAD)</span>
                      <span>Tue (+240 MAD)</span>
                      <span>Wed (+180 MAD)</span>
                      <span>Thu (+390 MAD)</span>
                      <span>Fri (+450 MAD)</span>
                    </div>

                  </div>
                </div>

                {/* Audit log preview */}
                <div className="bg-[#0b2a2f] border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-wider mb-4">Latest Security Operations</h3>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                    {auditLogsList.slice(0, 5).map((l) => (
                      <div key={l.id} className="p-3 bg-black/15 border border-white/5 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <p className="text-white/90 font-semibold">{l.action}</p>
                          <p className="text-[10px] text-[#e7fdf8]/50 mt-0.5">IP Location address: {l.ipAddress || "127.0.0.1"}</p>
                        </div>
                        <span className="text-[10px] text-white/30 font-mono italic">{new Date(l.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 2: VERIFICATION PANEL & USER LIST */}
            {adminTab === "USERS" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <h3 className="text-sm font-bold text-white mb-4">{t.adminUserMgt}</h3>
                <p className="text-xs text-[#e7fdf8]/50 mb-6">Verify submitted Recto/Verso CIN document copies to authorize transaction permissions.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-black/25 text-[#e7fdf8]/50">
                      <tr>
                        <th className="p-3">Client details</th>
                        <th className="p-3">National ID</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Identity Docs</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/5 text-[11.5px]">
                      {usersList.map((usr) => (
                        <tr key={usr.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-semibold">
                            <p className="text-white leading-tight">{usr.fullName}</p>
                            <p className="text-[10px] text-[#e7fdf8]/50 font-mono">{usr.phoneNumber}</p>
                          </td>
                          <td className="p-3 font-mono text-[#12b886]">{usr.nationalId}</td>
                          <td className="p-3 text-white/70">{usr.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${usr.status === 'VERIFIED' ? 'bg-emerald-950/30 text-[#12b886]' : usr.status === 'PENDING' ? 'bg-yellow-950/20 text-yellow-300' : 'bg-red-950/20 text-red-300'}`}>
                              {usr.status}
                            </span>
                          </td>
                          {/* Photo inspect */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedUserDoc(usr)}
                              className="p-1 px-2.5 bg-white/10 hover:bg-white/15 rounded text-[10.5px] font-semibold text-white/80"
                            >
                              Inspect Files
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {usr.status !== "VERIFIED" && (
                              <button
                                onClick={() => handleUserApproval(usr.id, "APPROVE")}
                                className="px-2 py-1 bg-[#12b886] text-white font-bold text-[10px] rounded"
                              >
                                Approve
                              </button>
                            )}
                            {usr.status !== "SUSPENDED" && (
                              <button
                                onClick={() => handleUserApproval(usr.id, "SUSPEND")}
                                className="px-2 py-1 bg-red-950/40 border border-red-500/20 text-[#ff7575] font-bold text-[10px] rounded"
                              >
                                Suspend
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Identity Inspector Modal Overlay */}
                {selectedUserDoc && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl bg-[#0b2a2f] border border-white/15 rounded-2xl shadow-2xl p-6 text-left">
                      
                      <button
                        onClick={() => setSelectedUserDoc(null)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white"
                      >
                        ✕
                      </button>

                      <h3 className="text-base font-bold text-white mb-2">Legal Identity Document Audit</h3>
                      <p className="text-xs text-[#e7fdf8]/60 mb-6">Reviewing details for Client: <span className="font-semibold text-white">{selectedUserDoc.fullName}</span> ({selectedUserDoc.nationalId})</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-white/50 block font-mono">RECTO COPIES (FRONT)</span>
                          <img
                            src={selectedUserDoc.idFrontUrl || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format"}
                            alt="ID Front"
                            className="w-full aspect-[1.58/1] object-cover border border-white/10 rounded-xl bg-black"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-white/50 block font-mono">VERSO COPIES (BACK)</span>
                          <img
                            src={selectedUserDoc.idBackUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format"}
                            alt="ID Back"
                            className="w-full aspect-[1.58/1] object-cover border border-white/10 rounded-xl bg-black"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => handleUserApproval(selectedUserDoc.id, "APPROVE")}
                          className="px-4 py-2 bg-[#12b886] text-white font-bold text-xs rounded-xl"
                        >
                          Approve Profile Identity
                        </button>
                        <button
                          onClick={() => handleUserApproval(selectedUserDoc.id, "SUSPEND")}
                          className="px-4 py-2 bg-red-950/40 text-red-300 font-semibold border border-red-500/20 rounded-xl"
                        >
                          Decline & Lock Profile
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* SUBTAB 3: TRANSFERS MONITORING */}
            {adminTab === "TRANSFERS" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <h3 className="text-sm font-bold text-white mb-2">Money Transfers Ledger Oversight</h3>
                <p className="text-xs text-[#e7fdf8]/50 mb-6">General ledger containing SMS codes generated for unverified pickup withdrawals.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-black/25 text-[#e7fdf8]/50">
                      <tr>
                        <th className="p-3.5">Reference</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Sender Profile</th>
                        <th className="p-3.5">Recipient Full Name</th>
                        <th className="p-3.5">SMS Pick-up Code</th>
                        <th className="p-3.5 text-right">Draft Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/5">
                      {transfersList.map((t) => (
                        <tr key={t.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-white">{t.reference}</td>
                          <td className="p-3.5">
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#0d7e67]/20 text-[#12b886]">
                              {t.type}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <p className="text-white leading-none">{t.senderName}</p>
                            <span className="text-[10px] text-white/40 font-mono mt-0.5 block">{t.senderPhone}</span>
                          </td>
                          <td className="p-3.5">
                            <p className="text-white leading-none">{t.beneficiaryName}</p>
                            <span className="text-[10px] text-[#e7fdf8]/50 mt-0.5 block">{t.beneficiaryPhone}</span>
                          </td>
                          <td className="p-3.5 font-mono text-yellow-300 font-bold">{t.withdrawalCode || "N/A - Direct"}</td>
                          <td className="p-3.5 text-right font-semibold font-mono text-white">
                            {t.amount.toLocaleString()} {t.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBTAB 4: CARD DISPATCH WORKFLOWS */}
            {adminTab === "CARDS" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <h3 className="text-sm font-bold text-white mb-2">Card Dispatch & Printing Workflow</h3>
                <p className="text-xs text-[#e7fdf8]/50 mb-6">Transition physical credit card manufacturing bounds in real-time.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-black/25 text-[#e7fdf8]/50">
                      <tr>
                        <th className="p-3">Client details</th>
                        <th className="p-3">Card Type</th>
                        <th className="p-3">Generated Card Number</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Transition Dispatch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/5 text-[11.5px]">
                      {cardsList.map((card) => (
                        <tr key={card.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <p className="text-white leading-tight font-semibold">{card.clientName}</p>
                            <span className="text-[10px] text-white/40 font-mono block">{card.clientPhone}</span>
                          </td>
                          <td className="p-3 font-mono text-xs">{card.cardType}</td>
                          <td className="p-3 font-mono text-white">{card.cardNumber || "AWAITING ISSUANCE"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${['ACTIVE', 'DELIVERED'].includes(card.status) ? 'bg-emerald-950/30 text-[#12b886]' : 'bg-yellow-950/20 text-yellow-300'}`}>
                              {card.status}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap space-x-1">
                            {card.status === "REQUESTED" && (
                              <button
                                onClick={() => handleCardStatusChange(card.id, "PRINTING")}
                                className="px-2 py-1 bg-[#0d7e67] hover:bg-[#12b886] text-white text-[10px] font-bold rounded"
                              >
                                Move: Printing
                              </button>
                            )}
                            {card.status === "PRINTING" && (
                              <button
                                onClick={() => handleCardStatusChange(card.id, "SHIPPED")}
                                className="px-2 py-1 bg-yellow-600 text-white text-[10px] font-bold rounded"
                              >
                                Move: Shipped
                              </button>
                            )}
                            {card.status === "SHIPPED" && (
                              <button
                                onClick={() => handleCardStatusChange(card.id, "DELIVERED")}
                                className="px-2 py-1 bg-[#12b886] text-white text-[10px] font-bold rounded"
                              >
                                Move: Delivered (Safe code)
                              </button>
                            )}
                            {card.status === "DELIVERED" && (
                              <button
                                onClick={() => handleCardStatusChange(card.id, "ACTIVE")}
                                className="px-2 py-1 bg-gradient-to-r from-[#0d7e67] to-[#12b886] text-white text-[10px] font-bold rounded"
                              >
                                Activate Physical Chip
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBTAB 5: COMPLAINTS DESK INTERCONNECT */}
            {adminTab === "TICKETS" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                
                {/* Tickets summary list */}
                <div className="md:col-span-5 bg-[#0b2a2f] border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Claim Tickets Inbox</h3>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {ticketsList.map((tk) => (
                        <div
                          key={tk.id}
                          onClick={() => setSelectedTicket(tk)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedTicket?.id === tk.id ? 'bg-[#0d7e67]/20 border-[#12b886]' : 'bg-black/15 border-white/5'}`}
                        >
                          <div className="flex justify-between items-center font-bold text-white mb-0.5">
                            <span>{tk.reference}</span>
                            <span className={`px-1 rounded text-[8px] uppercase ${tk.status === 'IN_PROGRESS' ? 'bg-yellow-950/20 text-yellow-300' : 'bg-green-950/20 text-green-300'}`}>
                              {tk.status}
                            </span>
                          </div>
                          <p className="text-[#e7fdf8]/85 font-semibold line-clamp-1">{tk.clientName}</p>
                          <p className="text-white/50 truncate mt-0.5">{tk.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 text-[10px] text-white/40">
                    Complaints can be triaged and resolved dynamically.
                  </div>
                </div>

                {/* Ticket replying thread */}
                <div className="md:col-span-7 bg-[#0b2a2f] border border-[#12b886]/20 rounded-2xl flex flex-col justify-between h-[450px]">
                  {selectedTicket ? (
                    <>
                      <div className="p-4 border-b border-white/5 bg-black/10 rounded-t-2xl flex justify-between items-center">
                        <div>
                          <span className="text-xs font-mono text-[#12b886] font-bold">{selectedTicket.reference}</span>
                          <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{selectedTicket.title}</h4>
                        </div>

                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleTicketStatusChange(selectedTicket.id, e.target.value)}
                          className="px-2.5 py-1 bg-black/30 border border-white/10 rounded text-[10.5px] text-white focus:outline-none"
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved / Closed</option>
                        </select>
                      </div>

                      {/* Msg stream */}
                      <div className="p-4 flex-1 overflow-y-auto space-y-3">
                        {selectedTicket.messages.map((m: any, idx: number) => {
                          const isAdmin = m.sender === "ADMIN";
                          return (
                            <div key={idx} className={`flex flex-col ${isAdmin ? "items-end text-right" : "items-start text-left"}`}>
                              <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${isAdmin ? "bg-[#0d7e67]/30 text-white rounded-tr-none border border-[#12b886]/20" : "bg-black/30 text-[#e7fdf8]/95 rounded-tl-none border border-white/5"}`}>
                                {m.message}
                              </div>
                              <span className="text-[8px] text-white/30 font-mono mt-1 px-1">{m.sender} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reply field */}
                      <form onSubmit={handleAdminTicketReply} className="p-3 border-t border-white/5 bg-black/15 flex gap-2 rounded-b-2xl">
                        <input
                          type="text"
                          value={adminReply}
                          onChange={(e) => setAdminReply(e.target.value)}
                          placeholder="Draft official administrative response to client..."
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
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#e7fdf8]/35">
                      <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                      <p className="text-xs">Select any incoming client ticket from the left column to process messaging and replies.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SUBTAB 6: SECURITY AUDIT TIMELINE LOGS */}
            {adminTab === "AUDIT" && (
              <div className="bg-[#0b2a2f] border border-white/10 p-6 rounded-2xl text-left">
                
                <h3 className="text-sm font-bold text-white mb-2">Platform Activity Timeline Logs (PCI-DSS Auditable)</h3>
                <p className="text-xs text-[#e7fdf8]/50 mb-6">Chronological, un-editable records of user and administrative sessions on the TrustSend network container.</p>

                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2">
                  {auditLogsList.map((log) => (
                    <div key={log.id} className="p-4 bg-black/15 border-l-2 border-[#12b886] rounded-xl text-xs flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-[#e7fdf8]/95 font-semibold text-white">{log.action}</p>
                        {log.userPhone && (
                          <p className="text-[10px] text-white/35 font-mono">
                            Associated Client: {log.userPhone} | {log.userEmail}
                          </p>
                        )}
                        <p className="text-[9.5px] text-[#e7fdf8]/40">System Host Client Location Address: <strong>{log.ipAddress || "196.115.2.4"}</strong></p>
                      </div>
                      <span className="text-[10px] text-[#12b886] font-mono whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
