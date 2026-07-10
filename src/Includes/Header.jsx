import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart count
  const loadCartCount = () => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const items = JSON.parse(stored);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
    const handleStorage = (e) => {
      if (e.key === "cart") loadCartCount();
    };
    window.addEventListener("storage", handleStorage);
    const handleCartUpdate = () => loadCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
    setIsSortOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo – Left */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 text-xl sm:text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition shrink-0"
            onClick={closeAll}
          >
            <span className="text-2xl sm:text-3xl">🛒</span>
            <span className="hidden xs:inline">ShopZone</span>
          </Link>

          {/* Right Side: Products Dropdown + Login + Cart */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            {/* Products Dropdown (desktop) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span>Products</span>
              </button>

              {isProductsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeAll}
                  >
                    📋 All Products
                  </Link>
                  <Link
                    to="/product/1"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeAll}
                  >
                    🔍 Single Product
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeAll}
                  >
                    📂 Categories (Grid)
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSortOpen(!isSortOpen);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span>⬆️⬇️ Sort Products</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isSortOpen && (
                      <div className="pl-4">
                        <Link
                          to="/products?sortBy=price&order=asc"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeAll}
                        >
                          💰 By Price (Low to High)
                        </Link>
                        <Link
                          to="/products?sortBy=price&order=desc"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeAll}
                        >
                          💰 By Price (High to Low)
                        </Link>
                      </div>
                    )}
                  </div>
                  <hr className="my-1 border-gray-200" />
                  <Link
                    to="/add-product"
                    className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                    onClick={closeAll}
                  >
                    ➕ Add Product
                  </Link>
                  <Link
                    to="/update-product"
                    className="block px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                    onClick={closeAll}
                  >
                    ✏️ Update Product
                  </Link>
                  <Link
                    to="/delete-product"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={closeAll}
                  >
                    🗑️ Delete Product
                  </Link>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={closeAll}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Login
            </Link>

            {/* Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={closeAll}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger – visible on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu with smooth transition */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 border-t border-gray-200">
            {/* Mobile Login */}
            <Link
              to="/login"
              className="block mt-3 px-4 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg text-center hover:bg-indigo-50 transition-colors"
              onClick={closeAll}
            >
              Login
            </Link>

            {/* Mobile Products Dropdown */}
            <div className="mt-2">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>Products</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProductsOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isProductsOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-indigo-200 pl-3">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={closeAll}
                  >
                    📋 All Products
                  </Link>
                  <Link
                    to="/product/1"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={closeAll}
                  >
                    🔍 Single Product
                  </Link>
                  <hr className="border-gray-200" />
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={closeAll}
                  >
                    📂 Categories
                  </Link>
                  <hr className="border-gray-200" />
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <span>⬆️⬇️ Sort</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isSortOpen && (
                    <div className="ml-4 space-y-1">
                      <Link
                        to="/products?sortBy=price&order=asc"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={closeAll}
                      >
                        💰 Low to High
                      </Link>
                      <Link
                        to="/products?sortBy=price&order=desc"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={closeAll}
                      >
                        💰 High to Low
                      </Link>
                    </div>
                  )}
                  <hr className="border-gray-200" />
                  <Link
                    to="/add-product"
                    className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 rounded-lg"
                    onClick={closeAll}
                  >
                    ➕ Add Product
                  </Link>
                  <Link
                    to="/update-product"
                    className="block px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 rounded-lg"
                    onClick={closeAll}
                  >
                    ✏️ Update Product
                  </Link>
                  <Link
                    to="/delete-product"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                    onClick={closeAll}
                  >
                    🗑️ Delete Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;