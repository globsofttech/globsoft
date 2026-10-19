import { companyLogos } from "../constants";
import { useEffect, useState } from "react";

const CompanyLogos = ({ className }) => {
  const [clients, setClients] = useState(companyLogos);

  useEffect(() => {
    const adminPortalUrl = (
      import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
    ).replace(/\/+$/, "");
    let active = true;

    fetch(`${adminPortalUrl}/api/site-content`)
      .then((response) => {
        if (!response.ok) throw new Error("Client showcase request failed");
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(data.clients);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div id="clients" className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Helped Businesses Grow Online at
      </h5>
      <ul className="company-logo-list flex">
        {clients.map((company, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem]"
            key={index}
          >
            <a href={company.url} target="_blank" rel="noopener noreferrer">
              <img
                src={company.logo?.startsWith("/src/assets/notification/")
                  ? companyLogos[index]?.logo
                  : company.logo}
                width={134}
                height={28}
                alt={`${company.name || "Company"} logo`}
                className="w-[16vw] min-w-[134px] h-[13vh] object-contain grayscale"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;