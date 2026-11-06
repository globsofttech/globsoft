// src/components/FeaturedProducts.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Section from "./Section";
import Heading from "./Heading";
import { useCart } from "../context/CartContext";
import ProductDetailModal from "./ProductDetailModal";

const HOMEPAGE_FEATURED_PRODUCTS = [
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
    description: "Ultra-smooth precision desk mat crafted from high-density micro-weave cloth. Customize with your own design, artwork, anime, logo, or clean minimalist texture. Anti-fray stitched border & natural rubber base.",
    specs: [
      "Dimensions: 900 x 400 x 4mm (Extended XXL)",
      "Surface: Ultra-smooth micro-weave speed/control hybrid",
      "Base: 4mm Heavy textured natural rubber",
      "Printing: 300+ DPI thermal sublimation (fade-proof, washable)",
    ],
    custom_options: {
      sizes: ["900 x 400 x 4mm (XXL Extended)", "800 x 300 x 3mm (Standard Desk)", "450 x 400 x 4mm (Esports Square)"],
      surfaces: ["Speed (Silky Smooth)", "Control (Textured Precision)"],
      stitching: ["Edge-to-Edge Print", "Black Stitched Border"],
    },
  },
  {
    id: "pro-rgb-gaming-mouse",
    name: "Globsoft Pulsar Pro RGB Optical Gaming Mouse",
    category: "Mouse",
    price: 1899,
    compare_at_price: 2499,
    badge: "High Performance",
    is_customizable: false,
    rating: 4.8,
    reviews_count: 62,
    stock: 35,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    description: "Tournament-grade optical gaming mouse engineered for lightning response and pixel-perfect tracking. 12,800 DPI sensor, 68g honeycomb body, and Huano 20M click switches.",
    specs: [
      "Sensor: PixArt 3327 Optical (Up to 12,800 DPI)",
      "Weight: 68g Featherweight Honeycomb Body",
      "Switches: Huano Mechanical (20 Million clicks)",
      "Cable: 1.8m Ultra-flexible paracord cable",
    ],
  },
  {
    id: "wireless-silent-ergonomic-mouse",
    name: "Globsoft Stealth Silent Dual-Mode Wireless Mouse",
    category: "Mouse",
    price: 1499,
    compare_at_price: 1999,
    badge: "Office & Devs",
    is_customizable: false,
    rating: 4.7,
    reviews_count: 47,
    stock: 28,
    in_stock: true,
    image: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80",
    description: "Whisper-quiet clicks and seamless productivity. Connects across 3 devices via Bluetooth 5.2 and 2.4GHz USB. Ergonomic contour thumb-rest prevents wrist fatigue.",
    specs: [
      "Connectivity: Bluetooth 5.2 + 2.4GHz Wireless USB",
      "Noise: 90% Noise Reduction Silent Micro-switches",
      "Battery: Built-in 500mAh USB-C Rechargeable (up to 45 days)",
      "DPI: 1000 / 1600 / 2400 / 3200 DPI",
    ],
  },
  {
    id: "rgb-mechanical-keyboard-75",
    name: "Globsoft CyberForge 75% Mechanical Keyboard",
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
    description: "Compact 75% mechanical keyboard designed for maximum desk space and ergonomic posture. Hot-swappable 3/5-pin sockets, south-facing RGB, and PBT double-shot keycaps.",
    specs: [
      "Layout: 75% Compact (82 Keys + Multi-function Volume Knob)",
      "Switches: Pre-lubed Linear Gateron Yellow switches",
      "Backlighting: South-Facing Per-Key 16.8M RGB",
      "Keycaps: Premium Cherry-Profile PBT Double-Shot",
    ],
  },
];

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(HOMEPAGE_FEATURED_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState({});

  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");

  useEffect(() => {
    let isMounted = true;
    fetch(`${adminPortalUrl}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Take top 4 products
          setProducts(data.slice(0, 4));
        }
      })
      .catch(() => {
        // Fallback already pre-loaded
      });

    return () => {
      isMounted = false;
    };
  }, [adminPortalUrl]);

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
      setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
      }, 1800);
    }
  };

  return (
    <Section className="overflow-hidden" id="products">
      <div className="container relative z-2">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-color-1/10 border border-color-1/30 text-color-1 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-color-1 animate-pulse"></span>
            Hardware Lab &amp; Custom Store
          </div>
          <Heading
            tag="Battle-Station Physical Gear"
            title="Custom Mouse Pads, Mouse &amp; Keyboards"
          />
          <p className="body-2 text-n-3 -mt-6">
            Bespoke custom desk mats, esports-grade optical mouse, and hot-swappable mechanical keyboards. Delivered to your doorstep across Nepal with 100% Cash on Delivery (COD).
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => {
            const isAdded = Boolean(addedItemIds[product.id]);
            const discountPct = product.compare_at_price
              ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onClick={() => handleOpenProduct(product)}
                className="group relative rounded-2xl bg-n-7 border border-n-6 overflow-hidden hover:border-color-1/50 transition-all duration-300 hover:shadow-xl hover:shadow-color-1/10 flex flex-col cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative aspect-[4/3] overflow-hidden bg-n-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 via-transparent to-transparent"></div>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-color-1/90 backdrop-blur-md text-n-8 text-[11px] font-bold tracking-wide shadow-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Discount percentage tag */}
                  {discountPct > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-color-4 text-n-8 text-[10px] font-black uppercase">
                      -{discountPct}% OFF
                    </span>
                  )}

                  {/* COD Tag */}
                  <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-n-8/90 border border-n-6 text-color-2 text-[10px] font-semibold flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    COD Available
                  </span>
                </div>

                {/* Product Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs text-n-4 mb-1.5">
                    <span className="uppercase tracking-wider font-semibold text-color-1 text-[11px]">
                      {product.category === "Mice" ? "Mouse" : product.category}
                    </span>
                    <span className="flex items-center gap-1 text-color-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <strong className="text-n-2 text-xs font-semibold">{product.rating}</strong>
                      <span className="text-n-4 text-[10px]">({product.reviews_count})</span>
                    </span>
                  </div>

                  {/* Product Title */}
                  <h4 className="text-sm font-bold text-n-1 line-clamp-2 mb-2 group-hover:text-color-1 transition-colors leading-snug">
                    {product.name}
                  </h4>

                  {/* Short excerpt */}
                  <p className="text-xs text-n-4 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {product.description}
                  </p>

                  {/* Price & CTA Button */}
                  <div className="pt-3 border-t border-n-6/60 flex items-center justify-between mt-auto">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-n-1">रु {product.price.toLocaleString()}</span>
                        {product.compare_at_price && (
                          <span className="text-xs text-n-4 line-through">
                            रु {product.compare_at_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-color-4 block font-medium">Cash on Delivery</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isAdded
                          ? "bg-color-4 text-n-8 shadow-md shadow-color-4/30"
                          : product.is_customizable
                          ? "bg-color-1/15 border border-color-1/40 text-color-1 hover:bg-color-1 hover:text-n-8"
                          : "bg-n-6 text-n-1 hover:bg-color-1 hover:text-n-8 hover:border-color-1 border border-transparent"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Added!</span>
                        </>
                      ) : product.is_customizable ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span>Customize</span>
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner & CTA to Full Shop */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-n-7 via-n-8 to-n-7 border border-n-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-color-1/10 border border-color-1/30 flex items-center justify-center text-color-1 flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-n-1 mb-1">
                Looking for Custom Artwork, Gaming Mouse or Mechanical Keyboards?
              </h4>
              <p className="text-xs text-n-3">
                Upload your own artwork or game logo for custom desk mats. Doorstep Cash on Delivery anywhere in Nepal.
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            className="w-full md:w-auto py-3 px-7 rounded-xl bg-conic-gradient text-n-8 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-color-1/25"
          >
            <span>Explore Full Shop (All Products)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Product Detail / Customizer Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </Section>
  );
};

export default FeaturedProducts;
