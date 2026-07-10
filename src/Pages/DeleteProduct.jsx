import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch all products
  useEffect(() => {
    fetch("https://dummyjson.com/products")
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
  }, []);

  // Handle delete
  const handleDelete = (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    setDeletingId(productId);
    setDeleteSuccess(null);
    setDeleteError(null);

    fetch(`https://dummyjson.com/products/${productId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        return res.json();
      })
      .then((data) => {
        setProducts(products.filter((p) => p.id !== productId));
        setDeleteSuccess(`✅ "${productTitle}" was deleted successfully!`);
        console.log("Product deleted (simulated):", data);
        setDeletingId(null);
      })
      .catch((err) => {
        setDeleteError(`❌ Error: ${err.message}`);
        setDeletingId(null);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Error</h2>
          <p>{error}</p>
          <Link
            to="/products"
            className="text-indigo-600 hover:underline mt-4 inline-block"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Delete Products
        </h1>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
        >
          ← Back to Products
        </Link>
      </div>

      {/* Success Message */}
      {deleteSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm sm:text-base">
          {deleteSuccess}
        </div>
      )}

      {/* Error Message */}
      {deleteError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base">
          {deleteError}
        </div>
      )}

      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        ⚠️ Note: This is a simulated DELETE request. The product will not
        actually be removed from the server.
      </p>

      {/* Product List - with horizontal scroll on small screens */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded mr-2 sm:mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      disabled={deletingId === product.id}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-white text-xs sm:text-sm transition duration-200 ${
                        deletingId === product.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {deletingId === product.id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total products: {products.length}
      </div>
    </div>
  );
}

export default DeleteProduct;
