import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, fetchPosts } from "../../redux/slices/postsSlice";
import Spinner from "../Common/Spinner";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

const BlogPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    currentPost,
    status,
    posts,
    postsStatus,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, postsStatus]);

  if (status === "loading") return <Spinner />;
  if (!currentPost)
    return <div className="container mx-auto py-12 px-4">Post not found</div>;

  const relatedPosts = posts
    ? posts.filter((post) => post._id !== currentPost._id).slice(0, 3)
    : [];

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <article className="prose max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{currentPost.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">
              Posted on{" "}
              {format(new Date(currentPost.createdAt), "MMMM d, yyyy")}
            </span>
            <span>{currentPost.meta?.views || 0} views</span>
          </div>
          <img
            src={currentPost.featuredImage}
            alt={currentPost.title}
            className="w-full h-auto rounded-lg mb-8"
          />
        </header>

        <div className="prose max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
            {currentPost.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Gợi ý bài viết khác */}
      {relatedPosts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <span className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    Read More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
