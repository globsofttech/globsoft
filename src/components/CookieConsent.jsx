import React, { useState, useEffect } from "react";

const STORAGE_KEY = "globsoft_cookie_consent";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (consentData) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...consentData,
        timestamp: new Date().toISOString(),
      })
    );
    setIsVisible(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Cookie Consent Floating Banner */}
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-lg z-50 animate-fade-in">
          <div className="rounded-2xl bg-[#15131D]/95 backdrop-blur-xl border border-white/15 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    We Value Your Privacy
                  </h3>
                  <p className="text-xs text-gray-400">
                    Cookie & Privacy Preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our site traffic. By clicking{" "}
              <span className="text-white font-medium">"Accept All"</span>, you
              consent to our use of cookies. Read our{" "}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-purple-400 hover:text-purple-300 underline underline-offset-4 font-medium transition-colors"
              >
                Privacy Policy
              </button>{" "}
              to learn more.
            </p>

            {/* Expandable Customize Section */}
            {showCustomize && (
              <div className="mb-5 space-y-3 border-t border-b border-white/10 py-4 text-xs">
                {/* Strictly Necessary */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      Strictly Necessary Cookies
                    </p>
                    <p className="text-gray-400">
                      Required for core site functionality and security.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-gray-300 font-mono text-[11px]">
                    Always Active
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-semibold text-white">
                      Analytics & Performance
                    </p>
                    <p className="text-gray-400">
                      Helps us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePreference("analytics")}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      preferences.analytics ? "bg-purple-600" : "bg-white/15"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.analytics ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-semibold text-white">
                      Marketing & Targeting
                    </p>
                    <p className="text-gray-400">
                      Used to deliver relevant advertisements and campaigns.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePreference("marketing")}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      preferences.marketing ? "bg-purple-600" : "bg-white/15"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.marketing ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCustomize(!showCustomize)}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all"
              >
                {showCustomize ? "Hide Options" : "Customize"}
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all"
              >
                Necessary Only
              </button>

              {showCustomize ? (
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 transition-all"
                >
                  Save Preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 transition-all"
                >
                  Accept All Cookies
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal Pop-up */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#15131D] border border-white/15 text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E0C15]">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Privacy & Cookie Policy
                </h2>
                <p className="text-xs text-gray-400">
                  Last Updated: October 2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-white font-semibold mb-1">
                  1. Introduction
                </h3>
                <p>
                  Welcome to Globsoft. We respect your privacy and are committed
                  to protecting your personal data. This Privacy Policy explains
                  how we collect, use, and safeguard your information when you
                  visit our website.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  2. Information We Collect
                </h3>
                <p>
                  We may collect personal identification information (such as
                  your name, email address, and phone number when you fill out
                  contact forms) as well as non-personal technical data (such as
                  browser type, IP address, and usage patterns via cookies).
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  3. How We Use Cookies
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-white">Essential Cookies:</strong>{" "}
                    Necessary for the website to function properly and securely.
                  </li>
                  <li>
                    <strong className="text-white">Analytics Cookies:</strong>{" "}
                    Allow us to count visits and traffic sources so we can
                    measure and improve the performance of our site.
                  </li>
                  <li>
                    <strong className="text-white">Marketing Cookies:</strong>{" "}
                    Help us provide relevant content and measure the
                    effectiveness of our campaigns.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  4. Data Security & Third-Party Sharing
                </h3>
                <p>
                  We implement strict security measures to protect your personal
                  data. We do not sell, trade, or rent your personal
                  identification information to third parties.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  5. Your Privacy Rights
                </h3>
                <p>
                  You have the right to access, update, or request deletion of
                  your personal data at any time, and you can withdraw your
                  cookie consent by clearing your browser storage or updating
                  your preferences.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#0E0C15]">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrivacyModal(false);
                  handleAcceptAll();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition-all"
              >
                Accept All & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
