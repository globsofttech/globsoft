// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Services from "./components/Services";
import Contact from "./components/Contact";
import OrderNow from "./components/OrderNow";
import WhatsAppButton from "./components/WhatsAppButton";
import Seo from "./components/Seo";
import OfferBanner from "./components/OfferBanner";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import Team from "./components/Team";
import CookieConsent from "./components/CookieConsent";
import { CartProvider } from "./context/CartContext";
import Shop from "./components/Shop";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

// Automatically scrolls to anchor elements across page navigation and SPA route changes
const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      if (!id) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const headerOffset = 90;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return null;
};

// Home Page Component
const HomePage = () => {
  return (
    <>
      <Seo />
      <div className="overflow-hidden">
        <OfferBanner />
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <Testimonials />
        {/* <Roadmap /> */}
        <Contact />
        <Footer />
      </div>
      <ButtonGradient />
      <WhatsAppButton />
    </>
  );
};

// Blog listing page
const BlogPage = () => {
  return (
    <>
      <div className="overflow-hidden">
        <OfferBanner />
        <Header />
        <BlogList />
        <Footer />
      </div>
      <ButtonGradient />
      <WhatsAppButton />
    </>
  );
};

// Single blog post page
const BlogPostPage = () => {
  return (
    <>
      <div className="overflow-hidden">
        <OfferBanner />
        <Header />
        <BlogPost />
        <Footer />
      </div>
      <ButtonGradient />
      <WhatsAppButton />
    </>
  );
};

// ✅ Renamed from Team to TeamPage to avoid clashing with imported Team component
const TeamPage = () => {
  return (
    <>
      <Seo page="team" />
      <div className="overflow-hidden">
        <OfferBanner />
        <Header />
        <Team />
        <Footer />
      </div>
      <ButtonGradient />
      <WhatsAppButton />
    </>
  );
};

// Shop Page Component
const ShopPage = () => {
  return (
    <>
      <Seo page="shop" />
      <div className="overflow-hidden">
        <OfferBanner />
        <Header />
        <Shop />
        <Footer />
      </div>
      <ButtonGradient />
      <WhatsAppButton />
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <ScrollToAnchor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        {/* ✅ Uses TeamPage here */}
        <Route path="/team" element={<TeamPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route
          path="/order"
          element={
            <>
              <Seo page="order" />
              <OrderNow />
              <WhatsAppButton />
            </>
          }
        />
      </Routes>

      {/* Global Shopping Cart & Cash on Delivery Checkout Modals */}
      <CartDrawer />
      <CheckoutModal />

      {/* ✅ Placed globally so cookie consent works on all pages */}
      <CookieConsent />
    </CartProvider>
  );
};

export default App;
