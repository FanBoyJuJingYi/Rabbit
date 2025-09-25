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
    <div className="min-h-screen bg-white px-4 py-16 flex flex-col items-center justify-center">
      {/* Tiêu đề "Contact Us" */}
      <div className="mb-12 text-center">
        <h2 className="relative inline-block text-3xl font-bold text-black">
          Contact Us
          <span className="absolute bottom-0 left-0 w-full h-[3px] bg-black animate-shake"></span>
        </h2>
      </div>

      {/* Layout 2 cột */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Thông tin bên trái */}
        <div className="relative bg-white rounded-xl shadow-lg p-8">
          <img
            src="https://i.pinimg.com/1200x/3a/62/6f/3a626f5253d04431746cdc50f9e1aaf9.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50"
          />
          <div className="relative z-10">
            <h3 className="text-white text-xl font-bold">Get In Touch</h3>
            <ul className="mt-6 space-y-4 text-black text-sm">
              <li className="flex items-center gap-4">
                📍 123 Main street, Mars
              </li>
              <li className="flex items-center gap-3">📧 Rabbit@site.com</li>
              <li className="flex items-center gap-3">📞 0123-456-7890</li>
              <li className="flex items-center gap-3">📱 (+234) 567 - 339</li>
              <li className="flex items-center gap-3">
                📸 @TumiTumiolutionsbluehorizon
              </li>
            </ul>
          </div>
        </div>

        {/* Form liên hệ bên phải */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <textarea
              placeholder="Your Message"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-md"
            >
              Send Message
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-4">
            Powered by StarTech
          </p>
        </div>

        {/* Google Map phía dưới */}
        <div className="col-span-1 md:col-span-2 -mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19802.05700704888!2d-0.1246269!3d51.503324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d84a11%3A0xb1f46b2ddf2f83e8!2sSt.%20Paul's%20Cathedral!5e0!3m2!1sen!2suk!4v1692621234567!5m2!1sen!2suk"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-xl shadow-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
