import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://dummyjson.com/products/category-list")
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
      {/* Header with back link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Categories
          <span className="text-sm font-normal text-gray-500 ml-3">
            ({categories.length})
          </span>
        </h1>
        <Link
          to="/categories"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
        >
          ← Back to Grid
        </Link>
      </div>

      {/* Category tags - responsive flex wrap */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/category/${category}`}
            className="bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm capitalize transition duration-200 border border-transparent hover:border-indigo-300"
          >
            {category.replace(/-/g, " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
