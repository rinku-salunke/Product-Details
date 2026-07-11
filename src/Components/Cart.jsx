import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

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
    window.dispatchEvent(new Event("cartUpdated"));
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

  // ========== EMPTY CART STATE ==========
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm font-medium">
          <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">BAG</span>
          <span className="text-gray-400">—</span>
          <span className="text-gray-400">ADDRESS</span>
          <span className="text-gray-400">—</span>
          <span className="text-gray-400">PAYMENT</span>
        </div>

        {/* Empty Bag Content */}
        <div className="text-center py-8 sm:py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
            Hey, it feels so light!
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            There is nothing in your bag. Let's add some items.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/wishlist"
              className="w-full sm:w-auto px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-md transition text-sm"
            >
              ADD ITEMS FROM WISHLIST
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition text-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A10 10 0 0010 20a10 10 0 0010-10H2.166z" clipRule="evenodd" />
            </svg>
            <span>100% SECURE</span>
          </div>
        </div>
      </div>
    );
  }

  // ========== NON-EMPTY CART ==========
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 text-xs sm:text-sm font-medium">
        <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">BAG</span>
        <span className="text-gray-400">—</span>
        <span className="text-gray-400">ADDRESS</span>
        <span className="text-gray-400">—</span>
        <span className="text-gray-400">PAYMENT</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Your Bag ({cartItems.length} items)
          </h1>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden p-2">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 w-full sm:w-auto">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity controls - responsive row */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold transition"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 text-xs sm:text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end sm:justify-center">
                  <span className="text-sm text-gray-500 sm:hidden">Total:</span>
                  <span className="text-base sm:text-lg font-bold text-indigo-600 whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="mt-4 text-sm text-red-500 hover:text-red-700 transition"
          >
            Clear Bag
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 w-full bg-gray-50 rounded-lg p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-3 mt-3 font-bold flex justify-between text-base">
              <span>Total</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;