import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { brandMotto, brandName, socials } from "../constants";
import { brainwave } from "../assets";
import { curve } from "../assets";

const Footer = () => {
  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState({ status: "idle", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [systemStatus, setSystemStatus] = useState({
    status: "running",
    message: "All Systems Operational",
  });

  const statusType = ["degraded", "maintenance", "warning"].includes(systemStatus.status)
    ? "warning"
    : ["down", "outage", "error"].includes(systemStatus.status)
      ? "error"
      : "running";

  useEffect(() => {
    let isMounted = true;

    const updateSystemStatus = async () => {
      try {
        const response = await fetch(`${adminPortalUrl}/api/system-status`);

        if (!response.ok) {
          throw new Error(`System status request failed: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted && data.status && data.message) {
          setSystemStatus({ status: data.status, message: data.message });
        }
      } catch (error) {
        console.warn("Failed to fetch system status from API, using fallback");
      }
    };

    updateSystemStatus();

    return () => {
      isMounted = false;
    };
  }, [adminPortalUrl]);

  useEffect(() => {
    if (!turnstileSiteKey) {
      return undefined;
    }

    let isMounted = true;
    const renderTurnstile = () => {
      if (
        isMounted &&
        turnstileRef.current &&
        window.turnstile &&
        turnstileWidgetId.current === null
      ) {
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      }
    };

    renderTurnstile();
    const timer = window.setInterval(renderTurnstile, 250);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, [turnstileSiteKey]);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    if (!turnstileSiteKey || !turnstileToken) {
      setNewsletterState({
        status: "error",
        message: "Please complete the security check before subscribing.",
      });
      return;
    }
    setNewsletterState({ status: "submitting", message: "" });

    try {
      const response = await fetch(`${adminPortalUrl}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, turnstile_token: turnstileToken }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Newsletter service is temporarily unavailable.");
      }

      setNewsletterEmail("");
      setTurnstileToken("");
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      setNewsletterState({ status: "success", message: "Thanks for subscribing!" });
    } catch (error) {
      setNewsletterState({
        status: "error",
        message:
          error instanceof TypeError
            ? "Newsletter service is temporarily unavailable. Please try again later."
            : error.message || "Unable to subscribe. Please try again.",
      });
    }
  };

  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container">
        {/* Top Row - Logo, Moto, and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          {/* Logo and Moto */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-7">
            <img src={brainwave} className="w-[4rem]" height={50} alt="Globsoft Tech logo" />
              
            </div>
            <span className="inline-block relative">

            {brandMotto}{" "}
             <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-1"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
            <br />

            <p className="caption text-n-0 text-center md:text-left">
            Bharatpur - 7 Chitwan, 44200 <br />
            Madi Thori Street, Nepal<br />
            Phone: +977 9802922270 <br />
            Mail: info.globsoft@gmail.com <br />
            PAN: 162747847
           
            
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:flex gap-8 md:gap-15">
            <a href="#" className="caption text-n-4 hover:text-n-1 transition-colors">
              Home
            </a>
            <a href="#clients" className="caption text-n-4 hover:text-n-1 transition-colors">
              Our Clients
            </a>
            <a href="#features" className="caption text-n-4 hover:text-n-1 transition-colors">
              Services
            </a>
            <a href="#contact" className="caption text-n-4 hover:text-n-1 transition-colors">
            Contact
            </a>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-n-6 bg-n-7/60 p-6 md:flex md:items-center md:justify-between md:gap-8">
          <div className="mb-5 md:mb-0">
            <h2 className="h5 mb-2">Stay updated</h2>
            <p className="body-2 text-n-4">Get the latest news and insights from Globsoft Tech.</p>
          </div>
          <form className="w-full md:max-w-xl" onSubmit={handleNewsletterSubmit}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={newsletterState.status === "submitting"}
                className="min-w-0 flex-1 rounded-xl border border-n-6 bg-n-8 px-5 py-3 body-2 text-n-1 outline-none transition-colors placeholder:text-n-4 focus:border-color-1 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={newsletterState.status === "submitting" || !turnstileToken}
                className="rounded-xl bg-color-1 px-6 py-3 button text-n-8 transition-colors hover:bg-color-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {newsletterState.status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {turnstileSiteKey ? (
              <div ref={turnstileRef} className="mt-3 min-h-[65px]" />
            ) : (
              <p className="mt-3 body-2 text-color-3">
                Newsletter security is not configured yet.
              </p>
            )}
            <p
              className={`mt-3 body-2 ${newsletterState.status === "success" ? "text-color-4" : "text-color-3"}`}
              role="status"
              aria-live="polite"
            >
              {newsletterState.message}
            </p>
          </form>
        </div>

        {/* Google Map */}
        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-10">
          <iframe
            src="https://www.google.com/maps?q=GlobSoft+Inc&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Globsoft Tech"
          ></iframe>
        </div>

        {/* Bottom Row - Copyright, status, admin, and socials */}
        <div className="flex sm:justify-between justify-center items-center gap-6 max-sm:flex-col">
          <p className="caption text-n-4 text-center lg:text-left">
            {brandName} © {new Date().getFullYear()} All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 caption text-n-4" aria-label={systemStatus.message}>
              <span className={`status-dot status-dot-${statusType} h-2 w-2 rounded-full`} aria-hidden="true" />
              <span>{systemStatus.message}</span>
            </div>

            <a
              href={adminPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 caption text-n-4 transition-colors hover:text-n-1"
            >
              <i className="ri-shield-keyhole-line" aria-hidden="true" />
              Are you the admin?
            </a>

            <ul className="flex gap-5 flex-wrap">
            {socials.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
              >
                <img src={item.iconUrl} width={16} height={16} alt={item.title} />
              </a>
            ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;