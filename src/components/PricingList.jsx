import { useEffect, useState } from "react";
import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";

const PricingList = () => {
  const [plans, setPlans] = useState(pricing);

  useEffect(() => {
    const adminPortalUrl = (
      import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
    ).replace(/\/+$/, "");
    let active = true;

    fetch(`${adminPortalUrl}/api/site-content?fresh=${Date.now()}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Pricing request failed");
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.pricing) && data.pricing.length > 0) {
          setPlans(data.pricing);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((item) => (
        (() => {
          const originalPrice = Number(String(item.original_price ?? "").replace(/,/g, ""));
          const currentPrice = Number(String(item.price ?? "").replace(/,/g, ""));
          const discountPercent =
            originalPrice > 0 && currentPrice >= 0 && currentPrice < originalPrice
              ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
              : null;

          return <div
          key={item.id}
          className="relative flex h-full min-w-0 flex-col rounded-[2rem] border border-n-6 bg-n-8 px-5 py-8 sm:px-6 lg:px-7"
        >
          {discountPercent !== null && (
            <div className="pricing-discount-badge" aria-label={`${discountPercent}% discount`}>
              <span>{discountPercent}%</span>
              <small>OFF</small>
            </div>
          )}
          <h4 className="h4 mb-4 pr-16">{item.title}</h4>

          <p className="body-2 mb-4 min-h-[4rem] text-n-1/50">
            {item.description}
          </p>

          {item.offer && (
            <div className="mb-4 w-fit max-w-full rounded-full border border-color-1/40 bg-color-1/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-color-1">
              {item.offer}
            </div>
          )}

          <div className="mb-6 flex min-h-[6.5rem] flex-wrap items-end gap-x-3 gap-y-1">
            {item.price && (
              <>
                <div className="mb-2 text-2xl">रु</div>
                {item.original_price && (
                  <div className="mb-2 text-lg text-n-4 line-through">
                    {item.original_price}
                  </div>
                )}
                <div className="max-w-full break-all text-[clamp(3.25rem,6vw,5.5rem)] font-bold leading-[0.9]">
                  {item.price}
                </div>
              </>
            )}
          </div>

          <Button
            className="mb-6 w-full"
            href={item.price ? "/order" : "#contact"}
            white={!!item.price}
          >
            {item.price ? "Order Now" : "Contact us"}
          </Button>

          <ul className="mt-auto">
            {(Array.isArray(item.features) ? item.features : []).map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img src={check} width={24} height={24} alt="Check" />
                <p className="body-2 ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>;
        })()
      ))}
    </div>
  );
};

export default PricingList;
