import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./page/Home";
import { Toaster } from "sonner";
import Login from "./page/Login";
import Register from "./page/Register";
import Profile from "./page/Profile";
import CollectionPage from "./page/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./page/OrderConfirmationPage";
import OrderDetailsPage from "./page/OrderDetailsPage";
import MyOrdersPage from "./page/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./page/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import CommentAdmin from "./components/Admin/CommentAdmin";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AddProductPage from "./components/Admin/AddProductPage";
import RevenueManagement from "./components/Admin/RevenueManagement";
import FavoritesList from "./components/Products/FavoritesList";
import ContactForm from "./page/ContactForm.jsx";
import AboutForm from "./page/AboutForm.jsx";
import ContactAdminPage from "./components/Admin/ContactAdminPage";
import AdminCouponManagement from "./components/Admin/AdminCouponManagement";

// Blog Components
import BlogPage from "./components/Blog/BlogPage";
import BlogPost from "./components/Blog/BlogPost";
import AdminPosts from "./components/Admin/AdminPosts";
import AdminPostEditor from "./components/Admin/AdminPostEditor";
import AdminCategoryManagement from "./components/Admin/AdminCategoryManagement.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="favorites" element={<FavoritesList />} />
            <Route path="contact" element={<ContactForm />} />
            <Route path="about" element={<AboutForm />} />

            {/* Blog Routes */}
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<BlogPost />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/add" element={<AddProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="revenue" element={<RevenueManagement />} />
            <Route path="comments" element={<CommentAdmin />} />
            <Route path="contacts" element={<ContactAdminPage />} />
            <Route path="coupons" element={<AdminCouponManagement />} />
            <Route path="categories" element={<AdminCategoryManagement />} />

            {/* Admin Blog Routes */}
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<AdminPostEditor />} />
            <Route path="posts/:id/edit" element={<AdminPostEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
