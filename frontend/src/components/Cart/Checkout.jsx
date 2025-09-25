import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import PayPalButton from "./PayPalButton";
import AddressPopup from "./AddressPopup";

import { createCheckout, setCheckout } from "../../redux/slices/checkoutSlice";
import {
  fetchProfile,
  updateShippingAddress,
} from "../../redux/slices/profileSlice";
import { deleteEntireCart, clearCart } from "../../redux/slices/cartSlice";

import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token =
    useSelector((state) => state.auth.token) ||
    localStorage.getItem("userToken");

  const { user, loading: userLoading } = useSelector((state) => state.profile);

  const {
    cart,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);

  const userId = user?.id || user?._id || null;

  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest_${Date.now()}`;
    localStorage.setItem("guestId", guestId);
  }

  const [checkoutId, setCheckoutId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [defaultIndex, setDefaultIndex] = useState(0);

  const [totalAfterDiscount, setTotalAfterDiscount] = useState(
    cart?.totalPrice || 0
  );

  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const [newAddress, setNewAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  useEffect(() => {
    if (token && user === null) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (user && user.shippingAddresses && user.shippingAddresses.length > 0) {
      setShippingAddress(user.shippingAddresses[0]);
      setSelectedAddress(user.shippingAddresses[0]);
      setAddressList(user.shippingAddresses);
    } else {
      setSelectedAddress(null);
      setShippingAddress({
        firstname: "",
        lastname: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
      });
      setAddressList([]);
    }
  }, [user]);

  useEffect(() => {
    setTotalAfterDiscount(cart?.totalPrice - discountAmount);
  }, [discountAmount, cart?.totalPrice]);

  useEffect(() => {
    if (
      (!cart || !cart.products || cart.products.length === 0) &&
      !checkoutId
    ) {
      navigate("/");
    }
  }, [cart, checkoutId, navigate]);

  const checkCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupons/check`,
        { couponCode, totalPrice: cart.totalPrice }
      );
      if (res.data && res.data.discountAmount) {
        setDiscountAmount(res.data.discountAmount);
        toast.success(
          `Coupon applied: -$${res.data.discountAmount.toLocaleString()}`
        );
      } else {
        setDiscountAmount(0);
        toast.error("Invalid coupon code");
      }
    } catch (err) {
      setDiscountAmount(0);
      toast.error(err.response?.data?.message || "Coupon error");
    }
  };

  const handleUpdateAddress = async (index, address) => {
    if (
      !address.firstname.trim() ||
      !address.lastname.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.postalCode.trim() ||
      !address.country.trim() ||
      !address.phone.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const updatedList = [...addressList];
    updatedList[index] = address;

    try {
      await dispatch(updateShippingAddress(updatedList)).unwrap();
      toast.success("Address updated successfully!");
      await dispatch(fetchProfile());
      setAddressList(updatedList);
    } catch (err) {
      toast.error("Failed to update address: " + (err.message || ""));
    }
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const requiredFields = [
      "firstname",
      "lastname",
      "address",
      "city",
      "postalCode",
      "country",
    ];
    for (let field of requiredFields) {
      if (!shippingAddress[field]?.trim()) {
        toast.error(`Please fill in ${field}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (cart && cart.products.length > 0) {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod,
            totalPrice: totalAfterDiscount,
            couponCode: couponCode || null,
          })
        );

        if (res.payload && res.payload._id) {
          setCheckoutId(res.payload._id);

          if (paymentMethod === "cod") {
            await handleFinalizeOrder(res.payload._id);
          }
        }
      }
    } catch (error) {
      toast.error("Error processing checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await handleFinalizeOrder(checkoutId);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleFinalizeOrder = async (checkoutId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        { userId, guestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // lưu checkout vào redux
      dispatch(
        setCheckout({
          _id: checkoutId,
          checkoutItems: cart.products,
          shippingAddress,
          totalPrice: totalAfterDiscount,
          createdAt: new Date().toISOString(), // thêm dòng này
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
          discountAmount, // nếu muốn hiển thị
        })
      );

      // xóa cart đồng bộ
      if (userId || guestId) {
        await dispatch(deleteEntireCart({ userId, guestId })).unwrap();
        dispatch(clearCart());
      }

      // navigate sau khi chắc chắn cart đã xóa
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Finalize error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Error finalizing order. Please contact support."
      );
    }
  };

  const openAddressPopup = () => {
    if (!userId) {
      toast.error("You must be logged in to manage addresses.");
      return;
    }
    setAddressList(user?.shippingAddresses || []);
    setShowAddressPopup(true);
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setShippingAddress(addr);
    setShowAddressPopup(false);
  };

  const handleAddNewAddress = async () => {
    if (!user) return;

    const newAddresses = [...(user.shippingAddresses || []), newAddress];

    try {
      await dispatch(updateShippingAddress(newAddresses)).unwrap();
      // toast.success("New address added successfully");

      await dispatch(fetchProfile());

      setAddressList(newAddresses);
      setNewAddress({
        firstname: "",
        lastname: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
      });
      setShowAddressPopup(false);
    } catch (error) {
      toast.error("Failed to add new address");
    }
  };

  if (cartLoading || userLoading) return <p>Loading...</p>;
  if (cartError) return <p>Error: {cartError}</p>;
  if (!cart || !cart.products || cart.products.length === 0)
    return <p>Your cart is empty</p>;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl uppercase mb-6">Checkout</h2>

          <div className="mb-4 p-4 rounded flex justify-between items-center border border-gray-300">
            {selectedAddress ? (
              <>
                <div className="text-gray-700">
                  {`${selectedAddress.firstname} ${selectedAddress.lastname}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.postalCode}, ${selectedAddress.country}, ${selectedAddress.phone}`}
                </div>
                <div className="text-sm font-semibold text-green-700 border border-green-700 rounded px-2 py-1">
                  Default
                </div>
                <div>
                  <button
                    onClick={openAddressPopup}
                    className={`text-blue-500 hover:underline cursor-pointer ${
                      !userId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!userId}
                    type="button"
                  >
                    Change Address
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={openAddressPopup}
                className={`text-blue-500 hover:underline cursor-pointer w-full text-center ${
                  !userId ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!userId}
                type="button"
              >
                + Add New Address
              </button>
            )}
          </div>

          <form onSubmit={handleCreateCheckout}>
            <h3 className="text-lg mb-2">Contact Details</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={user ? user.email : ""}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>

            <h3 className="text-lg mb-4">Delivery</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={shippingAddress.firstname}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstname: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={shippingAddress.lastname}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastname: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Postal Code</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg mb-2">Payment Method</h3>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">PayPal</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
            </div>

            <div className="mt-6">
              {!checkoutId || paymentMethod === "cod" ? (
                <button
                  type="submit"
                  className={`w-full py-3 rounded ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white"
                  }`}
                  disabled={isSubmitting}
                >
                  {paymentMethod === "paypal"
                    ? "Continue to Payment"
                    : "Place Order"}
                </button>
              ) : (
                <div>
                  <h3 className="text-lg mb-4">Pay with PayPal</h3>
                  <PayPalButton
                    amount={totalAfterDiscount}
                    onSuccess={handlePaymentSuccess}
                    onError={() => toast.error("Payment failed. Try again.")}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg mb-4">Order Summary</h3>
          <div className="border-t py-4 mb-4 max-h-[400px] overflow-auto">
            {cart.products.map((product, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-25 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-md">{product.name}</h3>
                    <p className="text-gray-500">Size: {product.size}</p>
                    <p className="text-gray-500">Color: {product.color}</p>
                    <p className="text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xl">
                  ${(product.price * product.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg mb-4">
            <p>Subtotal</p>
            <p>${cart.totalPrice.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between items-center text-lg mt-4">
            <p>Discount</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border rounded p-2"
              />
              <button
                onClick={checkCoupon}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                type="button"
              >
                Apply
              </button>
            </div>
            <p>${discountAmount.toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 font-semibold">
            <p>Total</p>
            <p>${totalAfterDiscount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <AddressPopup
        show={showAddressPopup}
        onClose={() => setShowAddressPopup(false)}
        addressList={addressList}
        handleSelectAddress={handleSelectAddress}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        handleAddNewAddress={handleAddNewAddress}
        handleUpdateAddress={handleUpdateAddress}
        defaultIndex={defaultIndex}
        setDefaultIndex={setDefaultIndex}
      />
    </>
  );
};

export default Checkout;
