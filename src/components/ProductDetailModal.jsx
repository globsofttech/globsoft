// src/components/ProductDetailModal.jsx
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart, openCheckout } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSurface, setSelectedSurface] = useState("");
  const [selectedStitching, setSelectedStitching] = useState("");
  const [customDesignUrl, setCustomDesignUrl] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      const sizes = product.custom_options?.sizes || ["900 x 400 x 4mm (XXL Extended)", "800 x 300 x 3mm"];
      const surfaces = product.custom_options?.surfaces || ["Speed (Silky Smooth)", "Control (Textured)"];
      const stitchings = product.custom_options?.stitching || ["Edge-to-Edge Print", "Black Stitched Border"];

      setSelectedSize(sizes[0] || "");
      setSelectedSurface(surfaces[0] || "");
      setSelectedStitching(stitchings[0] || "");
      setCustomDesignUrl("");
      setCustomNote("");
      setAddedAnimation(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = (instantCheckout = false) => {
    const customOptions = product.is_customizable
      ? {
          size: selectedSize,
          surface: selectedSurface,
          stitching: selectedStitching,
          custom_design_url: customDesignUrl.trim(),
          custom_note: customNote.trim(),
        }
      : {};

    addToCart(product, quantity, customOptions);

    if (instantCheckout) {
      onClose();
      openCheckout();
    } else {
      setAddedAnimation(true);
      setTimeout(() => {
        setAddedAnimation(false);
      }, 1800);
    }
  };

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
      <div className="relative w-full max-w-3xl bg-n-8 border border-n-6 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-n-7/80 border border-n-6 flex items-center justify-center text-n-3 hover:text-n-1 transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-n-7/50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-n-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 md:h-96 object-contain rounded-xl drop-shadow-2xl"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80";
              }}
            />

            {discountPercent && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-color-3 text-n-1 font-bold text-xs uppercase tracking-wide shadow-lg">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Right: Product Details & Customization */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-color-1/20 text-color-1 border border-color-1/30">
                  {product.category}
                </span>
                {product.is_customizable && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-color-6/20 text-color-6 border border-color-6/30 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Custom Print Available
                  </span>
                )}
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-color-2/20 text-color-2 border border-color-2/30">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold font-grotesk text-n-1 mb-2 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-color-2 text-xs">
                  {"★".repeat(Math.round(product.rating || 5))}
                  {"☆".repeat(5 - Math.round(product.rating || 5))}
                </div>
                <span className="text-xs text-n-4">
                  ({product.reviews_count || 45} customer reviews)
                </span>
                <span className="text-n-5">•</span>
                <span className="text-xs text-color-4 font-semibold">
                  ✓ Cash on Delivery Eligible
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5 p-3 rounded-xl bg-n-7/50 border border-n-6">
                <span className="text-2xl font-bold text-color-4">
                  रु {Number(product.price).toLocaleString()}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-n-4 line-through">
                    रु {Number(product.compare_at_price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-n-3 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Customization Options (For Custom Mouse Pads) */}
              {product.is_customizable && (
                <div className="space-y-4 mb-5 p-4 rounded-xl bg-n-7 border border-color-1/30">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-color-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Customization Options
                  </div>

                  {/* Size selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-n-2 mb-1.5">
                      Select Dimensions &amp; Size
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(product.custom_options?.sizes || [
                        "900 x 400 x 4mm (XXL Extended)",
                        "800 x 300 x 3mm (Standard)",
                        "450 x 400 x 4mm (Esports)",
                      ]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`p-2 rounded-lg text-left text-xs transition-all border ${
                            selectedSize === sz
                              ? "bg-color-1/25 border-color-1 text-color-1 font-semibold"
                              : "bg-n-8/80 border-n-6 text-n-3 hover:text-n-1"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Surface selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-n-2 mb-1.5">
                      Surface Texture
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(product.custom_options?.surfaces || ["Speed (Silky Smooth)", "Control (Textured)"]).map(
                        (surf) => (
                          <button
                            key={surf}
                            type="button"
                            onClick={() => setSelectedSurface(surf)}
                            className={`p-2 rounded-lg text-center text-xs transition-all border ${
                              selectedSurface === surf
                                ? "bg-color-1/25 border-color-1 text-color-1 font-semibold"
                                : "bg-n-8/80 border-n-6 text-n-3 hover:text-n-1"
                            }`}
                          >
                            {surf}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Custom Artwork URL */}
                  <div>
                    <label className="block text-[11px] font-semibold text-n-2 mb-1">
                      Artwork / Drive Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={customDesignUrl}
                      onChange={(e) => setCustomDesignUrl(e.target.value)}
                      placeholder="Paste Google Drive, Pinterest, or Image link"
                      className="w-full bg-n-8 border border-n-6 rounded-lg px-3 py-1.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                    />
                  </div>

                  {/* Custom Print Instructions */}
                  <div>
                    <label className="block text-[11px] font-semibold text-n-2 mb-1">
                      Custom Print Notes / Gamer Tag
                    </label>
                    <textarea
                      rows="2"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g. Print my logo in center or custom anime background"
                      className="w-full bg-n-8 border border-n-6 rounded-lg px-3 py-1.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Specs Bullet Points */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-n-3 mb-2">
                    Key Specifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-n-3">
                    {product.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-color-4 mt-0.5">✓</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-n-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-n-6 rounded-xl bg-n-7 overflow-hidden h-11">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 text-n-3 hover:text-n-1 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold text-n-1 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 text-n-3 hover:text-n-1 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => handleAddToCart(false)}
                  className={`flex-1 h-11 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? "bg-color-4 text-n-8 border-color-4"
                      : "bg-color-1/20 border-color-1/40 text-color-1 hover:bg-color-1/30"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now with COD */}
              <button
                onClick={() => handleAddToCart(true)}
                className="w-full h-11 rounded-xl bg-conic-gradient text-n-8 font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-color-1/25"
              >
                <span>Buy Now with Cash on Delivery (COD)</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
