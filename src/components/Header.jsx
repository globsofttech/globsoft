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

  // Handle navigation clicks - works on both home and order pages
  const handleNavClick = (e, url) => {
    handleClick();
    
    // If we're not on the home page and clicking a hash link, navigate to home first
    if (location.pathname !== '/' && url.startsWith('#')) {
      e.preventDefault();
      navigate('/' + url);
    }
  };

  // Handle logo click
  const handleLogoClick = (e) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/#hero');
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
        >
          <img src={brainwave} className="w-[4rem]" height={50} alt="Globsoft Tech logo" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
            } absolute top-full left-0 right-0 min-h-[calc(100vh-5rem)] bg-n-8 lg:static lg:flex lg:mx-auto lg:min-h-0 lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => {
              const isActive = item.isPage
                ? location.pathname === item.url
                : item.url === location.hash;
              const itemClass = `block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                item.onlyMobile ? "lg:hidden" : ""
              } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                isActive ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
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
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;