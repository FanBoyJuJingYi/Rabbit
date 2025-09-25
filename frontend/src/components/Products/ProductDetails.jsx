import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { fetchSimilarProducts } from "../../redux/slices/productsSlice";
import CommentSection from "../Comment/CommentSection";
<<<<<<< HEAD
=======
import { addFavorite, removeFavorite } from "../../redux/slices/favoritesSlice";
>>>>>>> 1aa479b (Upload 2)

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const productFetchId = productId || id;

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [colorImages, setColorImages] = useState({});
<<<<<<< HEAD
=======
  const { favorites } = useSelector((state) => state.favorites);
>>>>>>> 1aa479b (Upload 2)

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      // Tạo mapping giữa màu sắc và ảnh tương ứng
      const imagesByColor = {};
      selectedProduct.colors?.forEach((color, index) => {
        imagesByColor[color] = selectedProduct.images[index]?.url;
      });
      setColorImages(imagesByColor);

      // Set ảnh chính ban đầu
      setMainImage(selectedProduct.images[0].url);
      // Set màu được chọn ban đầu
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
<<<<<<< HEAD
=======
  const toggleFavorite = (productId) => {
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
>>>>>>> 1aa479b (Upload 2)

  const handleAddToCart = () => {
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
                disabled={isButtonDisabled}
                className={`w-full py-3 px-6 rounded-md font-medium text-white transition-colors ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              {/* Product Details */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-bold mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Brand</p>
                    <p className="font-medium">
                      {selectedProduct.brand || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Material</p>
                    <p className="font-medium">
                      {selectedProduct.material || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">
                      {selectedProduct.category || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">SKU</p>
                    <p className="font-medium">{selectedProduct._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl text-center font-bold mb-8">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
<<<<<<< HEAD
=======
              favorites={favorites.map((f) => f._id || f)}
              toggleFavorite={toggleFavorite}
>>>>>>> 1aa479b (Upload 2)
            />
          </div>
          <CommentSection productId={productFetchId} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
