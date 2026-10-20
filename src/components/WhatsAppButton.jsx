import { useState } from "react";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const phoneNumber = "9779802922270";
  const message = "Hello! I need support with your service Globsoft Tech";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const messengerUrl = "https://m.me/globsoftech";
  const instagramUrl = "https://ig.me/m/globsoftech";

  const channels = [
    {
      label: "Message us on Instagram",
      href: instagramUrl,
      color: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Message us on Messenger",
      href: messengerUrl,
      color: "bg-[#0084ff] hover:bg-[#0075e6]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.912 1.454 5.5 3.73 7.1V22l3.421-1.879c.91.252 1.862.399 2.849.399 5.523 0 10-4.145 10-9.26S17.523 2 12 2Zm.994 12.46-2.55-2.72-4.974 2.72 5.476-5.813 2.612 2.72 4.912-2.72-5.476 5.813Z" />
        </svg>
      ),
    },
    {
      label: "Message us on WhatsApp",
      href: whatsappUrl,
      color: "bg-[#25D366] hover:bg-[#20bd5a]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.198-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
          <path d="M12.05 2a9.89 9.89 0 0 0-8.48 15.08l-.99 3.63 3.74-.98A9.89 9.89 0 1 0 12.05 2Zm0 17.8h-.004a7.9 7.9 0 0 1-4.03-1.1l-.29-.17-2.22.58.59-2.16-.19-.3a7.9 7.9 0 1 1 6.14 3.15Z" />
        </svg>
      ),
    },
  ];

  const toggleChannels = () => {
    setIsOpen((open) => !open);
  };

  return (
    // CHANGE 1: Added "pointer-events-none" to the outer wrapper so it doesn't block the footer
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      <div
        // CHANGE 2: Added "pointer-events-auto" when isOpen is true, and "hidden" when closed so it takes 0 height
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-2 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        {channels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isOpen ? 0 : -1}
            className="flex items-center gap-3 text-sm font-medium text-white drop-shadow"
            aria-label={channel.label}
          >
            <span className="rounded-lg bg-n-8/95 px-3 py-2">{channel.label.replace("Message us on ", "")}</span>
            <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 ${channel.color}`}>
              <span className="h-6 w-6">{channel.icon}</span>
            </span>
          </a>
        ))}
      </div>

      {showPrompt && (
        // CHANGE 3: Added "pointer-events-auto" so the prompt & close button can still be clicked
        <div className="pointer-events-auto relative mb-1 flex max-w-[14rem] items-center gap-2 rounded-2xl border border-color-1/30 bg-n-8/95 px-4 py-3 text-sm text-n-1 shadow-2xl backdrop-blur-sm animate-[bubble-in_400ms_ease-out]">
          <span className="absolute -bottom-2 right-7 h-4 w-4 rotate-45 border-b border-r border-color-1/30 bg-n-8/95" />
          <span className="relative z-10">
            <strong className="block font-semibold">Want to know more?</strong>
            <span className="text-n-3">Get in touch with us.</span>
          </span>
          <button
            type="button"
            onClick={() => setShowPrompt(false)}
            className="relative z-10 self-start text-n-4 transition-colors hover:text-n-1"
            aria-label="Dismiss contact prompt"
          >
            ×
          </button>
        </div>
      )}

      {/* CHANGE 4: Added "pointer-events-auto" so the main floating button works */}
      <div className="pointer-events-auto relative">
        {!isOpen && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#00e5ff] via-[#ff4ecd] to-[#7c3aed] shadow-[0_0_24px_rgba(255,78,205,0.65)] animate-[contact-pulse_2.4s_ease-out_infinite]" />
        )}
        <a
          href="#contact"
          onClick={(event) => {
            event.preventDefault();
            toggleChannels();
          }}
          className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-color-1 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl md:h-16 md:w-16"
          aria-label={isOpen ? "Close messaging options" : "Open messaging options"}
          aria-expanded={isOpen}
        >
          <svg className="relative h-9 w-9 text-white md:h-10 md:w-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {isOpen ? (
              <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v4a3.5 3.5 0 0 1-3.5 3.5h-3l-4.5 4v-4.05A3.5 3.5 0 0 1 5 10.5v-4Z" fill="currentColor" />
                <path d="M8 8h8M8 11h5" stroke="#001b3d" strokeWidth="1.4" strokeLinecap="round" />
              </>
            )}
          </svg>
        </a>
      </div>
    </div>
  );
};

export default WhatsAppButton;