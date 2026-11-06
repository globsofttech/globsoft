/* eslint-disable react-refresh/only-export-components */
// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "globsoft_shop_cart";
const DISCOUNT_STORAGE_KEY = "globsoft_shop_discount";
const DELIVERY_ZONE_KEY = "globsoft_shop_delivery_zone";
const CUSTOM_FEE_KEY = "globsoft_shop_custom_fee";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountInfo, setDiscountInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(DISCOUNT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [deliveryZone, setDeliveryZone] = useState(() => {
    try {
      return localStorage.getItem(DELIVERY_ZONE_KEY) || "inside_valley";
    } catch {
      return "inside_valley";
    }
  });

  const [customDeliveryFee, setCustomDeliveryFee] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_FEE_KEY);
      return saved !== null ? Math.max(0, Number(saved)) : 100;
    } catch {
      return 100;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

  // Sync discount to localStorage
  useEffect(() => {
    try {
      if (discountInfo) {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(discountInfo));
      } else {
        localStorage.removeItem(DISCOUNT_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Could not save discount to localStorage", e);
    }
  }, [discountInfo]);

  // Sync delivery fee & zone preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DELIVERY_ZONE_KEY, deliveryZone);
      localStorage.setItem(CUSTOM_FEE_KEY, String(customDeliveryFee));
    } catch (e) {
      console.warn("Could not save delivery preferences to localStorage", e);
    }
  }, [deliveryZone, customDeliveryFee]);

  // Derived: Total items count
  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [cart]);

  // Derived: Subtotal
  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
  }, [cart]);

  // Derived: Calculate discount amount dynamically
  const discountAmount = useMemo(() => {
    if (!discountInfo || subtotal <= 0) return 0;
    const { type, value, min_order } = discountInfo;
    if (min_order && subtotal < Number(min_order)) return 0;

    if (type === "percentage") {
      return Math.round((subtotal * (Number(value) / 100)) * 100) / 100;
    }
    return Math.min(Number(value) || 0, subtotal);
  }, [discountInfo, subtotal]);

  // Derived: Delivery fee calculated from zone / custom fee
  const deliveryFee = useMemo(() => {
    if (subtotal <= 0) return 0;
    if (deliveryZone === "free") return 0;
    if (deliveryZone === "outside_valley") return 150;
    if (deliveryZone === "custom") return Math.max(0, Number(customDeliveryFee) || 0);
    // inside_valley standard
    return 100;
  }, [subtotal, deliveryZone, customDeliveryFee]);

  // Derived: Final COD total including subtotal, discount, and delivery fee
  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + (subtotal > 0 ? deliveryFee : 0));
  }, [subtotal, discountAmount, deliveryFee]);

  const setDeliveryFeeManual = useCallback((fee) => {
    setDeliveryZone("custom");
    setCustomDeliveryFee(Math.max(0, Number(fee) || 0));
  }, []);

  // Add Item to Cart
  const addToCart = useCallback((product, quantity = 1, customOptions = {}) => {
    setCart((prev) => {
      // Create a signature based on product ID and customization options
      const optSignature = JSON.stringify(customOptions || {});
      const existingIdx = prev.findIndex(
        (item) => item.id === product.id && JSON.stringify(item.custom_options || {}) === optSignature
      );

      const qtyToAdd = Math.max(1, Number(quantity) || 1);

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qtyToAdd,
        };
        return updated;
      }

      const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      return [
        ...prev,
        {
          cart_item_id: cartItemId,
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
          image: product.image,
          quantity: qtyToAdd,
          custom_options: customOptions,
          is_customizable: Boolean(product.is_customizable),
        },
      ];
    });

    setIsCartOpen(true);
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((cartItemId, newQty) => {
    const qty = Number(newQty);
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cart_item_id === cartItemId ? { ...item, quantity: qty } : item))
    );
  }, []);

  // Remove single item
  const removeFromCart = useCallback((cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountInfo(null);
    setDiscountError("");
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(DISCOUNT_STORAGE_KEY);
  }, []);

  // Apply discount code via server API
  const applyDiscount = useCallback(
    async (codeStr) => {
      const code = String(codeStr || "").trim().toUpperCase();
      setDiscountError("");
      if (!code) {
        setDiscountError("Please enter a discount code.");
        return { success: false, error: "Please enter a discount code." };
      }

      if (subtotal <= 0) {
        setDiscountError("Cart is empty. Add items first.");
        return { success: false, error: "Cart is empty. Add items first." };
      }

      setIsApplyingDiscount(true);
      try {
        const response = await fetch(`${adminPortalUrl}/api/shop/discount/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ code, subtotal }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.valid) {
          const info = {
            code: data.code,
            type: data.type,
            value: data.value,
            discount_amount: data.discount_amount,
            message: data.message,
          };
          setDiscountInfo(info);
          return { success: true, discount: info };
        } else {
          const errMsg = data.error || "Invalid or expired discount code.";
          setDiscountError(errMsg);
          return { success: false, error: errMsg };
        }
      } catch (err) {
        console.error("Discount validation error:", err);
        // Fallback for default codes if offline
        if (code === "WELCOME10") {
          const amt = Math.round(subtotal * 0.1 * 100) / 100;
          const info = { code: "WELCOME10", type: "percentage", value: 10, discount_amount: amt };
          setDiscountInfo(info);
          return { success: true, discount: info };
        }
        const errMsg = "Unable to validate coupon. Please try again.";
        setDiscountError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setIsApplyingDiscount(false);
      }
    },
    [adminPortalUrl, subtotal]
  );

  // Remove discount
  const removeDiscount = useCallback(() => {
    setDiscountInfo(null);
    setDiscountError("");
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const value = {
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
    setDeliveryFeeManual,
    discountInfo,
    discountError,
    isApplyingDiscount,
    isCartOpen,
    isCheckoutOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    openCart,
    closeCart,
    toggleCart,
    openCheckout,
    closeCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
