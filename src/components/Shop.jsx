// src/components/Shop.jsx
import { useState, useEffect, useMemo } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { useCart } from "../context/CartContext";
import ProductDetailModal from "./ProductDetailModal";

const CATEGORIES = ["All Gear", "Mouse Pads", "Mouse", "Keyboards", "Accessories"];

// Fallback initial products if API takes time or offline
const FALLBACK_PRODUCTS = [
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
        const catLower = (p.category || "").toLowerCase();
        const activeLower = activeCategory.toLowerCase();
        const matchesCategory =
          activeCategory === "All Gear" ||
          catLower === activeLower ||
          (activeLower === "mouse" && (catLower === "mice" || catLower === "mouse"));

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
            Explore bespoke custom mouse pads, tournament-grade mouse, hot-swappable mechanical keyboards, and battle-station accessories. Pay safely with cash on doorstep delivery.
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
