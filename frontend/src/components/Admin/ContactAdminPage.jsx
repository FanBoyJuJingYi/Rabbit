import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  deleteContact,
  completeContact,
} from "../../redux/slices/contactSlice";
import { FaTrashAlt, FaCheckCircle, FaEnvelopeOpenText } from "react-icons/fa";

export default function ContactAdminPage() {
  const dispatch = useDispatch();
  const { list: contacts = [], loading, error } = useSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FaEnvelopeOpenText className="text-primary dark:text-primary-light w-8 h-8" />
        Contact Management
      </h2>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center text-gray-600 dark:text-gray-400">
            Loading contacts...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-red-600 dark:text-red-500">
            Error: {error}
          </p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Message</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 select-none"
                  >
                    No contacts found.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{c.message}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          c.status === "completed"
                            ? "text-green-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-4">
                      {c.status !== "completed" && (
                        <button
                          onClick={() => dispatch(completeContact(c._id))}
                          title="Mark as Complete"
                          className="text-green-600 hover:text-green-800 transition text-xl"
                          aria-label="Complete contact"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      <button
                        onClick={() => dispatch(deleteContact(c._id))}
                        title="Delete contact"
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                        aria-label="Delete contact"
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
