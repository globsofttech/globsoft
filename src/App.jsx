// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
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

// Automatically scrolls to anchor elements across page navigation and SPA route changes
const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      if (!id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const headerOffset = 90;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return null;
};

// Home Page Component (your existing landing page)
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
        {/* <Roadmap /> */}
        <Contact />
        <Footer />
      </div>
      <CookieConsent />
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
const Team = () => {
  return (
    <>
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

const App = () => {
  return (
    <>
      <ScrollToAnchor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/team" element={<Team />} />
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
    </>
  );
};

export default App;
