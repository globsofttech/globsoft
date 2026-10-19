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

    fetch(`${adminPortalUrl}/api/site-content`)
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
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {plans.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{item.title}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 h-[5.5rem] mb-6">
            {item.price && (
              <>
                <div className="h3"> रु </div>
                {item.original_price && (
                  <div className="text-xl text-n-4 line-through">
                    {item.original_price}
                  </div>
                )}
                <div className="text-[5.5rem] leading-none font-bold">
                  {item.price}
                </div>
              </>
            )}
          </div>
          {item.offer && (
            <div className="mb-5 inline-flex rounded-full border border-color-1/40 bg-color-1/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-color-1">
              {item.offer}
            </div>
          )}

          <Button
            className="w-full mb-6"
            href={item.price ? "/order" : "#contact"}
            white={!!item.price}
          >
            {item.price ? "Order Now" : "Contact us"}
          </Button>

          <ul>
            {item.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img src={check} width={24} height={24} alt="Check" />
                <p className="body-2 ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
