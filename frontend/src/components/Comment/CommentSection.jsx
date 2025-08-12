import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "../../redux/slices/commentsSlice";
import { fetchUserOrders } from "../../redux/slices/orderSlice";

const CommentSection = ({ productId }) => {
  const dispatch = useDispatch();

  // Get user and orders from redux store
  const { user } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  // Comments slice state
  const {
    comments,
    loading: commentsLoading,
    error,
  } = useSelector((state) => state.comments);

  // Local states for comment form
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Fetch user orders and product comments on mount or user/product change
  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders());
      dispatch(fetchComments(productId));
    }
  }, [user, productId, dispatch]);

  // Check if user has purchased the product based on orders
  useEffect(() => {
    if (orders.length > 0 && productId) {
      const purchased = orders.some((order) =>
        order.orderItems.some(
          (item) => item.productId.toString() === productId.toString()
        )
      );
      setHasPurchased(purchased);
    } else {
      setHasPurchased(false);
    }
  }, [orders, productId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasPurchased) {
      toast.error("You must purchase the product to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter your review content");
      return;
    }

    dispatch(addComment({ productId, content, rating }))
      .unwrap()
      .then(() => {
        setContent("");
        setRating(0);
        toast.success("Review submitted successfully");
        dispatch(fetchComments(productId));
      })
      .catch(() => {
        toast.error("Failed to submit review");
      });
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment(commentId))
        .unwrap()
        .then(() => {
          toast.success("Comment deleted successfully");
          dispatch(fetchComments(productId));
        });
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

      {/* Comment Form */}
      {user ? (
        hasPurchased ? (
          <form
            onSubmit={handleSubmit}
            className="mb-8 bg-gray-50 p-4 rounded-lg"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating
              </label>
              <div className="flex space-x-1 text-3xl select-none">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`focus:outline-none ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-3 border rounded mb-4 resize-none"
              rows="4"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-yellow-800">
            You must purchase the product to leave a review
          </div>
        )
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-yellow-800">
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            log in
          </a>{" "}
          to leave a review
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {(commentsLoading || ordersLoading) && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}

        {comments.length === 0 && !commentsLoading && (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        )}

        {comments.map((comment) => (
          <div key={comment._id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <img
                  src={comment.user?.avatar || "/default-avatar.png"}
                  alt={comment.user?.name || "User"}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">
                    {comment.user?.name || "Anonymous"}
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < comment.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
              </div>

              {(user?._id === comment.user?._id || user?.isAdmin) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="text-gray-700 mt-2">{comment.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
