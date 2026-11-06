import { useLocation, useNavigate, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";

import { brainwave } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { useCart } from "../context/CartContext";
import { HamburgerMenu } from "./design/Header";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    return () => {
      enablePageScroll();
    };
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  // Smoothly scroll to a section taking into account fixed header + offer banner
  const scrollToAnchor = (hash) => {
    const id = hash.replace(/^#/, "");
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offerOffset =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--offer-header-offset"
            )
          ) || 0;
        const headerOffset = 84 + offerOffset;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 80);
  };

  // Handle navigation clicks - works seamlessly across all pages and mobile devices
  const handleNavClick = (e, url) => {
    handleClick();

    if (url.startsWith("#")) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/" + url);
      } else {
        window.history.pushState(null, "", url);
        scrollToAnchor(url);
      }
    }
  };

  // Handle logo click
  const handleLogoClick = (e) => {
    handleClick();
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/#hero");
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "#hero");
    }
  };

  return (
    <div
      className={`fixed left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
      style={{ top: "var(--offer-header-offset, 0px)" }}
    >
      <div className="flex items-center h-[4.75rem] lg:h-[5.25rem] px-4 sm:px-5 lg:px-6 xl:px-8 2xl:px-10">
        <a
          className="flex items-center flex-shrink-0 mr-3 lg:mr-4 xl:mr-6"
          href="#hero"
          onClick={handleLogoClick}
          aria-label="Globsoft Tech Home"
        >
          <img
            src={brainwave}
            className="w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 object-contain"
            width={48}
            height={48}
            alt="Globsoft Tech logo"
          />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed inset-x-0 top-[calc(4.75rem+var(--offer-header-offset,0px))] bottom-0 bg-n-8 max-lg:overflow-x-hidden max-lg:overflow-y-auto max-lg:overscroll-contain z-50 flex-col items-center lg:static lg:flex lg:flex-row lg:inset-auto lg:top-auto lg:bottom-auto lg:bg-transparent lg:overflow-visible lg:mx-auto lg:min-h-0 max-lg:px-6 max-lg:pb-12`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto py-6 lg:m-auto lg:py-0 lg:flex-row">
            {navigation.map((item) => {
              const isActive = item.isPage
                ? location.pathname === item.url
                : item.url === location.hash;

              const itemClass = `block relative font-code text-xl sm:text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                item.onlyMobile ? "lg:hidden" : ""
              } px-6 py-3.5 sm:py-4 md:py-5 lg:py-6 xl:py-7 lg:px-2 xl:px-3.5 2xl:px-5 lg:text-[11px] xl:text-[12px] 2xl:text-xs lg:font-semibold lg:leading-5 whitespace-nowrap tracking-wider ${
                isActive ? "z-2 lg:text-n-1 text-color-1" : "lg:text-n-1/60"
              } lg:hover:text-n-1`;

              if (item.isPage) {
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={handleClick}
                    className={itemClass}
                  >
                    {item.title}
                  </Link>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={(e) => handleNavClick(e, item.url)}
                  className={itemClass}
                >
                  {item.title}
                </a>
              );
            })}

            <div className="lg:hidden mt-6 flex flex-col items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => {
                  handleClick();
                  openCart();
                }}
                className="w-full py-2.5 px-6 rounded-xl bg-n-7 border border-n-6 text-n-1 text-xs font-semibold flex items-center justify-center gap-2 hover:border-color-1/40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>View Cart</span>
                {totalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-color-1 text-n-1 text-[10px] font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
              <Button href="/order" onClick={handleClick} className="w-full">
                Order Now
              </Button>
            </div>
          </div>

          <HamburgerMenu />
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 xl:gap-3 ml-auto flex-shrink-0">
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 lg:p-2.5 rounded-xl border border-n-6 bg-n-7 hover:bg-n-6 text-n-1 transition-all flex items-center justify-center hover:border-color-1/40 group flex-shrink-0"
            aria-label="Open Shopping Cart"
            title="Shopping Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-color-1 transition-colors">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-color-1 text-n-1 text-[10px] font-bold flex items-center justify-center shadow-lg shadow-color-1/40">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </button>

          <Button className="hidden lg:flex flex-shrink-0 px-4 xl:px-6 text-xs whitespace-nowrap" href="/order">
            Order Now
          </Button>

          <Button
            className="lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
            aria-label={openNavigation ? "Close menu" : "Open menu"}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
