import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function CategoryProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/category/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Error</h2>
          <p>{error}</p>
          <Link
            to="/categories"
            className="text-indigo-600 hover:underline mt-4 inline-block"
          >
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header with back link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
          {slug.replace(/-/g, " ")} Products
          <span className="text-sm font-normal text-gray-500 ml-3">
            ({products.length} products)
          </span>
        </h1>
        <Link
          to="/categories"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
        >
          ← Back to Categories
        </Link>
      </div>

      {/* Product grid – responsive */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-xl">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-contain bg-gray-100 p-4"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-indigo-600">
                    ${product.price}
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    ⭐ {product.rating} ({product.reviews?.length || 0})
                  </span>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="mt-4 text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryProducts;