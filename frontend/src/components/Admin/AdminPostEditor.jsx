import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaPen, FaTimes } from "react-icons/fa";
import SimpleEditor from "../Common/SimpleEditor";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

const AdminPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  const [post, setPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "draft",
  });

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const token = localStorage.getItem("userToken");
          const { data } = await axios.get(`${API_BASE}/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPost(data);
        } catch (err) {
          toast.error("Failed to load post");
          navigate("/admin/posts");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Not authorized. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      if (id) {
        await axios.put(`${API_BASE}/api/posts/${id}`, post, config);
        toast.success("Post updated successfully");
      } else {
        await axios.post(`${API_BASE}/api/posts`, post, config);
        toast.success("Post created successfully");
      }
      navigate("/admin/posts");
    } catch (err) {
      console.error("Error saving post:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Error saving post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <FaPen className="text-primary w-7 h-7" />
          {id ? "Edit Post" : "Create New Post"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block mb-2 font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-required="true"
            aria-label="Post Title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block mb-2 font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label="Post Excerpt"
          />
        </div>

        {/* Featured Image URL */}
        <div>
          <label
            htmlFor="featuredImage"
            className="block mb-2 font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Featured Image URL
          </label>
          <input
            id="featuredImage"
            type="url"
            value={post.featuredImage}
            onChange={(e) => setPost({ ...post, featuredImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label="Featured Image URL"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content-editor"
            className="block mb-2 font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Content
          </label>
          <SimpleEditor
            content={post.content}
            setContent={(content) => setPost({ ...post, content })}
            id="content-editor"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block mb-2 font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Status
          </label>
          <select
            id="status"
            value={post.status}
            onChange={(e) => setPost({ ...post, status: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label="Post Status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Buttons row */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/posts")}
            className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md transition"
            title="Cancel"
          >
            <FaTimes />
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition shadow-md ${
              submitting
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
            aria-busy={submitting}
            aria-label={id ? "Update Post" : "Create Post"}
          >
            <FaPen />
            {submitting
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPostEditor;
