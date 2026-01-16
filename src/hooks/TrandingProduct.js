import { useEffect, useState } from "react";
import http from "../http";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// eslint-disable-next-line
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
import { FeaturedProducts } from "../components";


export default function TrandingProduct() {

  const [trandingProducts, setTrandingProducts] = useState([]);
  
  const swiperConfig = {
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
      1200: { slidesPerView: 4 },
    },
  };

  useEffect(() => {
    const fetchTrandingProduct = async () => {
      try {
        const res = await http.get("/view-tranding-product");
        setTrandingProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch tranding products", error);
      }
    };

    fetchTrandingProduct();
  }, []);

  if (!trandingProducts?.data?.length) return null;

  return (
    <div className="dfbgghdfdfgdf">
      <div className="sdf58sdfs">
        <h4 className="pb-2">Trending Products</h4>
      </div>

      <div className="fgjhdfgdfgdf py-4">
        <Swiper {...swiperConfig}>
            {trandingProducts?.data?.map((featuredProduct) => (
                <SwiperSlide key={featuredProduct.id}>
                    <FeaturedProducts featuredProduct={featuredProduct} />
                </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
