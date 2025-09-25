import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../redux/slices/favoritesSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.favorites);

  const cartDrawerRef = useRef();

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalQuantity =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  // Số lượng sản phẩm yêu thích
  const favoriteCount = favorites?.length || 0;

  // Load favorites khi user login
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [user, dispatch]);

  // Đóng cart drawer khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartDrawerRef.current &&
        !cartDrawerRef.current.contains(event.target)
      ) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerOpen]);

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Rabbit
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <NavLink to="/collections/all?gender=Men" text="Men" />
          <NavLink to="/collections/all?gender=Women" text="Women" />
          <NavLink to="/collections/all?category=Top Wear" text="Top Wear" />
          <NavLink
            to="/collections/all?category=Bottom Wear"
            text="Bottom Wear"
          />
          <NavLink to="/blog" text="Blog" />
          <NavLink to="/contact" text="Contact" />
          <NavLink to="/about" text="About" />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {user?.role === "admin" && <AdminLink />}

          {/* Favorite (Wishlist) Icon with badge - chỉ hiện khi user đăng nhập */}
          {user && <FavoriteIcon favoriteCount={favoriteCount} />}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <CartIcon onClick={toggleCartDrawer} quantity={totalQuantity} />

          {/* Search bar */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton onClick={toggleNavDrawer} />
        </div>
      </nav>

      {/* Cart Drawer */}
      {drawerOpen && (
        <div ref={cartDrawerRef}>
          <CartDrawer
            drawerOpen={drawerOpen}
            toggleCartDrawer={toggleCartDrawer}
          />
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={navDrawerOpen}
        onClose={toggleNavDrawer}
        user={user}
        favoriteCount={favoriteCount}
      />
    </>
  );
};

// Navigation link component
const NavLink = ({ to, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-700 hover:text-black text-sm font-medium uppercase"
  >
    {text}
  </Link>
);

// Admin link for admin users
const AdminLink = () => (
  <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">
    Admin
  </Link>
);

// Favorite Icon component with red heart and badge
const FavoriteIcon = ({ favoriteCount }) => {
  return (
    <Link to="/favorites" className="relative hover:text-black">
      {favoriteCount > 0 ? (
        <HiHeart className="h-6 w-6 text-rabbit-red" />
      ) : (
        <HiOutlineHeart className="h-6 w-6 text-gray-700" />
      )}
      {favoriteCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
          {favoriteCount}
        </span>
      )}
    </Link>
  );
};

// Cart icon with badge for total quantity
const CartIcon = ({ onClick, quantity }) => (
  <button onClick={onClick} className="relative hover:text-black">
    <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
    {quantity > 0 && (
      <span className="absolute -top-1 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
        {quantity}
      </span>
    )}
  </button>
);

// Mobile menu hamburger button
const MobileMenuButton = ({ onClick }) => (
  <button onClick={onClick} className="md:hidden hover:text-black">
    <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
  </button>
);

// Mobile drawer menu component
const MobileDrawer = ({ isOpen, onClose, user, favoriteCount }) => (
  <div
    className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="flex justify-end p-4">
      <button onClick={onClose}>
        <IoMdClose className="h-6 w-6 text-gray-600" />
      </button>
    </div>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Menu</h2>
      <nav className="space-y-4 flex flex-col">
        <NavLink
          to="/collections/all?gender=Men"
          text="Men"
          onClick={onClose}
        />
        <NavLink
          to="/collections/all?gender=Women"
          text="Women"
          onClick={onClose}
        />
        <NavLink
          to="/collections/all?category=Top Wear"
          text="Top Wear"
          onClick={onClose}
        />
        <NavLink
          to="/collections/all?category=Bottom Wear"
          text="Bottom Wear"
          onClick={onClose}
        />
        <NavLink to="/blog" text="Blog" onClick={onClose} />
        <NavLink to="/contact" text="Contact" onClick={onClose} />
        <NavLink to="/about" text="About" onClick={onClose} />

        {/* User-related links */}
        {user && (
          <>
            {user.role === "admin" && (
              <Link
                to="/admin"
                onClick={onClose}
                className="block bg-black px-2 py-1 rounded text-sm text-white w-fit"
              >
                Admin
              </Link>
            )}

            <Link
              to="/favorites"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              {favoriteCount > 0 ? (
                <HiHeart className="h-5 w-5 text-rabbit-red" />
              ) : (
                <HiOutlineHeart className="h-5 w-5 text-gray-700" />
              )}
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span className="ml-auto bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <HiOutlineUser className="h-5 w-5 text-gray-700" />
              <span>Profile</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  </div>
);

export default Navbar;
