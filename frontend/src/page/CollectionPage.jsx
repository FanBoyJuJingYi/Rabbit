import { useEffect, useRef, useState, useMemo } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../redux/slices/favoritesSlice";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import { toast } from "sonner";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const { favorites } = useSelector((state) => state.favorites);

  const queryParams = useMemo(
    () => Object.fromEntries([...searchParams.entries()]),
    [searchParams]
  );

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    dispatch(fetchFavorites());
  }, [dispatch, collection, queryParams]);

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

  // Sidebar toggle for mobile
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center mb-4"
        aria-label="Toggle filters sidebar"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 shadow-lg lg:shadow-none`}
      >
        <FilterSidebar />
      </div>

      <main className="flex-grow p-4">
        <Link to="/collections/all" className="mb-4 inline-block">
          <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        </Link>

        <SortOptions />

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          favorites={favorites.map((f) => f._id || f)} // assuming favorites array of IDs or product objects
          toggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
};

export default CollectionPage;
