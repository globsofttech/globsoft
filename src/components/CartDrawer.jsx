// src/components/CartDrawer.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

const CartDrawer = () => {
  const {
    cart,
    totalCount,
    subtotal,
    discountAmount,
    totalAmount,
    deliveryFee,
    deliveryZone,
    setDeliveryZone,
    customDeliveryFee,
    setCustomDeliveryFee,
    discountInfo,
    discountError,
    isApplyingDiscount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyDiscount,
    removeDiscount,
    openCheckout,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyDiscount(couponInput);
    if (res.success) {
      setCouponInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-n-8 border-l border-n-6 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-n-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-color-1/10 border border-color-1/30 flex items-center justify-center text-color-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div>
                <h3 className="h6 font-grotesk text-n-1">Your Shopping Cart</h3>
                <span className="text-xs text-n-4">{totalCount} item{totalCount !== 1 ? "s" : ""} in cart</span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-lg border border-n-6 flex items-center justify-center text-n-4 hover:text-n-1 hover:border-n-4 transition-colors"
              aria-label="Close cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-n-7 flex items-center justify-center text-n-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-n-2 mb-1">Your cart is empty</h4>
                <p className="text-xs text-n-4 max-w-xs mx-auto mb-6">
                  Check out our custom desk mats, precision mouse, and hot-swap keyboards!
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-color-1/20 border border-color-1/40 text-color-1 text-xs font-semibold hover:bg-color-1/30 transition-colors"
                >
                  Browse Hardware Store
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="p-3.5 rounded-xl bg-n-7/50 border border-n-6 flex gap-3.5 items-start relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover bg-n-8 border border-n-6 flex-shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=400&q=80";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-n-1 leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cart_item_id)}
                        className="text-n-4 hover:text-color-3 p-1 transition-colors"
                        title="Remove item"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Custom specifications / options badge */}
                    {item.custom_options && (
                      <div className="mt-1.5 space-y-0.5 text-[11px] text-n-3 bg-n-8/60 p-1.5 rounded border border-n-6">
                        {item.custom_options.size && (
                          <div><span className="text-n-4">Size:</span> {item.custom_options.size}</div>
                        )}
                        {item.custom_options.surface && (
                          <div><span className="text-n-4">Surface:</span> {item.custom_options.surface}</div>
                        )}
                        {item.custom_options.custom_note && (
                          <div className="text-color-1 line-clamp-1">
                            <span className="text-n-4">Custom:</span> {item.custom_options.custom_note}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-n-6 rounded-lg bg-n-8 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="px-2.5 py-1 text-n-3 hover:text-n-1 hover:bg-n-7 text-xs font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-n-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="px-2.5 py-1 text-n-3 hover:text-n-1 hover:bg-n-7 text-xs font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-n-1">
                          रु {(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-n-4">
                            रु {item.price.toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-n-6 bg-n-8/95 space-y-4">
              {/* Discount Code Input */}
              <div>
                {discountInfo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-color-4/10 border border-color-4/30 text-color-4 text-xs">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      <span>
                        Promo <strong>{discountInfo.code}</strong> applied (-रु {discountAmount.toLocaleString()})
                      </span>
                    </div>
                    <button
                      onClick={removeDiscount}
                      className="text-xs text-color-3 hover:underline font-semibold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Discount code (e.g. WELCOME10)"
                      className="flex-1 bg-n-7 border border-n-6 rounded-xl px-3.5 py-2 text-xs uppercase text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingDiscount || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-n-6 text-n-1 text-xs font-semibold hover:bg-color-1/20 hover:text-color-1 border border-transparent hover:border-color-1/40 transition-colors disabled:opacity-50"
                    >
                      {isApplyingDiscount ? "Applying..." : "Apply"}
                    </button>
                  </form>
                )}

                {discountError && (
                  <p className="mt-1.5 text-xs text-color-3">{discountError}</p>
                )}
              </div>

              {/* Delivery Zone / Fee Selection */}
              <div className="p-3 rounded-xl bg-n-7/80 border border-n-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-n-2">
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-color-1">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    Delivery Location & Fee
                  </span>
                  <span className="text-color-1 font-bold">
                    + रु {deliveryFee.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("inside_valley")}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex flex-col ${
                      deliveryZone === "inside_valley"
                        ? "bg-color-1/15 border-color-1 text-color-1 font-semibold"
                        : "bg-n-8/60 border-n-6 text-n-3 hover:border-n-5"
                    }`}
                  >
                    <span>Kathmandu Valley</span>
                    <strong className="text-[10px]">रु 100</strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryZone("outside_valley")}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex flex-col ${
                      deliveryZone === "outside_valley"
                        ? "bg-color-1/15 border-color-1 text-color-1 font-semibold"
                        : "bg-n-8/60 border-n-6 text-n-3 hover:border-n-5"
                    }`}
                  >
                    <span>Outside Valley</span>
                    <strong className="text-[10px]">रु 150</strong>
                  </button>
                </div>

                {/* Custom Fee Toggle & Input */}
                <div className="pt-1.5 border-t border-n-6/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDeliveryZone(deliveryZone === "custom" ? "inside_valley" : "custom")}
                      className={`hover:underline flex items-center gap-1.5 ${
                        deliveryZone === "custom" ? "text-color-1 font-bold" : "text-n-4 hover:text-n-2"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full border ${
                        deliveryZone === "custom" ? "border-color-1 bg-color-1" : "border-n-5"
                      }`} />
                      <span>Put custom delivery fee</span>
                    </button>
                    {deliveryZone === "custom" && (
                      <span className="text-[10px] text-color-1 font-semibold">Active</span>
                    )}
                  </div>

                  {deliveryZone === "custom" && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-n-8 border border-color-1/40">
                      <span className="text-[11px] text-n-3">Custom Fee (रु):</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-n-4">रु</span>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={customDeliveryFee}
                          onChange={(e) => setCustomDeliveryFee(Math.max(0, Number(e.target.value) || 0))}
                          className="w-20 bg-n-7 border border-color-1/50 rounded-lg px-2 py-0.5 text-xs text-n-1 font-bold focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-n-3">
                  <span>Subtotal</span>
                  <span>रु {subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-color-4 font-medium">
                    <span>Discount Code Savings</span>
                    <span>- रु {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-n-3">
                  <span className="flex items-center gap-1.5">
                    Shipping & Delivery
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-color-1/15 text-color-1 font-semibold uppercase">
                      COD Delivery
                    </span>
                  </span>
                  <span className="text-n-1 font-medium">
                    रु {deliveryFee.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-n-6 flex justify-between items-baseline text-base font-bold text-n-1">
                  <span>Total Amount (COD)</span>
                  <span className="text-xl text-color-4">रु {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* COD Badge Notice */}
              <div className="p-3 rounded-xl bg-color-2/10 border border-color-2/30 flex items-start gap-2.5 text-xs text-color-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <div>
                  <strong className="block font-semibold">Cash on Delivery (COD) Only</strong>
                  <span className="text-n-3 text-[11px] leading-tight block mt-0.5">
                    No upfront card or online payment required. Pay exact cash to the courier upon delivery at your doorstep.
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={openCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-conic-gradient text-n-8 font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-color-1/20"
              >
                <span>Proceed to COD Checkout</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
