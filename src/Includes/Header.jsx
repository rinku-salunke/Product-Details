import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

  const loadWishlistCount = () => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        const items = JSON.parse(stored);
        setWishlistCount(items.length);
      } catch {
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products/category-list");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    loadCartCount();
    loadWishlistCount();

    const handleStorage = (e) => {
      if (e.key === "cart") loadCartCount();
      if (e.key === "wishlist") loadWishlistCount();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("wishlistUpdated", loadWishlistCount);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("wishlistUpdated", loadWishlistCount);
    };
  }, []);

  const closeAll = () => {
    setIsProductsOpen(false);
    setIsSortOpen(false);
  };

  const formatCategoryName = (category) => {
    return category.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between flex-wrap gap-2 py-2 sm:py-3 lg:py-4">
            {/* Logo and Myntra Label */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-1.5 sm:gap-2 text-xl sm:text-2xl font-bold transition"
                onClick={closeAll}
              >
                <span className="text-2xl sm:text-3xl">✨</span>
                <span className="hidden xs:inline bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-pink-700">
                  TrendBazzar
                </span>
              </Link>
              <span className="hidden sm:inline-flex items-center font-bold cursor-default">
                <span className="text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent hover:from-pink-600 hover:to-purple-700 transition">
                  Myntra
                </span>
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-2 hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right side: Profile, Wishlist, Bag */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-wrap">
              <Link
                to="/profile"
                className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors text-xs sm:text-sm font-medium"
                onClick={closeAll}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center gap-1 text-gray-700 hover:text-red-500 transition-colors text-xs sm:text-sm font-medium relative"
                onClick={closeAll}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-3 bg-pink-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center ring-2 ring-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors text-xs sm:text-sm font-medium relative"
                onClick={closeAll}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center ring-2 ring-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Category Navigation – now links to Products with category param */}
          <div className="flex items-center gap-4 lg:gap-6 py-2 text-sm font-medium text-gray-700 border-t border-gray-100 overflow-x-auto">
            {categoriesLoading ? (
              <span className="text-gray-400">Loading categories...</span>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category}
                  to={`/?category=${category}`}  // ← updated link
                  className="hover:text-indigo-600 font-bold whitespace-nowrap transition-colors uppercase text-xs lg:text-sm"
                  onClick={closeAll}
                >
                  {formatCategoryName(category)}
                </Link>
              ))
            ) : (
              // Fallback
              <>
                <Link to="/?category=men" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">MEN</Link>
                <Link to="/?category=women" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">WOMEN</Link>
                <Link to="/?category=kids" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">KIDS</Link>
                <Link to="/?category=home" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">HOME</Link>
                <Link to="/?category=beauty" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">BEAUTY</Link>
                <Link to="/?category=genz" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">GENZ</Link>
                <Link to="/?category=studio" className="hover:text-indigo-600 font-bold uppercase text-xs lg:text-sm">STUDIONEW</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;