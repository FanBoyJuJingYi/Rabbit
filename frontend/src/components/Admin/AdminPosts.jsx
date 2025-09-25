import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FaTrashAlt, FaEdit, FaPlus, FaNewspaper } from "react-icons/fa";

import {
  fetchPosts,
  deletePost,
  resetOperationStatus,
} from "../../redux/slices/postsSlice";

const AdminPosts = () => {
  const dispatch = useDispatch();

  const { posts = [], status, error, operationStatus, operationError } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (operationStatus === "succeeded") {
      toast.success("Post deleted successfully");
      dispatch(resetOperationStatus());
      dispatch(fetchPosts()); // refresh list after delete
    } else if (operationStatus === "failed") {
      toast.error(operationError || "Failed to delete post");
      dispatch(resetOperationStatus());
    }
  }, [operationStatus, operationError, dispatch]);

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(postId));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error || "Failed to fetch posts"}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
          <FaNewspaper className="text-primary dark:text-primary-light w-8 h-8" />
          Manage Posts
        </h1>
        <Link
          to="/admin/posts/new"
          className="bg-primary hover:bg-primary-dark px-5 py-2 rounded-full shadow-md flex items-center gap-2 transition"
        >
          <FaPlus />
          Create New Post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
            <tr>
              {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th> */}
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Views</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500 dark:text-gray-400 select-none">
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {post.meta?.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-3">
                    <Link
                      to={`/admin/posts/${post._id}/edit`}
                      title="Edit Post"
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      title="Delete Post"
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPosts;
