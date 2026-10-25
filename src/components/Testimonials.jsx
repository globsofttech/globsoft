import { useEffect, useState } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { fallbackTestimonials, companyLogos } from "../constants";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    const adminPortalUrl = (
      import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
    ).replace(/\/+$/, "");
    let active = true;

    fetch(`${adminPortalUrl}/api/site-content?fresh=${Date.now()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        return res.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <Section id="testimonials" className="overflow-hidden">
      <div className="container relative z-2">
        <Heading
          tag="Client Stories"
          title="What Businesses Say About Us"
          text="Hear directly from founders and business leaders whose online presence we helped build and scale."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, index) => {
            // Match with companyLogos fallback if logo/avatar is local asset
            const logoSrc =
              item.logo ||
              item.avatar ||
              (companyLogos[index] ? companyLogos[index].logo : null);

            return (
              <div
                key={item.id || index}
                className="relative flex flex-col justify-between p-8 rounded-[2rem] bg-n-8 border border-n-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] group"
              >
                <div>
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1.5 text-color-1">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-current text-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-mono uppercase tracking-wider bg-color-1/10 text-color-1 border border-color-1/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-color-1 animate-pulse" />
                      Client Review
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="body-2 text-n-2 mb-8 italic leading-relaxed text-base sm:text-lg">
                    "{item.quote}"
                  </blockquote>
                </div>

                {/* Author & Business Info */}
                <div className="pt-6 border-t border-n-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {logoSrc ? (
                      <div className="w-12 h-12 rounded-xl bg-n-7 border border-n-6 p-2 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={logoSrc}
                          alt={item.company || item.name}
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 shrink-0">
                        {(item.name || "C")[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-n-1 text-base group-hover:text-purple-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-n-4">
                        {item.role}{" "}
                        {item.company && (
                          <span className="text-n-3">· {item.company}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Company Website Link */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-color-1 hover:text-white transition-colors ml-auto sm:ml-0"
                    >
                      <span>Visit Site</span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;
