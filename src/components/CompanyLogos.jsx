import { companyLogos } from "../constants";

const CompanyLogos = ({ className }) => {
  return (
    <div id="clients" className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Helped Businesses Grow Online at
      </h5>
      <ul className="flex">
        {companyLogos.map((company, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem]"
            key={index}
          >
            <a href={company.url} target="_blank" rel="noopener noreferrer">
              <img
                src={company.logo}
                width={134}
                height={28}
                alt={`Company Logo ${index + 1}`}
                className="w-[16vw] h-[13vh] object-contain grayscale"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;