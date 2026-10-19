import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { pricing as fallbackPricing } from "../constants";

const getDiscount = (plan) => {
  const original = Number(String(plan.original_price ?? "").replace(/,/g, ""));
  const current = Number(String(plan.price ?? "").replace(/,/g, ""));

  if (original <= 0 || current < 0 || current >= original) {
    return null;
  }

  return Math.round(((original - current) / original) * 100);
};

const OfferBanner = () => {
  const location = useLocation();
  const [offers, setOffers] = useState([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const adminPortalUrl = (
      import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
    ).replace(/\/+$/, "");
    let active = true;

    fetch(`${adminPortalUrl}/api/site-content?fresh=${Date.now()}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Offer request failed");
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.pricing)) {
          setOffers(data.pricing);
        }
      })
      .catch(() => {
        if (active) setOffers(fallbackPricing);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBanner(window.scrollY <= 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const hasDiscount = offers.some((plan) => getDiscount(plan) !== null);
    document.documentElement.style.setProperty(
      "--offer-header-offset",
      hasDiscount && showBanner ? "4.25rem" : "0px"
    );

    return () => {
      document.documentElement.style.removeProperty("--offer-header-offset");
    };
  }, [offers, showBanner]);

  const discountedPlans = offers
    .map((plan) => ({ ...plan, discount: getDiscount(plan) }))
    .filter((plan) => plan.discount !== null);

  if (discountedPlans.length === 0) {
    return null;
  }

  const messages = discountedPlans.map((plan) => {
    const offer = plan.offer || `${plan.discount}% discount`;
    return `${offer} on ${plan.title} — save ${plan.discount}%`;
  });
  const pricingHref = location.pathname === "/" ? "#pricing" : "/#pricing";

  return (
    <>
      <aside
        className={`offer-banner ${showBanner ? "" : "offer-banner-hidden"}`}
        aria-label="Current offers"
        aria-hidden={!showBanner}
      >
        <div className="offer-banner-track">
          {[0, 1].map((group) => (
            <div className="offer-banner-group" key={group} aria-hidden={group === 1}>
              {messages.map((message, index) => (
                <span className="offer-banner-item" key={`${group}-${index}`}>
                  <span className="offer-banner-spark" aria-hidden="true">✦</span>
                  {message}
                </span>
              ))}
            </div>
          ))}
        </div>
        <a className="offer-banner-link" href={pricingHref}>
          View offers
        </a>
      </aside>
    </>
  );
};

export default OfferBanner;
