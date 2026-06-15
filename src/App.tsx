import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import ClientDashboard from "./components/ClientDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AuthModal from "./components/AuthModal";
import { Language, Currency } from "./types";

// Import dedicated service subpages
import ServiceTransfers from "./components/ServiceTransfers";
import ServiceBills from "./components/ServiceBills";
import ServiceCards from "./components/ServiceCards";
import ServiceAccount from "./components/ServiceAccount";
import ServiceSupport from "./components/ServiceSupport";

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [currency, setCurrency] = useState<Currency>("MAD");
  
  // Custom router state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // App authentication state
  const [authPhone, setAuthPhone] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Track popstate changes (back/forward history)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync state initialization with localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem("trustsend_phone");
    if (savedPhone) {
      setAuthPhone(savedPhone);
    }
    const savedLang = localStorage.getItem("trustsend_lang");
    if (savedLang) {
      setLang(savedLang as Language);
    }
    const savedCurrency = localStorage.getItem("trustsend_currency");
    if (savedCurrency) {
      setCurrency(savedCurrency as Currency);
    }
  }, []);

  const handleLoginSuccess = (phone: string) => {
    setAuthPhone(phone);
    localStorage.setItem("trustsend_phone", phone);
    setShowAuth(false);
    // Secure logins land straight to the primary user cockpit '/' or '/fr'
    const target = lang === "fr" ? "/fr" : "/";
    window.history.pushState({}, "", target);
    setCurrentPath(target);
  };

  const handleLogout = () => {
    setAuthPhone(null);
    localStorage.removeItem("trustsend_phone");
    const target = lang === "fr" ? "/fr" : "/";
    window.history.pushState({}, "", target);
    setCurrentPath(target);
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("trustsend_lang", newLang);
  };

  const handleCurrencyChange = (newCurr: Currency) => {
    setCurrency(newCurr);
    localStorage.setItem("trustsend_currency", newCurr);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  // Dedicated dynamic renderer based on browser URL or current state path
  const renderLoggedOutViews = () => {
    // English path matches
    if (currentPath === "/transfers") {
      return <ServiceTransfers lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/bills") {
      return <ServiceBills lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/cards") {
      return <ServiceCards lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/account") {
      return <ServiceAccount lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/contact") {
      return <ServiceSupport lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }

    // French path matches
    if (currentPath === "/fr/transferts") {
      return <ServiceTransfers lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/fr/factures") {
      return <ServiceBills lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/fr/cartes") {
      return <ServiceCards lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/fr/compte") {
      return <ServiceAccount lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }
    if (currentPath === "/fr/contact") {
      return <ServiceSupport lang={lang} onOpenAuth={() => setShowAuth(true)} />;
    }

    // Default Fallback is LandingPage
    return (
      <LandingPage
        lang={lang}
        onOpenAuth={() => setShowAuth(true)}
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <div className="bg-[#091e21] min-h-screen text-white relative">
      
      {/* Dynamic Navigation Header */}
      <Header
        lang={lang}
        onChangeLang={handleLangChange}
        currency={currency}
        onChangeCurrency={handleCurrencyChange}
        userPhone={authPhone}
        onOpenAuth={() => setShowAuth(true)}
        onLogout={handleLogout}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Main Core Routing Container */}
      <main className="w-full">
        {authPhone ? (
          /* Check if user credentials map to the Admin role simulation */
          authPhone === "+212600000000" ? (
            <AdminDashboard lang={lang} onLogout={handleLogout} />
          ) : (
            <ClientDashboard
              lang={lang}
              currency={currency}
              userPhone={authPhone}
              onLogout={handleLogout}
            />
          )
        ) : (
          renderLoggedOutViews()
        )}
      </main>

      {/* Dynamic Multi-Step Login Modal Overlay */}
      {showAuth && (
        <AuthModal
          lang={lang}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

    </div>
  );
}
