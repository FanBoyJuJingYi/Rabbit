import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

const BestSeller = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ limit: 4 }));
  }, [dispatch]);

  if (loading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  }

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="block"
            >
              <div className="bg-white p-4 rounded-lg">
                <div className="w-full h-96 mb-4">
                  <img
                    src={product.images[0]?.url || "/placeholder-product.jpg"}
                    alt={product.images[0]?.altText || product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-sm mb-2">{product.name}</h3>
                <p className="text-gray-500 font-medium text-sm tracking-tighter">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
