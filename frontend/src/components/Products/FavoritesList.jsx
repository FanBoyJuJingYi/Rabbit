import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFavorites,
  removeFavorite,
} from "../../redux/slices/favoritesSlice";

const FavoritesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { favorites, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFavorite(productId)).unwrap();
      dispatch(fetchFavorites());
    } catch (error) {
      // Có thể hiển thị toast hoặc xử lý lỗi ở đây nếu cần
    }
  };

  const handleImageClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) return <p className="text-center">Loading favorites...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Your Favorites
      </h2>

      {!Array.isArray(favorites) || favorites.length === 0 ? (
        <p className="text-center">You have no favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-72 object-cover rounded mb-4 cursor-pointer"
                onClick={() => handleImageClick(product._id)}
              />
              <h3 className="text-lg font-medium mb-1 text-center">
                {product.name}
              </h3>
              <p className="text-gray-800 font-semibold mb-4">
                ${product.price}
              </p>

              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => handleRemove(product._id)}
                  className="flex-1 text-red-600 py-2 rounded cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
