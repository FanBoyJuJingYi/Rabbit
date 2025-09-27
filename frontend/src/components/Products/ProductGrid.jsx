import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { toast } from "sonner"; // Nhớ đã cài thư viện này rồi nhé

const ProductGrid = ({
  products = [],
  loading,
  error,
  favorites = [],
  toggleFavorite,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // ✅ Dùng để điều hướng
  const productsPerPage = 16;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => {
          const isFavorited = favorites.includes(product._id);

          return (
            <div key={product._id} className="relative group">
              <Link to={`/product/${product._id}`} className="block">
                <div className="p-4 rounded-lg relative">
                  <div className="w-full h-96 mb-4 relative">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.images?.[0]?.altText || product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const token = localStorage.getItem("userToken");
                        if (!token) {
                          toast.error(
                            "You must be logged in to manage favorites."
                          );
                          navigate("/login");
                          return;
                        }

                        toggleFavorite(product._id);
                      }}
                      className="absolute bottom-2 left-2 p-1 rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center"
                      aria-label={
                        isFavorited
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {isFavorited ? (
                        <HiHeart className="text-red-600 w-6 h-6 hover:text-red-700 transition-colors" />
                      ) : (
                        <HiOutlineHeart className="text-gray-500 w-6 h-6 hover:text-gray-700 transition-colors" />
                      )}
                    </button>
                  </div>
                  <h3 className="text-sm mb-2">{product.name}</h3>
                  <p className="text-gray-500 font-medium text-sm tracking-tighter">
                    ${product.price}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
