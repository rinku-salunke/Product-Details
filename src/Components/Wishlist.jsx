import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  // Load wishlist and products
  useEffect(() => {
    const loadWishlist = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      const stored = localStorage.getItem("wishlist");
      let ids = [];
      if (stored) {
        try {
          ids = JSON.parse(stored);
          setWishlistIds(ids);
        } catch {
          ids = [];
          setWishlistIds([]);
        }
      } else {
        setWishlistIds([]);
      }

      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const productPromises = ids.map((id) =>
          fetch(`https://dummyjson.com/products/${id}`).then((res) =>
            res.ok ? res.json() : null,
          ),
        );
        const results = await Promise.all(productPromises);
        const validProducts = results.filter((p) => p !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    const storedWishlist = localStorage.getItem("wishlist");
    let wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(updatedWishlist);

    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const openSizeModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setShowSizeModal(true);
  };

  const closeSizeModal = () => {
    setShowSizeModal(false);
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const product = selectedProduct;

    const storedCart = localStorage.getItem("cart");
    let cart = storedCart ? JSON.parse(storedCart) : [];
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize,
    );
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        size: selectedSize,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    removeFromWishlist(product.id);

    closeSizeModal();
    alert(`${product.title} (Size: ${selectedSize}) moved to bag!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // CASE 1: Not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            PLEASE LOG IN
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Login to view items in your wishlist.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition w-full sm:w-auto"
          >
            LOGIN
          </Link>
        </div>
      </div>
    );
  }

  // CASE 2: Empty wishlist
  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            YOUR WISHLIST IS EMPTY
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Add items that you like to your wishlist. Review them anytime and
            easily move them to the bag.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition w-full sm:w-auto"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  // CASE 3: Has items
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        My Wishlist {products.length} item{products.length > 1 ? "s" : ""}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col relative group"
          >
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:shadow-md transition text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Remove from wishlist"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative bg-gray-100 p-4 aspect-square flex items-center justify-center">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-contain max-h-48 sm:max-h-56"
              />
            </div>

            <div className="p-3 sm:p-4 flex-1 flex flex-col">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                {product.title}
              </h3>

              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mt-2">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      ₹
                      {Math.round(
                        product.price / (1 - product.discountPercentage / 100),
                      )}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-green-600">
                      ({Math.round(product.discountPercentage)}% OFF)
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() => openSizeModal(product)}
                className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200 text-sm sm:text-base"
              >
                MOVE TO BAG
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Size Modal */}
      {showSizeModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 sm:p-6 animate-scale-up">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
              Select Size
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-1">
              {selectedProduct.title}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-3 sm:px-4 py-2 border rounded-md text-sm font-medium transition ${
                    selectedSize === size
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-300 hover:border-indigo-300 text-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToBag}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition text-sm sm:text-base"
              >
                Done
              </button>
              <button
                onClick={closeSizeModal}
                className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Wishlist;