// src/components/Shop.jsx
import { useState, useEffect, useMemo } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { useCart } from "../context/CartContext";
import ProductDetailModal from "./ProductDetailModal";

const CATEGORIES = ["All Gear", "Mouse Pads", "Mice", "Keyboards", "Accessories"];

// Fallback initial products if API takes time or offline
const FALLBACK_PRODUCTS = [
  {
    id: "custom-mouse-pad-desk-mat",
    name: "Custom Desk Mat & Gaming Mouse Pad (Extended)",
    category: "Mouse Pads",
    price: 999,
    compare_at_price: 1499,
    badge: "Best Seller",
    is_customizable: true,
    rating: 4.9,
    reviews_count: 84,
    stock: 50,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-smooth precision desk mat crafted from high-density micro-weave cloth. Customize with your own design, artwork, anime, logo, or clean minimalist texture. Features anti-fray precision stitched edges and an anti-skid natural rubber base.",
    specs: [
      "Dimensions: 900 x 400 x 4mm (Extended XXL)",
      "Surface: Ultra-smooth micro-weave speed/control hybrid",
      "Base: 4mm Heavy textured natural rubber",
      "Edges: Double-stitched anti-fray 360° border",
      "Printing: 300+ DPI thermal sublimation (fade-proof, washable)",
      "Water-resistant splash guard coating"
    ],
    custom_options: {
      sizes: ["900 x 400 x 4mm (XXL Extended)", "800 x 300 x 3mm (Standard Desk)", "450 x 400 x 4mm (Esports Square)"],
      surfaces: ["Speed (Silky Smooth)", "Control (Textured Precision)"],
      stitching: ["Edge-to-Edge Print", "Black Stitched Border"]
    }
  },
  {
    id: "pro-rgb-gaming-mouse",
    name: "Globsoft Pulsar Pro RGB Optical Gaming Mouse",
    category: "Mice",
    price: 1899,
    compare_at_price: 2499,
    badge: "High Performance",
    is_customizable: false,
    rating: 4.8,
    reviews_count: 62,
    stock: 35,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    description: "Tournament-grade optical gaming mouse engineered for lightning response and pixel-perfect tracking. Features an ultra-lightweight ergonomic shell, 12,800 DPI optical sensor, Huano 20M click switches, and 16.8M customizable RGB illumination.",
    specs: [
      "Sensor: PixArt 3327 Optical Sensor",
      "DPI: 800 - 12,800 DPI (6 on-the-fly stages)",
      "Polling Rate: 1000Hz (1ms response time)",
      "Weight: 68g Featherweight Honeycomb Body",
      "Switches: Huano Mechanical (20 Million clicks rating)",
      "Cable: 1.8m Ultra-flexible paracord cable"
    ]
  },
  {
    id: "wireless-silent-ergonomic-mouse",
    name: "Globsoft Stealth Silent Dual-Mode Wireless Mouse",
    category: "Mice",
    price: 1499,
    compare_at_price: 1999,
    badge: "Office & Devs",
    is_customizable: false,
    rating: 4.7,
    reviews_count: 47,
    stock: 28,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80",
    description: "Whisper-quiet clicks and seamless productivity. Connects across 3 devices via Bluetooth 5.2 and 2.4GHz wireless dongle. Ergonomic contour thumb-rest prevents wrist fatigue during long coding and design sessions.",
    specs: [
      "Connectivity: Bluetooth 5.2 + 2.4GHz Wireless USB",
      "Noise: 90% Noise Reduction Silent Micro-switches",
      "Battery: Built-in 500mAh USB-C Rechargeable (up to 45 days)",
      "DPI: 1000 / 1600 / 2400 / 3200 DPI",
      "Multi-device pairing with quick toggle switch",
      "Compatible with Windows, macOS, Linux, iPadOS, Android"
    ]
  },
  {
    id: "rgb-mechanical-keyboard-75",
    name: "Globsoft CyberForge 75% Hot-Swappable Mechanical Keyboard",
    category: "Keyboards",
    price: 4499,
    compare_at_price: 5999,
    badge: "Top Rated",
    is_customizable: false,
    rating: 5.0,
    reviews_count: 95,
    stock: 20,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    description: "Compact 75% mechanical keyboard designed for maximum desk space and ergonomic posture. Features full hot-swappable 3/5-pin switch sockets, south-facing per-key RGB backlighting, sound-dampening EVA foam, and PBT double-shot keycaps.",
    specs: [
      "Layout: 75% Compact (84 keys + Multi-function Volume Knob)",
      "Hot-Swap: 5-Pin & 3-Pin Universal Switch Sockets",
      "Switches: Factory-Lubed Linear Red or Tactile Brown Switches",
      "Keycaps: Premium OEM Profile Double-Shot PBT (Oil-Resistant)",
      "Lighting: 18 South-facing RGB backlight modes with audio sync",
      "Structure: Gasket-mount feel with dual sound-dampening foam",
      "Connectivity: Detachable Braided Type-C cable"
    ]
  },
  {
    id: "custom-cyberpunk-mouse-pad",
    name: "Custom Neon Cyberpunk Speed Mouse Pad",
    category: "Mouse Pads",
    price: 1199,
    compare_at_price: 1699,
    badge: "Trending",
    is_customizable: true,
    rating: 4.9,
    reviews_count: 38,
    stock: 40,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic cyberpunk aesthetic desk mat. Customize with your gamer tag, logo, or high-definition cyber/synthwave artwork. Coated with low-friction nano-fabric for ultra-fast flick shots and tracking.",
    specs: [
      "Dimensions: 900 x 400 x 4mm",
      "Surface: Ultra-low friction nano-silk speed cloth",
      "Personalization: Add custom GamerTag / Username or artwork",
      "Edge: Dense 5mm locked anti-peel border",
      "Spill-proof and machine-washable"
    ],
    custom_options: {
      sizes: ["900 x 400 x 4mm", "800 x 300 x 3mm"],
      surfaces: ["Speed (Gliding)", "Control"],
      stitching: ["Edge-to-Edge Print", "Reinforced Black Stitch"]
    }
  },
  {
    id: "coiled-aviator-keyboard-cable",
    name: "Custom Coiled Aviator Keyboard Cable (Type-C to USB-A)",
    category: "Accessories",
    price: 899,
    compare_at_price: 1299,
    badge: "Aesthetic",
    is_customizable: false,
    rating: 4.8,
    reviews_count: 29,
    stock: 25,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    description: "Level up your battle station aesthetic with a double-sleeved coiled keyboard cable featuring a heavy-duty zinc alloy GX12 4-pin aviator connector. Ultra-durable PET mesh over 550 paracord.",
    specs: [
      "Connector: GX12 4-Pin Aviator quick-detach mechanism",
      "Cable: Double-sleeved (Paracord + PET Mesh)",
      "Length: 1.5m straight host side + 15cm reverse coiled side",
      "Terminations: Gold-plated USB Type-C to USB 2.0 Type-A",
      "High-speed charging & zero-latency signal transmission"
    ]
  },
  {
    id: "ergonomic-cooling-gel-wrist-rest",
    name: "Ergonomic Memory Foam Keyboard Wrist Rest (Cooling Gel)",
    category: "Accessories",
    price: 699,
    compare_at_price: 999,
    badge: "Ergonomics",
    is_customizable: false,
    rating: 4.9,
    reviews_count: 33,
    stock: 30,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    description: "Protect wrists from strain, carpal tunnel, and fatigue. Infused with therapeutic cooling gel and high-resilience memory foam covered in breathable Lycra fabric.",
    specs: [
      "Material: High-density slow-rebound memory foam with cooling gel",
      "Size: 360 x 75 x 20mm (Fits 60%, 65%, 75%, TKL keyboards)",
      "Base: Non-slip textured PU grip base",
      "Ergonomic incline slope aligns wrists naturally"
    ]
  }
];

const Shop = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("All Gear");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");

  useEffect(() => {
    let isMounted = true;
    fetch(`${adminPortalUrl}/api/shop/products?fresh=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Using fallback shop products:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [adminPortalUrl]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          activeCategory === "All Gear" ||
          p.category?.toLowerCase() === activeCategory.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        return 0; // featured (order in catalog)
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    if (product.is_customizable) {
      handleOpenProduct(product);
    } else {
      addToCart(product, 1, {});
    }
  };

  return (
    <Section className="pt-[6.5rem] lg:pt-[7.5rem] overflow-hidden" id="shop">
      <div className="container relative z-2">
        {/* Header Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-color-1/10 border border-color-1/30 text-color-1 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-color-1 animate-pulse"></span>
            Cash on Delivery Across Nepal
          </div>
          <Heading
            tag="Globsoft Gear &amp; Custom Accessories"
            title="Engineered for Precision. Tailored for You."
          />
          <p className="body-2 text-n-3 -mt-6">
            Explore bespoke custom mouse pads, tournament-grade mice, hot-swappable mechanical keyboards, and battle-station accessories. Pay safely with cash on doorstep delivery.
          </p>
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-n-7/60 border border-n-6 mb-10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-color-4/15 border border-color-4/30 flex items-center justify-center text-color-4 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <strong className="text-xs text-n-1 block">Free COD Delivery</strong>
              <span className="text-[11px] text-n-4 block">Pay when it arrives</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-color-2/15 border border-color-2/30 flex items-center justify-center text-color-2 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <strong className="text-xs text-n-1 block">Quality Guaranteed</strong>
              <span className="text-[11px] text-n-4 block">1-year build warranty</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-color-6/15 border border-color-6/30 flex items-center justify-center text-color-6 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <strong className="text-xs text-n-1 block">Custom High-Res Print</strong>
              <span className="text-[11px] text-n-4 block">300+ DPI sublimation</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-color-1/15 border border-color-1/30 flex items-center justify-center text-color-1 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <strong className="text-xs text-n-1 block">24-48h Dispatch</strong>
              <span className="text-[11px] text-n-4 block">Speedy order fulfillment</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-8 pb-6 border-b border-n-6">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? "bg-color-1/25 border-color-1 text-color-1 shadow-md shadow-color-1/10"
                    : "bg-n-7/50 border-n-6 text-n-3 hover:text-n-1 hover:border-n-5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 lg:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gear..."
                className="w-full bg-n-7 border border-n-6 rounded-xl pl-9 pr-4 py-2 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-n-4"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-xl px-3 py-2 text-xs text-n-1 focus:outline-none focus:border-color-1 cursor-pointer"
            >
              <option value="featured">Featured Gear</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-n-7/30 border border-n-6 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-n-7 flex items-center justify-center text-n-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-n-2 mb-1">No products found</h4>
            <p className="text-xs text-n-4 mb-4">Try checking a different category or clearing search terms.</p>
            <button
              onClick={() => {
                setActiveCategory("All Gear");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-color-1/20 border border-color-1/40 text-color-1 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const discount =
                p.compare_at_price && p.compare_at_price > p.price
                  ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)
                  : null;

              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenProduct(p)}
                  className="group relative bg-n-7/40 border border-n-6 rounded-2xl overflow-hidden hover:border-color-1/50 transition-all duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-color-1/10"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-n-8/80 p-5 flex items-center justify-center overflow-hidden border-b border-n-6">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80";
                      }}
                    />

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-color-3 text-n-1 font-bold text-[10px] uppercase tracking-wider shadow">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Customizable Badge */}
                    {p.is_customizable && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-color-6/30 border border-color-6/40 text-color-6 font-semibold text-[10px] flex items-center gap-1 shadow">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Custom Print
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-n-4 mb-1.5">
                        <span className="text-color-1 font-medium">{p.category}</span>
                        <div className="flex items-center gap-1 text-color-2">
                          <span>★</span>
                          <span>{p.rating || "4.9"}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold font-grotesk text-n-1 group-hover:text-color-1 transition-colors line-clamp-2 mb-2">
                        {p.name}
                      </h3>

                      <p className="text-xs text-n-4 line-clamp-2 mb-4 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div>
                      {/* Price & Action */}
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-color-4">
                            रु {Number(p.price).toLocaleString()}
                          </span>
                          {p.compare_at_price && p.compare_at_price > p.price && (
                            <span className="text-xs text-n-4 line-through">
                              रु {Number(p.compare_at_price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-color-2 font-medium">
                          COD Available
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProduct(p);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-n-7 border border-n-6 text-n-2 hover:text-n-1 hover:border-n-5 text-xs font-semibold transition-colors"
                        >
                          {p.is_customizable ? "Customize" : "Details"}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, p)}
                          className="w-full py-2 px-3 rounded-xl bg-color-1/20 border border-color-1/40 text-color-1 hover:bg-color-1/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail & Customization Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
};

export default Shop;
