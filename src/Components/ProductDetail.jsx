// Components/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [id]);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-block mb-4 sm:mb-6 text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
      >
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Main Image */}
          <div className="md:w-1/2 bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
              <span className="font-medium">Brand:</span>{" "}
              {product.brand || "N/A"}
              <span className="hidden sm:inline mx-1">|</span>
              <span className="font-medium ml-0 sm:ml-2">Category:</span>{" "}
              {product.category}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                ${product.price}
              </span>
              {product.discountPercentage > 0 && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-sm">
              <span className="flex items-center">
                ⭐ {product.rating} ({product.reviews?.length || 0} reviews)
              </span>
              <span className="text-gray-600">
                Stock: {product.stock} ({product.availabilityStatus})
              </span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-4 space-y-2 text-xs sm:text-sm">
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

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {product.images && product.images.length > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              More Images
            </h3>
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;