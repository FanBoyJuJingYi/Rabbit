import { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import BestSeller from "../components/Products/BestSeller";
import BlogSection from "../components/Blog/BlogSection";

const Home = () => {
  const dispatch = useDispatch();
  const [bestSellerProduct, setBestSellerProduct] = useState([]);

  useEffect(() => {
    // Fetch products for a specific category
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
    // Fetch best seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
      }
    };
    fetchBestSeller();
  }, []);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller Section */}
      <section className="py-12 ">
        <h2 className="text-3xl text-center font-bold mb-8">Best Seller</h2>
        <BestSeller />
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white-50">
        <div className="container mx-auto px-4">
          <div className="aspect-w-16 aspect-h-9 mx-auto rounded-lg overflow-hidden shadow-lg relative">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              poster="/video-poster.jpg"
            >
              <source
                src="https://cdn.static.amplience.net/gapprod/_vid/fa259423_video_desk/a564033d-9aba-4f74-b45c-2a2f0d91d942/video/f2953657-210e-43e2-a976-f864825d09fb.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute top-[50px] left-[30px] flex items-center justify-start w-full h-full z-100">
              <div className="flex flex-col items-start justify-start">
                <div className="text-white text-5xl">
                  The laid-back look.
                </div>
                <div className="text-white text-xl  mt-[70px]">
                  PJ pants. Sort sweats. Layered on denim.<br /> A capsule that moves 
                  from sleep to street - and back again.
                </div>
              </div>
            </div>
            </div>
          </div>
      </section>

      <BlogSection />
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
