import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";

import { fetchFeaturedPosts } from "../../redux/slices/postsSlice";
import { createSelector } from "reselect";

// Selector base lấy posts state
const selectPostsState = (state) => state.posts;

// Memoized selector lấy featuredPosts dưới dạng mảng
const selectFeaturedPosts = createSelector(
  [selectPostsState],
  (postsState) =>
    postsState.featuredPosts?.posts || postsState.featuredPosts || []
);

// Memoized selector lấy status
const selectStatus = createSelector(
  [selectPostsState],
  (postsState) => postsState.status
);

const BlogSection = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);

  // Dùng các selector memoized
  const featuredPosts = useSelector(selectFeaturedPosts);
  const status = useSelector(selectStatus);

  // Fetch featured posts on mount
  useEffect(() => {
    dispatch(fetchFeaturedPosts({ limit: 8 }));
  }, [dispatch]);

  // Show/hide scrollbar on hover
  useEffect(() => {
    if (!swiperRef.current) return;

    const scrollbarEl = swiperRef.current.scrollbar?.el;
    if (!scrollbarEl) return;

    const swiperEl = swiperRef.current.el;

    const handleMouseEnter = () => {
      scrollbarEl.style.opacity = 1;
    };
    const handleMouseLeave = () => {
      scrollbarEl.style.opacity = 0;
    };

    scrollbarEl.style.opacity = 0; // Hide by default

    swiperEl.addEventListener("mouseenter", handleMouseEnter);
    swiperEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      swiperEl.removeEventListener("mouseenter", handleMouseEnter);
      swiperEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [featuredPosts]);

  if (status === "loading") {
    return <div className="text-center py-12">Loading featured posts...</div>;
  }

  if (!Array.isArray(featuredPosts) || featuredPosts.length === 0) {
    return null;
  }

  

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 tracking-tight">
          News
        </h2>

        <Swiper
          modules={[Scrollbar]}
          spaceBetween={20}
          slidesPerView={4}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          style={{  }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {featuredPosts.map((post) => {
            const postId = post._id || post.id;

            return (
              <SwiperSlide key={postId} >
                <Link
                  to={`/blog/${post._id || post.id}`}
                  className="group relative block h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >

                  {/* Image */}
                  <img
                    src={post.featuredImage || ""}
                    alt={post.title || "Post image"}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  {/* Text in center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {post.title || "Untitled"}
                    </h3>
                    <p className="text-white text-sm line-clamp-3 opacity-90">
                      {post.excerpt || ""}
                    </p>
                    <span className="mt-3 inline-block text-sm font-medium text-white relative group cursor-pointer">
                      Read more →
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </div>

                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>


  );
};

export default BlogSection;
