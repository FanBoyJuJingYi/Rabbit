import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyOrdersPage from "./MyOrdersPage";
import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";
import {
  fetchProfile,
  updateAvatar,
  updateShippingAddress,
  clearProfile,
  changePassword,
} from "../redux/slices/profileSlice";

import { toast } from "sonner";

import {
  FaSignOutAlt,
  FaKey,
  FaUpload,
  FaSave,
} from "react-icons/fa";

import AddressPopup from "../components/Cart/AddressPopup";

const emptyAddress = {
  firstname: "",
  lastname: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, updateLoading } = useSelector(
    (state) => state.profile
  );
  const { changePasswordLoading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [defaultIndex, setDefaultIndex] = useState(0);

  const [newAddress, setNewAddress] = useState(emptyAddress);

  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchProfile());
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user && Array.isArray(user.shippingAddresses)) {
      setShippingAddresses(user.shippingAddresses);
      setDefaultIndex(0);
    } else {
      setShippingAddresses([]);
      setDefaultIndex(0);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearProfile());
    navigate("/");
  };

  const handleAvatarClick = () => {
    if (!updateLoading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadUrl = `${import.meta.env.VITE_BACKEND_URL}/api/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        toast.error("Upload failed: " + text);
        return;
      }

      const data = await response.json();

      if (data.imageUrl) {
        await dispatch(updateAvatar(data.imageUrl)).unwrap();
        toast.success("Avatar updated successfully!");
      } else {
        toast.error("Upload failed: No image URL returned");
      }
    } catch (err) {
      toast.error("Upload error: " + err.message);
    }
  };

  const handleAddNewAddress = async (address) => {
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

    if (shippingAddresses.length >= 2) {
      toast.error("You can add up to 2 addresses only");
      return;
    }

    const updatedList = [...shippingAddresses, address];
    try {
      await dispatch(updateShippingAddress(updatedList)).unwrap();
      setShippingAddresses(updatedList);
      setDefaultIndex(updatedList.length - 1);
      toast.success("New address added successfully!");
    } catch (err) {
      toast.error("Failed to add new address: " + err.message);
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

    const updatedList = [...shippingAddresses];
    updatedList[index] = address;

    try {
      await dispatch(updateShippingAddress(updatedList)).unwrap();
      setShippingAddresses(updatedList);
      toast.success("Address updated successfully!");
    } catch (err) {
      toast.error("Failed to update address: " + err.message);
    }
  };

  const handleSelectAddress = (addr) => {
    const idx = shippingAddresses.findIndex(
      (a) => JSON.stringify(a) === JSON.stringify(addr)
    );
    if (idx !== -1) setDefaultIndex(idx);
    setShowAddressPopup(false);
    toast.success("Address selected!");
  };

  const handleSetDefaultAddress = async (index) => {
    if (index === 0) return; // Already default

    const updatedAddresses = [...shippingAddresses];
    const [selectedAddress] = updatedAddresses.splice(index, 1);
    updatedAddresses.unshift(selectedAddress);

    try {
      await dispatch(updateShippingAddress(updatedAddresses)).unwrap();
      setShippingAddresses(updatedAddresses);
      setDefaultIndex(0);
      toast.success("Set default address successfully!");
    } catch (err) {
      toast.error("Failed to set default address: " + err.message);
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password do not match.");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.");
    }

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      toast.success("Password changed successfully!");
      resetPasswordForm();
      setShowPasswordForm(false);
    } catch (err) {
      toast.error("Change password failed: " + err.message);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-lg">Loading profile...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row md:space-x-10">
          {/* Sidebar */}
          <aside className="md:w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center sticky top-20">
            <div className="relative cursor-pointer group">
              <img
                src={
                  user?.avatarUrl
                    ? user.avatarUrl
                    : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                }
                alt="User Avatar"
                className={`rounded-full w-36 h-36 object-cover border-4 border-blue-500 transition duration-300 group-hover:opacity-70 ${
                  updateLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handleAvatarClick}
                title={updateLoading ? "Uploading..." : "Click to change avatar"}
              />
              {updateLoading && (
                <div className="absolute inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center rounded-full">
                  <FaUpload className="animate-spin text-blue-600 w-8 h-8" />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={updateLoading}
              style={{ display: "none" }}
            />
            <h1 className="text-3xl font-semibold mt-5 mb-1 text-gray-900">
              {user?.name || "No name"}
            </h1>
            <p className="text-gray-600 mb-6 select-text">{user?.email || "No email"}</p>

            <button
              onClick={() => setShowPasswordForm((prev) => !prev)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-3 mb-6 shadow-md"
            >
              <FaKey /> {showPasswordForm ? "Hide Password Form" : "Change Password"}
            </button>

            {showPasswordForm && (
              <section className="w-full border-t pt-6 mt-0">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Change Password</h2>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={changePasswordLoading}
                  className={`w-full mb-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-md ${
                    changePasswordLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {changePasswordLoading ? "Changing..." : <><FaSave /> Change Password</>}
                </button>
              </section>
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
              title="Logout"
            >
              <FaSignOutAlt /> Logout
            </button>
          </aside>

          {/* Main Content */}
          <main className="md:w-2/3 mt-8 md:mt-0 flex flex-col space-y-8">
            {/* Shipping Addresses */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                  Shipping Addresses
                </h2>
                <button
                  onClick={() => setShowAddressPopup(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-lg transition flex items-center gap-2 shadow-md"
                  title="Manage addresses"
                >
                  Manage Addresses
                </button>
              </div>

              {shippingAddresses.length === 0 && (
                <p className="text-gray-600 select-none">No shipping addresses added yet.</p>
              )}

              {shippingAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className={`mb-4 border p-5 rounded-lg bg-gray-50 flex justify-between items-center ${
                    idx === defaultIndex ? "border-[#ee4d2d]" : "border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {addr.firstname} {addr.lastname}
                    </p>
                    <p className="text-gray-700">
                      {addr.address}, {addr.city}, {addr.country}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Postal Code: {addr.postalCode} | Phone: {addr.phone}
                    </p>
                  </div>
                  {idx !== defaultIndex && (
                    <button
                      onClick={() => handleSetDefaultAddress(idx)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg shadow-md"
                      title="Set as default address"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              ))}
            </section>

            {/* Orders */}
            <section className="bg-white rounded-xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
              <MyOrdersPage />
            </section>
          </main>
        </div>
      </div>

      {/* Address Popup */}
      <AddressPopup
        show={showAddressPopup}
        onClose={() => setShowAddressPopup(false)}
        addressList={shippingAddresses}
        handleSelectAddress={handleSelectAddress}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        handleAddNewAddress={handleAddNewAddress}
        handleUpdateAddress={handleUpdateAddress}
        defaultIndex={defaultIndex}
        setDefaultIndex={setDefaultIndex}
      />
    </div>
  );
};

export default Profile;
