import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import CommentSection from "../Comment/CommentSection";
import { addFavorite, removeFavorite } from "../../redux/slices/favoritesSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productFetchId = productId || id;

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [colorImages, setColorImages] = useState({});

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      const imagesByColor = {};
      selectedProduct.colors?.forEach((color, index) => {
        imagesByColor[color] = selectedProduct.images[index]?.url;
      });
      setColorImages(imagesByColor);

      setMainImage(selectedProduct.images[0].url);
      if (selectedProduct.colors?.length > 0) {
        setSelectedColor(selectedProduct.colors[0]);
      }
    }
  }, [selectedProduct]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    if (colorImages[color]) {
      setMainImage(colorImages[color]);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    } else if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleFavorite = (productId) => {
    // Kiểm tra user đăng nhập
    if (!localStorage.getItem("userToken")) {
      toast.error("Please log in to manage favorites.");
      navigate("/login");
      return;
    }

    const isFav = favorites.includes(productId);
    if (isFav) {
      dispatch(removeFavorite(productId)).then((res) => {
        if (!res.error) toast.success("Removed from favorites");
        else toast.error(res.error);
      });
    } else {
      dispatch(addFavorite(productId)).then((res) => {
        if (!res.error) toast.success("Added to favorites");
        else toast.error(res.error);
      });
    }
  };

  const handleAddToCart = () => {
    // Kiểm tra user đăng nhập trước khi thêm giỏ hàng
    if (!localStorage.getItem("userToken")) {
      toast.error("Please log in to add products to your cart.");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select size before adding to cart.", {
        duration: 1000,
      });
      return;
    }
    if (!selectedColor && selectedProduct.colors?.length > 0) {
      toast.error("Please select color before adding to cart.", {
        duration: 1000,
      });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart successfully!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return <p className="text-center py-8">Loading ...</p>;
  }
  if (error) {
    return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  }
  if (!selectedProduct) {
    return <p className="text-center py-8">Product not found.</p>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            {/* Left Thumbnails - Desktop */}
            <div className="hidden md:flex flex-col space-y-4">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    mainImage === image.url ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={mainImage || selectedProduct.images[0].url}
                  alt="Main Product"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Mobile Thumbnails */}
              <div className="md:hidden flex overflow-x-auto space-x-2 py-2">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 min-w-[64px] ${
                      mainImage === image.url
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="md:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {selectedProduct.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                {selectedProduct.originalPrice && (
                  <p className="text-lg text-gray-500 line-through">
                    ${selectedProduct.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-2xl font-semibold text-gray-800">
                  ${selectedProduct.price.toFixed(2)}
                </p>
              </div>

              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>

              {/* Color Selection */}
              {selectedProduct.colors?.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 font-medium mb-2">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorClick(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-black scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p
                  className={`font-medium ${
                    selectedProduct.countInStock > 0
                      ? "text-white-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedProduct.countInStock > 0
                    ? `In stock: ${selectedProduct.countInStock}`
                    : "Out of stock"}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-2">Size:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <p className="text-gray-700 font-medium mb-2">Quantity:</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-xl">-</span>
                  </button>
                  <span className="text-lg w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={
                  isButtonDisabled || selectedProduct.countInStock === 0
                }
                className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
                  selectedProduct.countInStock === 0 || isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900"
                }`}
              >
                Add to Cart
              </button>

              {/* Favorite Button */}
              <div className="mt-4 text-right">
                <button
                  onClick={() => toggleFavorite(productFetchId)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Toggle favorite"
                >
                  {favorites.includes(productFetchId)
                    ? "♥ Remove from favorites"
                    : "♡ Add to favorites"}
                </button>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-10">
            <CommentSection productId={productFetchId} />
          </div>

          {/* Similar Products */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
              favorites={favorites.map((f) =>
                typeof f === "object" ? f._id : f
              )}
              toggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
