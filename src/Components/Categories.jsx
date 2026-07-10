import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading categories...</div>
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
      {/* Header – stacks on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Product Categories
        </h1>
        <Link
          to="/categoriesList"
          className="bg-indigo-600 text-white px-4 sm:px-5 py-2 rounded-md hover:bg-indigo-700 transition duration-200 text-sm sm:text-base"
        >
          View as List
        </Link>
      </div>

      {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 text-center block hover:bg-gray-50"
          >
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              {category.name}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-600 mt-1">
              View Products →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;