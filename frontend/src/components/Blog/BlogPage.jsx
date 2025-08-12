import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/slices/postsSlice";
import { Link } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BlogPage = () => {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (status === "loading") return <Spinner />;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-600">
        Our Blog
      </h1>

      {/* Featured Posts Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24} 
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 28 },
        }}
        // navigation
        // pagination={{ clickable: true }}
        // className="mb-12 pb-10"
      >
        {posts.slice(0, 5).map((post) => (
          <SwiperSlide key={post._id}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-orange-100">
              <Link
                to={`/blog/${post.id}`}
                className="block h-56 overflow-hidden"
              >
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </Link>
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    to={`/blog/${post.id}`}
                    className="hover:text-orange-600 transition-colors duration-200"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Regular Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(5).map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-orange-100"
          >
            <Link
              to={`/blog/${post.id}`}
              className="block h-56 overflow-hidden"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </Link>
            <div className="p-6 flex-grow">
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  to={`/blog/${post.id}`}
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <Link
                to={`/blog/${post.id}`}
                className="text-white-500 hover:text-white-700 font-medium transition-colors duration-200"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
