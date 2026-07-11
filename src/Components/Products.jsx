import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [totalProducts, setTotalProducts] = useState(0);

  const q = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // You can adjust this

  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  // Sync wishlist from other tabs / components
  useEffect(() => {
    const syncWishlist = () => {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        try {
          setWishlist(new Set(JSON.parse(stored)));
        } catch {
          setWishlist(new Set());
        }
      } else {
        setWishlist(new Set());
      }
    };

    window.addEventListener("storage", syncWishlist);
    window.addEventListener("wishlistUpdated", syncWishlist);

    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener("wishlistUpdated", syncWishlist);
    };
  }, []);

  const toggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const stored = localStorage.getItem("wishlist");
    let wishlistArray = stored ? JSON.parse(stored) : [];
    const index = wishlistArray.indexOf(productId);

    if (index !== -1) {
      wishlistArray.splice(index, 1);
    } else {
      wishlistArray.push(productId);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
    setWishlist(new Set(wishlistArray));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // Fetch products with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * itemsPerPage;
        let url;
        if (q.trim() !== "") {
          // Search API with pagination
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${itemsPerPage}&skip=${skip}`;
        } else {
          // All products with pagination + sorting
          url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${skip}`;
          if (sortBy && order) {
            url += `&sortBy=${sortBy}&order=${order}`;
          }
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
        setTotalProducts(data.total);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q, sortBy, order, currentPage, itemsPerPage]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [q, sortBy, order]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
      <div className="flex flex-wrap items-baseline gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          {q ? `Results for "${q}"` : "All Products"}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({totalProducts} products)
          </span>
        </h1>
        {sortBy && order && (
          <span className="text-xs sm:text-sm font-normal text-gray-500">
            (sorted by {sortBy} – {order})
          </span>
        )}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-xl">
          {q ? `No products found for "${q}". Try a different search term.` : "No products available."}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {products.map((product) => {
          const isInWishlist = wishlist.has(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative bg-gray-100 aspect-[4/3] flex items-center justify-center p-2 sm:p-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-contain max-h-36 xs:max-h-44 sm:max-h-52"
                />
                <button
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-400"
                    }`}
                    viewBox="0 0 24 24"
                    fill={isInWishlist ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-0.5 sm:mt-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <span className="text-base sm:text-lg font-bold text-indigo-600">
                    ${product.price}
                  </span>
                  <span className="flex items-center text-xs sm:text-sm text-gray-600">
                    ⭐ {product.rating} ({product.reviews?.length || 0})
                  </span>
                </div>

                <div className="mt-2 sm:mt-3 text-xs text-gray-500 space-y-0.5 sm:space-y-1">
                  <p><span className="font-medium">Brand:</span> {product.brand || "N/A"}</p>
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Stock:</span> {product.stock} ({product.availabilityStatus})</p>
                  <p><span className="font-medium">Discount:</span> {product.discountPercentage}%</p>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">#{tag}</span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-[10px] sm:text-xs text-gray-400">+{product.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {product.images && product.images.length > 1 && (
                  <div className="flex gap-1 mt-2 overflow-x-auto">
                    {product.images.slice(0, 4).map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded border border-gray-200 flex-shrink-0" />
                    ))}
                    {product.images.length > 4 && (
                      <span className="text-[10px] sm:text-xs text-gray-400 self-center">+{product.images.length - 4}</span>
                    )}
                  </div>
                )}

                <Link
                  to={`/product/${product.id}`}
                  className="mt-3 sm:mt-4 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 sm:py-2 rounded-md transition duration-200 text-xs sm:text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-10">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Previous
          </button>

          <div className="flex flex-wrap gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-md text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;