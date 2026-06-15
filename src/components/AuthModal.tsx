import React, { useState } from "react";
import { translations } from "../utils/translations";
import { Language } from "../types";
import { Phone, Lock, CheckCircle2, ShieldAlert, ArrowRight, UserPlus } from "lucide-react";

interface AuthModalProps {
  lang: Language;
  onLoginSuccess: (phone: string, isNewUser?: boolean) => void;
  onClose: () => void;
}

export default function AuthModal({ lang, onLoginSuccess, onClose }: AuthModalProps) {
  const t = translations[lang];
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP" | "REGISTER">("PHONE");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register Fields
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setStep("OTP");
      } else {
        setError(data.error || t.errorMsg);
      }
    } catch {
      setError(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: otpCode }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.isNewUser) {
          setStep("REGISTER");
        } else {
          onLoginSuccess(phoneNumber, false);
          onClose();
        }
      } else {
        setError(data.error || t.errorMsg);
      }
    } catch {
      setError(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nationalId || !email) {
      setError("Please complete all required verification fields");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          nationalId,
          birthDate,
          address,
          city,
          phone: phoneNumber,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(phoneNumber, true);
        onClose();
      } else {
        setError(data.error || t.errorMsg);
      }
    } catch {
      setError(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0b2a2f] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d7e67] to-[#12b886]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t.authWelcome}</h2>
          <p className="text-xs text-[#e7fdf8]/70 mt-1">{t.authSubtitle}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/20 rounded-lg flex items-start gap-2 text-xs text-red-200">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step: PHONE ENTRY */}
        {step === "PHONE" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1.5">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#e7fdf8]/40 text-sm">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#0d7e67] transition-all"
                />
              </div>
              <p className="text-[10px] text-[#e7fdf8]/40 mt-1.5">
                Administrators can use default phone number <span className="text-[#12b886] font-semibold">+212600000000</span> to access administrative dashboards instantly. Users login with any other number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-90 disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {loading ? "..." : t.otpSend}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step: OTP VERIFICATION */}
        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-lg mb-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-[#12b886] mx-auto mb-1" />
              <p className="text-xs text-[#e7fdf8]/90 font-medium">{t.otpSentAlert}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#e7fdf8]/80 mb-1.5">
                {t.enterOtpCode}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#e7fdf8]/40 text-sm">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder={t.otpCodePlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-center tracking-widest bg-black/30 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#0d7e67] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-90 disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {loading ? "..." : t.otpVerify}
            </button>

            <button
              type="button"
              className="w-full text-center text-[11px] text-[#e7fdf8]/50 hover:text-white underline"
              onClick={() => {
                setStep("PHONE");
                setOtpSent(false);
              }}
            >
              Back to phone entry
            </button>
          </form>
        )}

        {/* Step: MULTI-STEP NEW PROFILE REGISTER */}
        {step === "REGISTER" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/15 rounded-lg mb-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#12b886]" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Verification Profile Signup</p>
                <p className="text-[10px] text-[#e7fdf8]/70">Enter standard details matching your CIN card.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-[#e7fdf8]/70 mb-1">
                  {t.fullNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Yasmine Benziane"
                  className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#12b886]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#e7fdf8]/70 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.ma"
                  className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#12b886]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-[#e7fdf8]/70 mb-1">
                  {t.beneficiaryIdCard} *
                </label>
                <input
                  type="text"
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="e.g. AE987654"
                  className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#e7fdf8]/70 mb-1">
                  {t.birthDateLabel} *
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#e7fdf8]/70 mb-1">
                {t.addressLabel}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Avenue, Appt, Residence..."
                className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#e7fdf8]/70 mb-1">
                {t.cityLabel}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Casablanca"
                className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
              />
            </div>

            <div className="border border-white/5 rounded-lg p-2.5 bg-black/20 text-[10px] text-[#e7fdf8]/50">
              Note: Complete registration defaults to regulatory status <strong>PENDING</strong>. Real-time approval from our Admin Console is required to access transactional money components.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 bg-gradient-to-r from-[#0d7e67] to-[#12b886] hover:opacity-90 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {loading ? "..." : t.submitVerification}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
