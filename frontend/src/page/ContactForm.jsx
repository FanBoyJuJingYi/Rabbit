import { useDispatch } from "react-redux";
import { useState } from "react";
import { createContact } from "../redux/slices/contactSlice";
import { toast } from "sonner";

export default function ContactForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await dispatch(createContact(form)).unwrap();
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-orange-100">
        
        {/* Tiêu đề */}
        <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-2">
          Contact Us
        </h2>
        <p className="text-center text-gray-500 mb-8">
          We will respond as soon as possible.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Your Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Message
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 h-32 text-gray-700 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Type your message here..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-[1.02]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
