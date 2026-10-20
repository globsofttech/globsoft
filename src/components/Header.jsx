import { useLocation, useNavigate, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import { brainwave } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

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
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
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
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a 
          className="block w-[12rem] xl:mr-8" 
          href="#hero"
          onClick={handleLogoClick}
          aria-label="Globsoft Tech Home"
        >
          <img src={brainwave} className="w-[4rem]" height={50} alt="Globsoft Tech logo" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed inset-x-0 top-[calc(4.75rem+var(--offer-header-offset,0px))] bottom-0 bg-n-8 overflow-y-auto z-50 flex-col items-center lg:static lg:flex lg:flex-row lg:inset-auto lg:top-auto lg:bottom-auto lg:bg-transparent lg:overflow-visible lg:mx-auto lg:min-h-0 max-lg:px-6 max-lg:pb-12`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center my-auto py-6 lg:my-0 lg:py-0 lg:flex-row w-full">
            {navigation.map((item) => {
              const isActive = item.isPage
                ? location.pathname === item.url
                : item.url === location.hash;
              const itemClass = `block relative font-code text-xl sm:text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                item.onlyMobile ? "lg:hidden" : ""
              } px-6 py-3.5 sm:py-4 md:py-5 lg:py-0 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                isActive ? "z-2 lg:text-n-1 text-color-1" : "lg:text-n-1/50"
              } lg:leading-5 lg:hover:text-n-1 xl:px-12`;

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

            <div className="lg:hidden mt-6 flex flex-col items-center gap-3">
              <Button href="/order" onClick={handleClick}>
                Order Now
              </Button>
            </div>
          </div>

          <HamburgerMenu />
        </nav>

        <Button className="hidden lg:flex" href="/order">
          Order Now
        </Button>

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
          aria-label={openNavigation ? "Close menu" : "Open menu"}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
