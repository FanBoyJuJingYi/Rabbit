import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  deleteComment,
} from "../../redux/slices/commentAdminSlice";

import { FaTrashAlt, FaChevronLeft, FaChevronRight, FaComments } from "react-icons/fa";

const CommentAdmin = () => {
  const dispatch = useDispatch();

  const {
    comments = [],
    loading,
    error,
    page,
    totalPages,
    totalComments,
  } = useSelector((state) => state.commentAdmin);

  useEffect(() => {
    dispatch(fetchComments(1));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await dispatch(deleteComment(id));
      dispatch(fetchComments(page));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchComments(newPage));
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = new Set([1, totalPages]);
    if (page - 1 > 1) pagesToShow.add(page - 1);
    pagesToShow.add(page);
    if (page + 1 < totalPages) pagesToShow.add(page + 1);

    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

    const buttons = [];
    for (let i = 0; i < sortedPages.length; i++) {
      if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
        buttons.push(
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-gray-500 select-none"
          >
            ...
          </span>
        );
      }
      const pageNum = sortedPages[i];
      buttons.push(
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`px-3 py-1 rounded-full font-semibold shadow-md transition ${
            pageNum === page
              ? "bg-primary"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-current={pageNum === page ? "page" : undefined}
          aria-label={`Go to page ${pageNum}`}
        >
          {pageNum}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FaComments className="text-primary dark:text-primary-light w-8 h-8" />
        Comment Management
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Loading comments...</p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 select-none">No comments available.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  {["User", "Product", "Content", "Rating", "Created At", "Action"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left font-semibold uppercase tracking-wide select-none"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {comment.user?.name || comment.user?.username || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{comment.product?.name || "Unknown"}</td>
                    <td className="px-6 py-4">{comment.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{comment.rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(comment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center justify-center gap-2"
                        title="Delete Comment"
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-3">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className={`px-4 py-2 rounded-full font-semibold shadow-md transition flex items-center gap-2 ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
                aria-label="Previous page"
              >
                <FaChevronLeft />
                Prev
              </button>

              {renderPagination()}

              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`px-4 py-2 rounded-full font-semibold shadow-md transition flex items-center gap-2 ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
                aria-label="Next page"
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 select-none">
            Total Comments: {totalComments}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentAdmin;
