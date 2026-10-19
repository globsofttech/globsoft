// src/App.jsx
import { Routes, Route } from 'react-router-dom';
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
        <Header />
        <BlogPost />
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
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