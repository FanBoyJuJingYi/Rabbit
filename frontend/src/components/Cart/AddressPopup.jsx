import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteShippingAddress } from "../../redux/slices/profileSlice";

const AddressPopup = ({
  show,
  onClose,
  addressList,
  handleSelectAddress,
  newAddress,
  setNewAddress,
  handleAddNewAddress,
  handleUpdateAddress,
  defaultIndex,
  setDefaultIndex,
}) => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (!show) return;

    if (addressList.length === 0) {
      setAddingNew(true);
      setSelectedIndex(null);
      setEditingIndex(null);
    } else {
      setAddingNew(false);
      setSelectedIndex(
        defaultIndex !== null &&
          defaultIndex >= 0 &&
          defaultIndex < addressList.length
          ? defaultIndex
          : 0
      );
      setEditingIndex(null);
    }
  }, [show, addressList, defaultIndex]);

  if (!show) return null;

  const onSelect = (addr, i) => {
    setSelectedIndex(i);
  };

  const onConfirm = async () => {
    if (addingNew) {
      if (
        !newAddress.firstname.trim() ||
        !newAddress.lastname.trim() ||
        !newAddress.address.trim() ||
        !newAddress.city.trim() ||
        !newAddress.postalCode.trim() ||
        !newAddress.country.trim() ||
        !newAddress.phone.trim()
      ) {
        toast.error("Please fill in all fields.");
        return;
      }

      try {
        if (editingIndex !== null) {
          await handleUpdateAddress(editingIndex, newAddress);
          toast.success("Address updated successfully!");
        } else {
          await handleAddNewAddress(newAddress);
          toast.success("New address added successfully!");
        }

        setNewAddress({
          firstname: "",
          lastname: "",
          address: "",
          city: "",
          postalCode: "",
          country: "",
          phone: "",
        });
        setAddingNew(false);
        setEditingIndex(null);
      } catch (err) {
        toast.error("Failed to save address.");
      }
    } else {
      if (selectedIndex !== null && selectedIndex < addressList.length) {
        handleSelectAddress(addressList[selectedIndex]);
        onClose();
      } else {
        toast.error("Please select an address or add a new one.");
      }
    }
  };

  const onSetDefault = (i) => {
    setDefaultIndex(i);
  };

  const handleEditAddress = (index) => {
    setAddingNew(true);
    setEditingIndex(index);
    setNewAddress(addressList[index]);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteShippingAddress(index)).unwrap();
        toast.success("Address deleted successfully!");
        if (defaultIndex === index) {
          setDefaultIndex(null);
        }
        if (editingIndex === index) {
          setAddingNew(false);
          setEditingIndex(null);
          setNewAddress({
            firstname: "",
            lastname: "",
            address: "",
            city: "",
            postalCode: "",
            country: "",
            phone: "",
          });
        }
      } catch (error) {
        toast.error("Failed to delete address.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl mb-6 font-semibold text-center text-[#ee4d2d]">
          {addingNew
            ? editingIndex !== null
              ? "Edit Shipping Address"
              : "Add New Shipping Address"
            : "Select Shipping Address"}
        </h3>

        {!addingNew ? (
          <>
            {addressList.length > 0 ? (
              <>
                <div className="space-y-6 overflow-y-auto mb-4 border border-gray-200 rounded p-4 max-h-96">
                  {addressList.map((addr, i) => (
                    <div
                      key={i}
                      onClick={() => onSelect(addr, i)}
                      className={`cursor-pointer p-4 rounded-lg border transition-shadow
                        ${
                          selectedIndex === i
                            ? "border-[#ee4d2d] shadow-md bg-[#fff3f0]"
                            : "border-gray-300 hover:shadow-lg hover:border-[#ee4d2d]"
                        }
                      `}
                    >
                      <p className="font-semibold text-[#ee4d2d] text-lg">
                        {addr.firstname} {addr.lastname}
                      </p>
                      <p className="text-gray-700 mt-1">
                        {addr.address}, {addr.city}, {addr.postalCode}, {addr.country}
                      </p>
                      <p className="text-gray-700 mt-1">Phone: {addr.phone}</p>

                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetDefault(i);
                          }}
                          className={`px-3 py-1 text-sm rounded-full font-medium
                            ${
                              defaultIndex === i
                                ? "bg-[#ee4d2d] text-white cursor-default"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }
                          `}
                          disabled={defaultIndex === i}
                        >
                          {defaultIndex === i ? "Default" : "Set Default"}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(i);
                          }}
                          className="px-3 py-1 text-sm rounded-full font-medium bg-blue-500 hover:bg-blue-600 text-white"
                          title="Edit Address"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(i);
                          }}
                          className="px-3 py-1 text-sm rounded-full font-medium bg-red-500 hover:bg-red-600 text-white"
                          title="Delete Address"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {addressList.length < 2 && (
                  <button
                    onClick={() => {
                      setAddingNew(true);
                      setEditingIndex(null);
                      setNewAddress({
                        firstname: "",
                        lastname: "",
                        address: "",
                        city: "",
                        postalCode: "",
                        country: "",
                        phone: "",
                      });
                    }}
                    className="text-[gray] hover:text-[gray] font-semibold text-sm px-0 py-1 mb-4 border-b border-radius border-white transition"
                    style={{ backgroundColor: "transparent" }}
                  >
                    + Add New Address
                  </button>
                )}

                <div className="flex justify-between gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={selectedIndex === null}
                    className={`flex-1 py-2 rounded-md font-semibold text-white transition
                      ${
                        selectedIndex === null
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#ee4d2d] hover:bg-[#c43c23]"
                      }
                    `}
                  >
                    Select
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">
                No shipping addresses available. Please add a new address.
              </p>
            )}
          </>
        ) : (
          <>
            <form
              className="grid grid-cols-2 gap-6 mb-6"
              onSubmit={(e) => {
                e.preventDefault();
                onConfirm();
              }}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="firstname"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  placeholder="First Name"
                  value={newAddress.firstname}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, firstname: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="lastname"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  placeholder="Last Name"
                  value={newAddress.lastname}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, lastname: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Street address"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="city"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="postalCode"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-between gap-4 col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddingNew(false);
                    setEditingIndex(null);
                    setNewAddress({
                      firstname: "",
                      lastname: "",
                      address: "",
                      city: "",
                      postalCode: "",
                      country: "",
                      phone: "",
                    });
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md py-2 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ee4d2d] hover:bg-[#c43c23] text-white rounded-md py-2 font-semibold transition"
                >
                  {editingIndex !== null ? "Update Address" : "Add Address"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressPopup;
