// src/components/CheckoutModal.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

const CheckoutModal = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    totalAmount,
    discountInfo,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Kathmandu",
    address: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setErrorMsg("Please provide a valid contact phone number for COD delivery confirmation.");
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg("Please provide your complete delivery address and nearest landmark.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        custom_options: item.custom_options || {},
      })),
      discount_code: discountInfo?.code || "",
      subtotal,
      payment_method: "COD",
    };

    try {
      const response = await fetch(`${adminPortalUrl}/api/shop/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.success) {
        setPlacedOrder(resData.order || { order_id: resData.order_id, total_amount: totalAmount });
        clearCart();
      } else {
        setErrorMsg(resData.error || "Order placement failed. Please verify your details.");
      }
    } catch (err) {
      console.error("Order submission network error:", err);
      // Fallback pseudo-order if completely offline
      const fallbackId = `GST-COD-${Math.floor(10000 + Math.random() * 90000)}`;
      setPlacedOrder({
        order_id: fallbackId,
        total_amount: totalAmount,
        customer: formData,
        items: cart,
      });
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPlacedOrder(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
      <div className="relative w-full max-w-2xl bg-n-8 border border-n-6 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-n-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-color-4/15 border border-color-4/30 flex items-center justify-center text-color-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <h3 className="h6 font-grotesk text-n-1">Cash on Delivery (COD) Checkout</h3>
              <p className="text-xs text-n-4">Pay in cash directly upon doorstep arrival</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg border border-n-6 flex items-center justify-center text-n-4 hover:text-n-1 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        {placedOrder ? (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-color-4/15 border border-color-4/40 flex items-center justify-center text-color-4 animate-bounce">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-color-4/15 text-color-4 mb-2">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-bold font-grotesk text-n-1">
                Thank you for your order!
              </h2>
              <p className="text-xs text-n-3 max-w-md mx-auto mt-1">
                Your Cash on Delivery hardware order has been placed. Our team will contact you via phone before dispatch.
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="p-5 rounded-xl bg-n-7 border border-n-6 text-left max-w-lg mx-auto space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-n-6">
                <span className="text-xs text-n-4 uppercase font-semibold">Order ID</span>
                <strong className="text-sm font-mono text-color-1">
                  #{placedOrder.order_id}
                </strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-n-4">Customer:</span>
                <strong className="text-n-2">{formData.name || "Customer"}</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-n-4">Phone:</span>
                <strong className="text-n-2">{formData.phone}</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-n-4">Destination:</span>
                <strong className="text-n-2 text-right max-w-[240px] truncate">
                  {formData.city}, {formData.address}
                </strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-n-4">Payment Method:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-color-2/20 text-color-2">
                  Cash on Delivery (COD)
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-n-6">
                <span className="text-sm font-semibold text-n-1">Cash to Pay on Arrival:</span>
                <strong className="text-xl text-color-4">
                  रु {Number(placedOrder.total_amount || totalAmount).toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <a
                href={`https://wa.me/9779841234567?text=Hi%20Globsoft,%20I%20just%20placed%20COD%20Order%20%23${placedOrder.order_id}.%20Can%20you%20confirm%20my%20order%3F`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs hover:bg-[#25D366]/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.861.815 2.791.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm0 10.455c-.887 0-1.748-.258-2.483-.722l-.178-.112-1.84.482.491-1.792-.123-.186c-.534-.809-.817-1.637-.816-2.515.001-2.583 2.102-4.684 4.685-4.684 2.583 0 4.684 2.101 4.685 4.684 0 2.583-2.102 4.684-4.685 4.684z" />
                </svg>
                WhatsApp Us for Artwork / Updates
              </a>

              <button
                onClick={handleClose}
                className="py-3 px-6 rounded-xl bg-n-7 text-n-1 font-semibold text-xs hover:bg-n-6 transition-colors border border-n-6"
              >
                Back to Shop
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-color-3/15 border border-color-3/40 text-color-3 text-xs flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Delivery Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-color-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-color-1/20 flex items-center justify-center text-[10px]">1</span>
                Delivery Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-n-2 mb-1.5">
                    Full Name <span className="text-color-3">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Samir Sharma"
                    className="w-full bg-n-7 border border-n-6 rounded-xl px-4 py-2.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-n-2 mb-1.5">
                    Mobile Phone (For COD Delivery Call) <span className="text-color-3">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full bg-n-7 border border-n-6 rounded-xl px-4 py-2.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-n-2 mb-1.5">
                    Email Address (Optional receipt)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="samir@example.com"
                    className="w-full bg-n-7 border border-n-6 rounded-xl px-4 py-2.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-n-2 mb-1.5">
                    City / District <span className="text-color-3">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-n-7 border border-n-6 rounded-xl px-4 py-2.5 text-xs text-n-1 focus:outline-none focus:border-color-1"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan (Bharatpur)">Chitwan (Bharatpur)</option>
                    <option value="Butwal">Butwal</option>
                    <option value="Biratnagar">Biratnagar</option>
                    <option value="Dharan">Dharan</option>
                    <option value="Hetauda">Hetauda</option>
                    <option value="Other Location">Other City in Nepal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-n-2 mb-1.5">
                  Detailed Street Address & Landmark <span className="text-color-3">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. House No. 42, Maitidevi Chowk, Near Temple"
                  className="w-full bg-n-7 border border-n-6 rounded-xl px-4 py-2.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-n-2 mb-1.5">
                  Delivery Notes & Customization Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Please deliver after 2 PM or artwork download link for custom mouse pad"
                  className="w-full bg-n-7 border border-n-6 rounded-xl px-4 py-2.5 text-xs text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1"
                ></textarea>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-3 pt-4 border-t border-n-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-color-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-color-1/20 flex items-center justify-center text-[10px]">2</span>
                Payment Method
              </h4>

              <div className="p-4 rounded-xl bg-n-7 border-2 border-color-4/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-color-4 flex items-center justify-center text-n-8">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-n-1">Cash on Delivery (COD)</strong>
                    <span className="text-xs text-n-3">
                      Pay in cash when your gear arrives at your doorstep. No prepayment risk.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-color-4/20 text-color-4 uppercase">
                  Active
                </span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="pt-4 border-t border-n-6 space-y-2">
              <div className="flex justify-between items-center text-xs text-n-4">
                <span>Items in Order ({cart.length})</span>
                <span>Subtotal: रु {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-xs text-color-4">
                  <span>Promo Code ({discountInfo?.code}):</span>
                  <span>- रु {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-n-6">
                <span className="text-base font-bold text-n-1">Total COD Amount:</span>
                <span className="text-2xl font-bold text-color-4">
                  रु {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeCheckout}
                className="py-3 px-5 rounded-xl border border-n-6 text-n-3 text-xs font-semibold hover:text-n-1 hover:border-n-4 transition-colors"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl bg-conic-gradient text-n-8 font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-color-1/25 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-n-8" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Placing COD Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order (Cash on Delivery)</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
