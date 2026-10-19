// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Contact from "./components/Contact";
import OrderNow from "./components/OrderNow";
import WhatsAppButton from "./components/WhatsAppButton";
import Seo from "./components/Seo";

// Home Page Component (your existing landing page)
const HomePage = () => {
  return (
    <>
      <Seo />
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        {/* <Pricing /> */}
        {/* <Roadmap /> */}
        <Contact />
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
      <Route path="/order" element={<><Seo page="order" /><OrderNow /></>} />
      </Routes>
    </>
    );
};

export default App;