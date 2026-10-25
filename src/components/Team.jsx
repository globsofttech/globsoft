import React from "react";

const teamMembers = [
  {
    id: "1",
    name: "Rajan Poudel",
    role: "Founder & CEO",
    bio: "Passionate self-learned software developer and founder of GlobSoft Inc. MBBS Student at Chitwan Medical College",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    socials: {
      instagram: "https://www.instagram.com/_rajanpoudel",
      linkedin: "https://www.linkedin.com/in/rajanpoudel-np/",
      github: "https://github.com/rajan-poudel",
    },
  },
  {
    id: "2",
    name: "Sourya Poudel",
    role: "Chief Technology Officer",
    bio: "Full-stack architect specializing in distributed cloud systems, cybersecurity, and high-performance web apps.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    socials: {
      instagram: "https://www.instagram.com/sourya_poudel_",
      linkedin: "https://www.linkedin.com/in/sourya-poudel/",
      github: "https://github.com/sourya-poudel",
    },
  },
  {
    id: "3",
    name: "Ankit Lamsal",
    role: "Finance Head",
    bio: "Oversees Globsoft Tech's finances, managing cash flow, budgeting, and financial planning to keep the company stable and growing.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    socials: {
      instagram: "https://www.instagram.com/ankiit9638",
    },
  },
  },
];

const Team = () => {
  return (
    <section
      id="team"
      className="relative py-20 lg:py-28 bg-[#0E0C15] text-white overflow-hidden border-t border-white/10"
    >
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 md:px-10 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4">
            <span>[ Meet Globsoft ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            The Minds Behind Our Innovation
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            We are a collective of engineers, designers, and strategists dedicated
            to building next-generation digital products that empower businesses
            worldwide.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative rounded-2xl bg-[#15131D] border border-white/10 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between"
            >
              <div>
                {/* Avatar Container */}
                <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden bg-[#1D1A27]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15131D] via-transparent to-transparent opacity-60" />
                </div>

                {/* Member Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-wider text-purple-400/90 mt-1">
                    {member.role}
                  </p>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {member.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                <a
                  href={member.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} Twitter`}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} GitHub`}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
