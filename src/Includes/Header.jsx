import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Close all menus when a link is clicked
  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
    setIsSortOpen(false);
  };

  return (
    <nav className="bg-slate-800 sticky top-0 z-50 shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-2xl font-bold tracking-wide hover:text-sky-400 transition"
          onClick={closeAll}
        >
          🛒 ShopZone
        </Link>

        {/* Hamburger button – visible on small screens */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white block lg:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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

        {/* Navigation – hidden on mobile unless toggled */}
        <div
          className={`w-full lg:w-auto lg:flex lg:items-center lg:gap-6 ${isMenuOpen ? "block" : "hidden"}`}
        >
          {/* Products Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProductsOpen(!isProductsOpen);
                if (isProductsOpen) setIsSortOpen(false);
              }}
              className="text-white text-lg px-3 py-2 rounded-md hover:bg-slate-700 transition duration-200 flex items-center gap-1 w-full lg:w-auto justify-between"
            >
              <span>Products</span>
              <svg
                className={`w-4 h-4 transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
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
              <div className="lg:absolute left-0 mt-2 w-full lg:w-64 bg-white rounded-md shadow-lg z-50 py-1">
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
        </div>
      </div>
    </nav>
  );
}

export default Header;
