// Components/Cart.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Recalculate total whenever cartItems change
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  const loadCart = () => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartItems(parsed);
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };

  const saveCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
  };

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {
    if (window.confirm("Remove all items from your cart?")) {
      saveCart([]);
    }
  };

  const applyCoupon = () => {
    // Simple mock: if coupon is "SAVE10" then 10% off, else invalid
    if (couponCode.toUpperCase() === "SAVE10" && !appliedCoupon) {
      setDiscount(total * 0.1);
      setAppliedCoupon(true);
    } else if (appliedCoupon) {
      alert("Coupon already applied.");
    } else {
      alert("Invalid coupon code. Try 'SAVE10'");
    }
  };

  // Calculate final total after discount
  const finalTotal = total - discount;

  // Empty state
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't added any items yet. Start shopping to fill
            your cart!
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">🛒</span>
          Your Cart
        </h1>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base transition-colors"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Grid: items on left, summary on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Item total & remove */}
              <div className="flex items-center gap-4 sm:ml-auto">
                <span className="font-semibold text-gray-800 whitespace-nowrap text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - sticky on desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            {/* Summary rows */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">
                  ${total.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-3">
                <span className="text-gray-800">Total</span>
                <span className="text-xl font-bold text-indigo-600">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Coupon input */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                aria-label="Coupon code"
              />
              <button
                onClick={applyCoupon}
                disabled={appliedCoupon}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  appliedCoupon
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                {appliedCoupon ? "Applied ✓" : "Apply"}
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-green-600 mt-1">
                Coupon "SAVE10" applied – 10% off!
              </p>
            )}

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <Link
                to="/checkout"
                className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center"
              >
                Proceed to Checkout →
              </Link>
              <button
                onClick={clearCart}
                className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Cart;