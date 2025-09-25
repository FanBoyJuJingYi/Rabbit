import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout === null) return; // chờ checkout load

    if (checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        });
  };

  const calculateEstimatedDelivery = (dateString) => {
    if (!dateString) return "N/A";
    const orderDate = new Date(dateString);
    if (isNaN(orderDate.getTime())) return "N/A";

    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  if (!checkout) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      <div className="p-6 rounded-lg border">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Order ID: {checkout._id}</h2>
            <p className="text-gray-500">
              Order date: {formatDate(checkout.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-emerald-700 text-sm">
              Estimated Delivery:{" "}
              {calculateEstimatedDelivery(checkout.createdAt)}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          {checkout.checkoutItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center mb-4 pb-4 border-b"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover mr-4 rounded-md"
              />
              <div className="flex-1">
                <h4 className="text-md font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.color} | {item.size}
                </p>
              </div>
              <div className="text-right">
                <p className="text-md">${parseFloat(item.price).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Information</h4>
            <p className="text-gray-500 capitalize">{checkout.paymentMethod}</p>
            <p className="text-gray-500 capitalize mt-2">
              Status: {checkout.paymentStatus}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Information</h4>
            <p className="text-gray-600">{checkout.shippingAddress.address}</p>
            <p className="text-gray-600">
              {checkout.shippingAddress.city},{" "}
              {checkout.shippingAddress.postalCode}
            </p>
            <p className="text-gray-600">{checkout.shippingAddress.country}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-right">
          <p className="text-lg">
            <span className="font-semibold">Total:</span> $
            {checkout.totalPrice.toFixed(2)}
          </p>
          {checkout.discountAmount > 0 && (
            <p className="text-sm text-gray-500">
              (Discount: ${checkout.discountAmount.toFixed(2)} applied)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
