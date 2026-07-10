import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read query params
  const q = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");

  // Local input value (for instant typing feedback)
  const [inputValue, setInputValue] = useState(q);
  const debounceTimer = useRef(null);

  // Sync input when URL changes externally
  useEffect(() => {
    setInputValue(q);
  }, [q]);

  // Debounced search – update URL after user stops typing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (value.trim() === "") {
        searchParams.delete("q");
      } else {
        searchParams.set("q", value);
      }
      setSearchParams(searchParams);
      debounceTimer.current = null;
    }, 500);
  };

  // Fetch products based on search and/or sort
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url;
        if (q.trim() !== "") {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`;
        } else {
          url = "https://dummyjson.com/products";
          if (sortBy && order) {
            url += `?sortBy=${sortBy}&order=${order}`;
          }
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q, sortBy, order]);

  // Show full‑page loader only on initial load (no search, no sort)
  if (loading && !q && !sortBy && !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading products...</div>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Search Bar with inline loading spinner */}
      <div className="mb-4 sm:mb-6 flex justify-center relative">
        <input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={inputValue}
          onChange={handleSearchChange}
          className="w-full max-w-2xl px-4 py-2.5 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
        />
        {loading && q.trim() !== "" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Heading - responsive flex wrap */}
      <div className="flex flex-wrap items-baseline gap-2 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {q ? `Results for "${q}"` : "All Products"}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({products.length} products)
          </span>
        </h1>
        {sortBy && order && !q && (
          <span className="text-xs sm:text-sm font-normal text-gray-500">
            (sorted by {sortBy} – {order})
          </span>
        )}
      </div>

      {/* No results message */}
      {products.length === 0 && q && (
        <div className="text-center py-12 text-gray-500 text-xl">
          No products found for "{q}". Try a different search term.
        </div>
      )}

      {/* Product grid – responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-40 sm:h-48 object-contain bg-gray-100 p-4"
            />

            {/* Details */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                {product.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-lg sm:text-xl font-bold text-indigo-600">
                  ${product.price}
                </span>
                <span className="flex items-center text-xs sm:text-sm text-gray-600">
                  ⭐ {product.rating} ({product.reviews?.length || 0})
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>
                  <span className="font-medium">Brand:</span>{" "}
                  {product.brand || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </p>
                <p>
                  <span className="font-medium">Stock:</span> {product.stock} (
                  {product.availabilityStatus})
                </p>
                <p>
                  <span className="font-medium">Discount:</span>{" "}
                  {product.discountPercentage}%
                </p>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{product.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {product.images && product.images.length > 1 && (
                <div className="flex gap-1 mt-3 overflow-x-auto">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded border border-gray-200"
                    />
                  ))}
                  {product.images.length > 4 && (
                    <span className="text-xs text-gray-400 self-center">
                      +{product.images.length - 4}
                    </span>
                  )}
                </div>
              )}

              <Link
                to={`/product/${product.id}`}
                className="mt-4 text-center bg-indigo-600 text-white py-1.5 sm:py-2 rounded-md hover:bg-indigo-700 transition duration-200 text-sm sm:text-base"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
