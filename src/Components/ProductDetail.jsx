import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  let timeoutId = null;

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const storedCart = localStorage.getItem("cart");
    let cart = storedCart ? JSON.parse(storedCart) : [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setShowNotification(true);
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setShowNotification(false);
    }, 3500);
  };

  const closeNotification = () => {
    setShowNotification(false);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const goToCart = () => {
    closeNotification();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-6 lg:py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-block mb-3 sm:mb-5 text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
      >
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image – smaller max-height on mobile */}
          <div className="md:w-1/2 bg-gray-100 p-2 sm:p-4 lg:p-8 flex items-center justify-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full max-h-[200px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[500px] object-contain"
            />
          </div>

          {/* Info – padding and font sizes adjusted */}
          <div className="md:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap gap-1">
              <span className="font-medium">Brand:</span> {product.brand || "N/A"}
              <span className="hidden sm:inline mx-1">|</span>
              <span className="font-medium ml-0 sm:ml-2">Category:</span> {product.category}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">
                ${product.price}
              </span>
              {product.discountPercentage > 0 && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs sm:text-sm">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center">
                ⭐ {product.rating} ({product.reviews?.length || 0} reviews)
              </span>
              <span className="text-gray-600">
                Stock: {product.stock} ({product.availabilityStatus})
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* Detailed specs – hidden on mobile */}
            <div className="hidden sm:block border-t border-gray-200 pt-3 space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p><span className="font-medium">SKU:</span> {product.sku}</p>
              <p><span className="font-medium">Weight:</span> {product.weight} kg</p>
              <p>
                <span className="font-medium">Dimensions:</span>{" "}
                {product.dimensions?.width} × {product.dimensions?.height} ×{" "}
                {product.dimensions?.depth} cm
              </p>
              <p><span className="font-medium">Warranty:</span> {product.warrantyInformation}</p>
              <p><span className="font-medium">Shipping:</span> {product.shippingInformation}</p>
              <p><span className="font-medium">Return Policy:</span> {product.returnPolicy}</p>
              <p><span className="font-medium">Minimum Order:</span> {product.minimumOrderQuantity}</p>
            </div>

            {/* Tags – hidden on mobile */}
            {product.tags && product.tags.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2 pt-3 border-t border-gray-200">
              <button
                onClick={handleAddToCart}
                className={`w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 text-sm sm:text-base ${
                  isAdded
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isAdded
                  ? "✓ Added to Cart!"
                  : `Add to Cart - $${product.price}`}
              </button>
            </div>
          </div>
        </div>

        {/* More Images – hidden on mobile */}
        {product.images && product.images.length > 1 && (
          <div className="hidden sm:block p-4 sm:p-6 border-t border-gray-200">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-3">
              More Images
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full bg-white rounded-lg shadow-2xl border border-gray-200 animate-slide-up">
          <div className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg font-bold">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Item added to cart
              </p>
              <Link
                to="/cart"
                onClick={closeNotification}
                className="mt-2 w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 no-underline"
              >
                🛒 Go to Cart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <button
              onClick={closeNotification}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ProductDetail;