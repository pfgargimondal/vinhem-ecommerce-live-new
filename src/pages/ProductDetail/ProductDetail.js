import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
import { toast, ToastContainer } from "react-toastify";

import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
// eslint-disable-next-line
import Form from "react-bootstrap/Form";
import RecentlyViewed from "../../hooks/RecentlyViewed";
import {
  ChatProfileDetails,
  FeaturedProducts,
  MeasurementForm,
} from "../../components";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./Css/ProductDetail.css";
import "./Css/ProductDetailResponsive.css";
import "swiper/css";
// eslint-disable-next-line
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { DesignerSizeChart } from "../../components/Elements/DsignerSizeChart/DsignerSizeChart";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import Loader from "../../components/Loader/Loader";
import { useAuthModal } from "../../context/AuthModalContext";

export const ProductDetail = () => {
  const { token, user } = useAuth();
  const { loading: cartLoading, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [show, setShow] = useState(false);
  // eslint-disable-next-line
  const [showMjri, setShowMjri] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { formatPrice } = useCurrency();

  const { slug } = useParams();
  const [shareModal, setShareModal] = useState(false);
  const [turbanModal, setTurbanModal] = useState(false);
  const [mojriModal, setMojriModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLaterModal, setShowLaterModal] = useState(false);
  // const [activeKey, setActiveKey] = useState("first");
  const [activeKey, setActiveKey] = useState("img-1");
  const [chatProfileDetailsShow, setChatProfileDetailsShow] = useState(false);
  const [videoMute, setVideoMute] = useState(true);
  const { handleLoginModal } = useAuthModal();

  const scrollRef = useRef(null);
  const scrollLargeRef = useRef(null);
  const scrollAmount = 120;
  const isVideoTab = activeKey === "video";

  // const handleVideoToggle = (videoKey) => {
  //   const largeVideo = document.querySelector(".odjeowmkoiwewer video");
  //   if (!largeVideo) return;

  //   if (videoKey === "seventh") {
  //     largeVideo.currentTime = 0;

  //     // only play if it's actually paused
  //     if (largeVideo.paused) {
  //       largeVideo.play().catch(() => {});
  //     }
  //   }

  //   setVideoMute(false);
  // };

  const handleVideoControl = () => {
    const largeVideo = document.querySelector(".odjeowmkoiwewer video");
    if (!largeVideo) return;

    if (largeVideo.paused) {
      // only play when paused
      largeVideo.play().catch(() => {});
    } else {
      // only pause when playing
      largeVideo.pause();
    }
  };

  const handleMuteToggle = () => {
    const largeVideo = document.querySelector(".odjeowmkoiwewer video");

    largeVideo.muted = !largeVideo.muted;

    setVideoMute(!videoMute);
  };

  const handleLaterToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");

    setShowLaterModal(!showLaterModal);
  };

  const handleLaterClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");

    setShowLaterModal(!showLaterModal);
  };

  const handlePGShowModal = (e, key) => {
    e.preventDefault();

    setActiveKey(key);
    setShowModal(true);
  };

  useEffect(() => {
    const html = document.querySelector("html");

    showModal
      ? html.classList.add("overflow-hidden")
      : html.classList.remove("overflow-hidden");
  }, [showModal]);

  const handlePGClose = () => setShowModal(false);

  useEffect(() => {
    if (slug) {
      const existing =
        JSON.parse(localStorage.getItem("recentlyViewedSlugs")) || [];

      // Remove if already exists to avoid duplicates
      const filtered = existing.filter((item) => item !== slug);

      // Add new slug at the front
      const updated = [slug, ...filtered].slice(0, 10); // keep max 10 items

      localStorage.setItem("recentlyViewedSlugs", JSON.stringify(updated));
    }
  }, [slug]);

  // eslint-disable-next-line
  const [activeTab, setActiveTab] = useState("tab-1");

  const [showSizeModal, setShowSizeModal] = useState(false);

  //matching products

  const swiperMatchingConfig = {
    modules: [Autoplay, Pagination, Navigation, Mousewheel],
    direction: "horizontal",
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    slidesPerView: 5,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
      420: { slidesPerView: 2 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    },
  };

  //featured products

  const swiperConfig = {
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
      420: { slidesPerView: 2 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
      1200: { slidesPerView: 4 },
    },
  };

  const handleShowModal = (e) => {
    e.preventDefault();

    setShowSizeModal(!showSizeModal);
  };

  useEffect(() => {
    const html = document.querySelector("html");

    if (showSizeModal) {
      html.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
    }

    return () => {
      html.classList.remove("overflow-hidden");
    };
  }, [showSizeModal]);

  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();

  const toggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const [productDetails, SetproductDetails] = useState({});

  const getEstimatedShippingDate = (shipping_time) => {
    const days = parseInt(shipping_time);
    if (isNaN(days)) return "";

    const date = new Date();
    date.setDate(date.getDate() + days);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  useEffect(() => {
    const fetchProductDetailsPage = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get(`/fetch-product-details/${slug}`);
        SetproductDetails(getresponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetailsPage();
    }
  }, [slug]);

  const productLink = `${window.location.origin}/products/${productDetails?.data?.slug}`;
  const handleWhatsAppShare = () => {
    const message = `Check out this beautiful product: ${productLink}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleFacebookShare = () => {
    const encodedURL = encodeURIComponent(productLink);
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
    window.open(facebookURL, "_blank", "noopener,noreferrer");
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(productLink);
    window.open("https://www.instagram.com/", "_blank");
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(productLink);
    const text = encodeURIComponent("Check out this product!");

    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const handlePinterestShare = () => {
    const url = encodeURIComponent(productLink);
    const media = encodeURIComponent(
      productDetails?.data?.product_image?.encoded_image_url_1 || ""
    );
    const description = encodeURIComponent(
      productDetails?.data?.product_name || "Check out this product"
    );

    window.open(
      `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`,
      "_blank"
    );
  };

  const normalizeSize = (size = "") => size.replace(/\s+/g, "");
  const [selectedSize, setSelectedSize] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [sizeAccordingPrice, setSizeAccordingPrice] = useState(0);

  const [selectedStitchOption, setSelectedStitchOption] = useState("");
  const [isTurbanChecked, setIsTurbanChecked] = useState(false);
  const [isMojriChecked, setIsMojriChecked] = useState(false);
  const [isStoleChecked, setIsStoleChecked] = useState(false);

  const isOutOfStock = availableQty < 1 || selectedQuantity < 1;

  // useEffect(() => {
  //   if (productDetails?.data?.mto_quantity) {
  //     setAvailableQty(productDetails.data.mto_quantity);
  //   }
  // }, [productDetails]);

  // ------------------------------
  // Handle size change
  // ------------------------------
  const handleSizeChange = (e) => {
    const normalizedSize = normalizeSize(e.target.value);

    setSelectedSize(normalizedSize);
    updateQtyAndPriceBySize(normalizedSize);
  };

  const handleQuantitySelect = (qty) => {
    if (qty > 5) {
      toast.error("You can purchase a maximum of 5 quantities only.");
      return;
    }

    setSelectedQuantity(qty);

    // Recalculate final price when quantity changes
    const basePrice = parseFloat(
      selectedPrice || productDetails?.data?.selling_price || 0
    );

    let total = basePrice * qty;

    // Optional addon charges
    const stitchingCharge = parseFloat(
      productDetails?.data?.stiching_charges?.price || 0
    );
    const customFitCharge = parseFloat(
      productDetails?.data?.extra_charges?.price || 0
    );
    const turbanPrice = parseFloat(
      productDetails?.data?.turban_charges?.price || 0
    );
    const mojriPrice = parseFloat(
      productDetails?.data?.mojri_charges?.price || 0
    );
    const stolePrice = parseFloat(
      productDetails?.data?.stole_charges?.price || 0
    );

    // Add optional selections if chosen
    if (selectedStitchOption === "stitch") total += stitchingCharge;
    if (selectedStitchOption === "customFit") total += customFitCharge;
    if (isTurbanChecked) total += turbanPrice;
    if (isMojriChecked) total += mojriPrice;
    if (isStoleChecked) total += stolePrice;

    setFinalPrice(total);
  };

  const updateQtyAndPriceBySize = useCallback(
    (normalizedSize) => {
      const allSizes = productDetails?.data?.product_allSize || [];
      const base = productDetails?.data || {};

      const inventory = allSizes.find(
        (item) =>
          normalizeSize(item.filter_size) === normalizedSize ||
          normalizeSize(item.plus_sizes) === normalizedSize
      );

      let qty = 0;

      if (inventory) {
        if (normalizeSize(inventory.filter_size) === normalizedSize) {
          qty = Number(inventory.mto_quantity || 0);
        }

        if (normalizeSize(inventory.plus_sizes) === normalizedSize) {
          qty = Number(inventory.plus_size_quantity || 0);
        }
      }

      setAvailableQty(qty);
      setSelectedQuantity(1);

      const sellingPrice = parseFloat(
        inventory?.selling_price || base.selling_price || 0
      );

      const plusCharge = parseFloat(inventory?.plus_sizes_charges || 0);

      const final =
        normalizeSize(inventory?.plus_sizes) === normalizedSize &&
        plusCharge > 0
          ? plusCharge
          : sellingPrice;

      setSelectedPrice(final);
      setSizeAccordingPrice(final);
    },
    [productDetails]
  );

  useEffect(() => {
    if (
      productDetails?.data?.stitching_option === "Ready To Wear" &&
      productDetails?.data?.product_allSize?.length > 0 &&
      !selectedSize
    ) {
      const firstSize = productDetails.data.product_allSize[0].filter_size;
      const normalized = normalizeSize(firstSize);

      setSelectedSize(normalized);
      updateQtyAndPriceBySize(normalized);
    }
  }, [productDetails, selectedSize, updateQtyAndPriceBySize]);

  // ------------------------------
  // Calculate total price dynamically
  // ------------------------------
  useEffect(() => {
    let total =
      parseFloat(selectedPrice || productDetails?.data?.selling_price || 0) *
      selectedQuantity;

    const stitchingCharge = parseFloat(
      productDetails?.data?.stiching_charges?.price || 0
    );
    const customFitCharge = parseFloat(
      productDetails?.data?.extra_charges?.price || 0
    );
    const turbanPrice = parseFloat(
      productDetails?.data?.turban_charges?.price || 0
    );
    const mojriPrice = parseFloat(
      productDetails?.data?.mojri_charges?.price || 0
    );
    const stolePrice = parseFloat(
      productDetails?.data?.stole_charges?.price || 0
    );

    if (selectedStitchOption === "stitch") total += stitchingCharge;
    if (selectedStitchOption === "customFit") total += customFitCharge;
    if (isTurbanChecked) total += turbanPrice;
    if (isMojriChecked) total += mojriPrice;
    if (isStoleChecked) total += stolePrice;

    setFinalPrice(total);
  }, [
    selectedPrice,
    selectedSize,
    selectedQuantity,
    selectedStitchOption,
    isTurbanChecked,
    isMojriChecked,
    isStoleChecked,
    productDetails,
  ]);

  // ------------------------------
  // Handle stitch option
  // ------------------------------
  const handleStitchOptionChange = (type) => {
    setSelectedStitchOption(type);
  };

  useEffect(() => {
    if (productDetails?.data?.stitching_option !== "Ready To Wear") {
      setSelectedStitchOption("stitch");
    } else {
      setSelectedStitchOption("stitch"); // or "readyToWear"
    }
  }, [productDetails]);

  const handleAddToCart = async () => {
    if (productDetails?.data?.stitching_option === "Ready To Wear") {
      const hasSizes = productDetails?.data?.product_allSize?.length > 0;
      // ✅ 1. Validate main size
      if (hasSizes && !selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
      }
    }

    if (selectedQuantity < 1) {
      toast.error("Product is out of stock.");
      return;
    }

    // ✅ 2. Validate accessory sizes (if selected)
    const turbanSize =
      document.getElementById("product_turbanSize")?.value || "";
    const mojriSize = document.getElementById("product_mojriSize")?.value || "";

    if (isTurbanChecked && !turbanSize) {
      alert("Please select a turban size.");
      return;
    }

    if (isMojriChecked && !mojriSize) {
      alert("Please select a mojri size.");
      return;
    }

    if (selectedStitchOption === "") {
      alert("Please Choose Stiching Option.");
      return;
    }

    // ✅ 3. Determine correct price logic
    const baseSellingPrice = parseFloat(
      productDetails?.data?.selling_price || 0
    );
    const priceToUse = selectedPrice > 0 ? selectedPrice : baseSellingPrice;

    // ✅ 4. Calculate total based on selection
    const stitchingCharge =
      selectedStitchOption === "stitch"
        ? parseFloat(productDetails?.data?.stiching_charges?.price || 0)
        : 0;

    const customFitCharge =
      selectedStitchOption === "customFit"
        ? parseFloat(productDetails?.data?.extra_charges?.price || 0)
        : 0;

    const turbanCharge = isTurbanChecked
      ? parseFloat(productDetails?.data?.turban_charges?.price || 0)
      : 0;

    const mojriCharge = isMojriChecked
      ? parseFloat(productDetails?.data?.mojri_charges?.price || 0)
      : 0;

    const stoleCharge = isStoleChecked
      ? parseFloat(productDetails?.data?.stole_charges?.price || 0)
      : 0;

    // const totalPrice =
    //   (priceToUse +
    //     stitchingCharge +
    //     customFitCharge +
    //     turbanCharge +
    //     mojriCharge +
    //     stoleCharge) *
    //   selectedQuantity;

    // ✅ 5. Prepare cart data
    const productData = {
      product_id: productDetails?.data?.id,
      size: selectedSize || "Default Size",
      quantity: selectedQuantity,
      price_per_unit: priceToUse,
      // total_price: totalPrice.toFixed(2),

      // Stitching & custom fit
      stitch_option: selectedStitchOption,
      stitching_charge: stitchingCharge,
      custom_fit_charge: customFitCharge,

      // Accessories
      turban_selected: isTurbanChecked,
      turban_charge: turbanCharge,
      turban_size: isTurbanChecked ? turbanSize : "",

      mojri_selected: isMojriChecked,
      mojri_charge: mojriCharge,
      mojri_size: isMojriChecked ? mojriSize : "",

      stole_selected: isStoleChecked,
      stole_charge: stoleCharge,
    };

    // console.log("🛒 Adding to Cart:", productData);

    addToCart(productData);
  };

  const handleBuyNow = async () => {
    if (selectedQuantity < 1) {
      toast.error("Product is out of stock.");
      return;
    }
    const added = await handleAddToCart();
    if (added) {
      navigate("/cart");
    }
  };

  const isPlusSize = (size) => {
    if (!size) return false;
    return /^[2-9]XL|10XL$/i.test(size);
  };

  const [mssrmntSbmtConfrm, setMssrmntSbmtConfrm] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Please login to submit measurement data.");
      return;
    }

    const savedData = localStorage.getItem("measurementFormData");
    if (!savedData) {
      toast.error(
        "No measurement data found! Please fill the measurement form first."
      );
      return;
    }

    // console.log(savedData);
    const formData = JSON.parse(savedData);

    try {
      setLoading(true);

      const res = await http.post(
        "/user/update-measurement-data",
        {
          product_id: productDetails?.data?.id,
          type: productDetails?.data?.custom_feild_selectOption,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("Response:", res);

      if (res?.data?.success) {
        toast.success(
          res.data.message || "Measurement submitted successfully!"
        );
        localStorage.removeItem("measurementFormData");
        setMssrmntSbmtConfrm(false);
        setShowSizeModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to add data");
      }
    } catch (error) {
      console.error("Error submitting measurement:", error);
      toast.error("Error submitting measurement!");
    } finally {
      setLoading(false);
    }
  };

  const [measurementDetails, SetmeasurementDetails] = useState({});
  useEffect(() => {
    if (!token || !productDetails?.data?.id) return;
    const fetchUserMeasurement = async () => {
      setLoading(true);
      try {
        const measurresponse = await http.get(
          `/user/fetch-measurement-details/${productDetails?.data?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        SetmeasurementDetails(measurresponse.data);
      } catch (error) {
        console.error("Error fetching measurement details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMeasurement();
  }, [token, productDetails?.data?.id]);

  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  // const handleChangePincode = async (e) => {
  //   e.preventDefault();

  //   if (!pincode) {
  //     setDeliveryMsg("Please enter a valid pincode!");
  //     return;
  //   }

  //   try {
  //     const res = await http.post("/check-pincode", {
  //       product_id: productDetails?.data?.id,
  //     });

  //     if (res.data.success) {
  //       setDeliveryMsg(`Delivering to this location by, ${res.data.data}`);
  //     } else {
  //       setDeliveryMsg(res.data.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error checking pincode!");
  //   }
  // };

  const handleChangePincode = (e) => {
    e.preventDefault();

    if (!pincode || pincode.length < 6) {
      setDeliveryMsg("Please enter a valid pincode!");
      return;
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setDeliveryMsg(`Delivering to this location by ${formattedDate}`);
  };

  if (loading) {
    return <Loader />;
  }

  const scrollUp = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollLargeUp = () => {
    if (scrollLargeRef.current) {
      scrollLargeRef.current.scrollBy({
        top: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollLargeDown = () => {
    if (scrollLargeRef.current) {
      scrollLargeRef.current.scrollBy({
        top: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="fvjhfbdf">
        <div className="derthnjmfghu">
          <div className="fgnbdfgdf">
            <div className="container-fluid">
              <div className="breadcrumb" style={{ marginLeft: "3.3rem" }}>
                <ul className="ps-0 mb-4">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li className="mx-2">/</li>
                  <li>
                    <Link
                      to={`/${productDetails?.data?.product_category_slug}`}
                    >
                      {productDetails?.data?.product_category
                        .charAt(0)
                        .toUpperCase() +
                        productDetails?.data?.product_category.slice(1)}
                    </Link>
                  </li>
                  <li className="mx-2">/</li>
                  <li>
                    <Link
                      to={`/${productDetails?.data?.product_category_slug}/${productDetails?.data?.product_sub_category_slug}`}
                    >
                      {productDetails?.data?.product_sub_category
                        .charAt(0)
                        .toUpperCase() +
                        productDetails?.data?.product_sub_category.slice(1)}
                    </Link>
                  </li>
                  <li className="mx-2">/</li>
                  <li>{productDetails?.data?.product_name}</li>
                </ul>
              </div>

              <div className="llmdlkmewlrjwerewr">
                <div className="daojdosjrjwejrwer">
                  <div className="row">
                    <div className="col-lg-6">
                    <div className="deiwhirhwejpekr sticky-top">
                      <Tab.Container
                        id="left-tabs-example"
                        activeKey={activeKey}
                        onSelect={(k) => setActiveKey(k)}
                      >
                        <Row>
                          <Col
                            xs={2}
                            className="small-image-tabs pe-0 position-relative"
                          >
                            {productDetails?.data?.product_image
                              ?.encoded_image_url_5 && (
                              <div
                                onClick={scrollUp}
                                className="small-image-arrow position-absolute rounded-pill small-image-up-arrow"
                              >
                                <i class="fa-solid fa-angle-up"></i>
                              </div>
                            )}

                            <div className="doijijewjuewr" ref={scrollRef}>
                              <Nav variant="pills" className="flex-column">
                                {[
                                  "encoded_image_url_1",
                                  "encoded_image_url_2",
                                  "encoded_image_url_3",
                                  "encoded_image_url_4",
                                  "encoded_image_url_5",
                                  "encoded_image_url_6",
                                  "encoded_image_url_7",
                                  "encoded_image_url_8",
                                  "encoded_image_url_9",
                                ].map((key, index) => {
                                  const img =
                                    productDetails?.data?.product_image?.[key];
                                  return (
                                    img && (
                                      <Nav.Item key={key}>
                                        <Nav.Link eventKey={`img-${index + 1}`}>
                                          <img src={img} alt="" />
                                        </Nav.Link>
                                      </Nav.Item>
                                    )
                                  );
                                })}

                                {/* <Nav.Item className="nijnihninerrr">
                                <Nav.Link eventKey="seventh" onClick={() => handleVideoToggle("seventh")}>
                                  <div className="dowenfrkwer position-relative">
                                    <video>
                                      <source src={productDetails?.data?.product_image?.encoded_vedio_link} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>

                                    <div className="dnweikrwer overflow-hidden rounded-pill position-absolute">
                                      <i class="bi position-absolute bi-play-fill"></i>
                                    </div>
                                  </div>
                                </Nav.Link>
                              </Nav.Item> */}
                                {productDetails?.data?.product_image
                                  ?.encoded_vedio_link && (
                                  <Nav.Item className="nijnihninerrr">
                                    <Nav.Link eventKey="video">
                                      <div className="dowenfrkwer position-relative">
                                        <video muted>
                                          <source
                                            src={
                                              productDetails?.data
                                                ?.product_image
                                                ?.encoded_vedio_link
                                            }
                                            type="video/mp4"
                                          />
                                        </video>

                                        <div className="dnweikrwer overflow-hidden rounded-pill position-absolute">
                                          <i className="bi position-absolute bi-play-fill"></i>
                                        </div>
                                      </div>
                                    </Nav.Link>
                                  </Nav.Item>
                                )}
                              </Nav>
                            </div>

                            {productDetails?.data?.product_image
                              ?.encoded_image_url_5 && (
                              <div
                                onClick={scrollDown}
                                className="small-image-arrow position-absolute rounded-pill small-image-down-arrow"
                              >
                                <i class="fa-solid fa-angle-down"></i>
                              </div>
                            )}
                          </Col>

                          <Col xs={9} className="large-image-tab">
                            <div className="doerfkwerewrewr position-relative">
                              {/* <Tab.Content>
                              {productDetails?.data?.product_image?.encoded_image_url_1 && (
                                <Tab.Pane eventKey="first">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_1}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "first")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_2 && (
                                <Tab.Pane eventKey="second">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_2}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "second")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_3 && (
                                <Tab.Pane eventKey="third">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_3}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "third")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_4 && (
                                <Tab.Pane eventKey="fourth">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_4}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "fourth")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_5 && (
                                <Tab.Pane eventKey="fifth">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_5}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "fifth")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_6 && (
                                <Tab.Pane eventKey="sixth">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_6}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "sixth")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              <Tab.Pane eventKey="seventh" className="odjeowmkoiwewer">
                                <video loop autoplay onClick={handleVideoControl} muted={true}>
                                  <source src={productDetails?.data?.product_image?.encoded_vedio_link} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>

                                <div className="dweuihrweuhre bg-white overflow-hidden rounded-pill position-absolute" onClick={handleMuteToggle}>
                                  <i class={`bi position-absolute ${videoMute ? "bi-volume-up" : "bi-volume-mute"}`}></i>
                                </div>
                              </Tab.Pane>
                            </Tab.Content> */}
                              <Tab.Content>
                                {[
                                  "encoded_image_url_1",
                                  "encoded_image_url_2",
                                  "encoded_image_url_3",
                                  "encoded_image_url_4",
                                  "encoded_image_url_5",
                                  "encoded_image_url_6",
                                  "encoded_image_url_7",
                                  "encoded_image_url_8",
                                  "encoded_image_url_9",
                                ].map((key, index) => {
                                  const img =
                                    productDetails?.data?.product_image?.[key];
                                  const tabKey = `img-${index + 1}`;

                                  return (
                                    img && (
                                      <Tab.Pane key={key} eventKey={tabKey}>
                                        <img
                                          src={img}
                                          alt=""
                                          onClick={(e) =>
                                            handlePGShowModal(e, tabKey)
                                          }
                                          style={{ cursor: "zoom-in" }}
                                        />
                                      </Tab.Pane>
                                    )
                                  );
                                })}

                                {/* ================= VIDEO VIEW ================= */}
                                <Tab.Pane
                                  eventKey="video"
                                  className="odjeowmkoiwewer"
                                >
                                  <video
                                    loop
                                    autoPlay
                                    muted={videoMute}
                                    onClick={handleVideoControl}
                                  >
                                    <source
                                      src={
                                        productDetails?.data?.product_image
                                          ?.encoded_vedio_link
                                      }
                                      type="video/mp4"
                                    />
                                  </video>

                                  <div
                                    className="dweuihrweuhre bg-white rounded-3 px-3 py-1 position-absolute d-flex align-items-center"
                                    onClick={handleMuteToggle}
                                  >
                                    <i
                                      className={`bi ${
                                        videoMute
                                          ? "bi-volume-mute"
                                          : "bi-volume-up"
                                      } me-1`}
                                    ></i>

                                    <span>
                                      {videoMute
                                        ? "Enable sound"
                                        : "Disable sound"}
                                    </span>
                                  </div>
                                </Tab.Pane>
                              </Tab.Content>

                              {/* <div className="gbsdeeer dscnt-prce px-0">
                              <span className="price">30% OFF</span>
                            </div> */}
                              {/* {(productDetails?.data?.new_arrival === "1" || productDetails?.data?.new_arrival === true) && (
                              <div className="cffdrtrvwet nw-arrvl px-0">
                                  <div className="nw-arrvl px-0">
                                    <span className="price">New Arrival</span>
                                  </div>
                              </div>
                            )} */}
                              {(productDetails?.data?.new_arrival === "1" ||
                                productDetails?.data?.new_arrival === true) &&
                                !isVideoTab && (
                                  <div className="cffdrtrvwet nw-arrvl px-0">
                                    <div className="nw-arrvl px-0">
                                      <span className="price">New Arrival</span>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </div>
                    </div>

                    <div className="col-lg-6">
                    <div className="dfghjdfgdfgf ps-2 pt-2">
                      <div className="dsfbsdghfjs mb-1">
                        <div className="fgnjdfgfd">
                          <h2>
                            {productDetails?.data?.product_name}
                            {/* <i className="fa-solid fa-greater-than" /> */}
                          </h2>
                        </div>

                        <div className="dfhdfhd">
                          {/* <p className="mb-0 d-flex align-items-center">
                          <span className="me-2">Share:</span>

                          <img src="/images/whatsapp.png" alt="" />

                          <img src="/images/facebook.png" alt="" />

                          <img src="/images/twitter.png" alt="" />

                          <img src="/images/pinterest.png" alt="" />
                        </p> */}

                          {/* <i className="fa-regular fa-heart" /> */}

                          {user ? (
                            <>
                              <i
                                onClick={() =>
                                  toggleWishlist(productDetails?.data?.id)
                                }
                                className={
                                  wishlistIds.includes(productDetails?.data?.id)
                                    ? "fa-solid fa-heart"
                                    : "fa-regular fa-heart"
                                }
                              ></i>
                            </>
                          ) : (
                            <>
                              <i class="fa-regular fa-heart" onClick={handleLoginModal}></i>
                              <i class="fa-solid d-none fa-heart"></i>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="fhdfgh">
                        <p className="d-flex align-items-center flex-wrap">
                          Item ID: {productDetails?.data?.item_id} |{" "}
                          {productDetails?.data?.views} Views{" "}
                          <i class="bi ms-2 bi-eye"></i>
                        </p>
                      </div>

                      <div className="dfjghdfgdff58 mb-4">
                        <h4 className="d-flex mb-1">
                          <span className="discounted-price d-flex align-items-center">
                            MRP :{" "}
                            {/* {formatPrice(productDetails?.data?.selling_price)} */}
                            {sizeAccordingPrice === 0 ? (formatPrice(productDetails?.data?.selling_price))
                            :(formatPrice(sizeAccordingPrice))
                            }
                          </span> 

                          <span className="gdfg55 d-flex align-items-center ms-2">
                            {/* <i class="bi bi-currency-rupee"></i> */}
                            {formatPrice(productDetails?.data?.mrp_price)}
                          </span>

                          <span className="fghfgg114 d-flex align-items-center ms-2">
                            {productDetails?.data?.discount}%OFF
                          </span>
                        </h4>

                        <p className="mb-0">(Inclusive of all taxes)</p>
                      </div>

                      <div className="jdfbdfgdf">
                        {productDetails?.data?.stitching_option !==
                          "Ready To Wear" && (
                          <div class="diwenjrbwebrwehgrwer">
                            <div className="d-flex align-items-center justify-content-between">
                              <h4 class="pb-2">Stitching Options</h4>

                              <div className="dfhdfhd">
                                  <p className="d-flex align-items-center mb-0">
                                    <span className="me-2">SHARE:</span>

                                    <img
                                      src="/images/whatsapp.png"
                                      alt="Share on Whatsapp"
                                      onClick={handleWhatsAppShare}
                                    />

                                    <img
                                      src="/images/facebook.png"
                                      alt="Share on Facebook"
                                      onClick={handleFacebookShare}
                                    />

                                    <img
                                      src="/images/twitter.png"
                                      alt="Share on Twitter"
                                      onClick={handleTwitterShare}
                                    />

                                    <img
                                      src="/images/pinterest.png"
                                      alt="Share on Pinterest"
                                      onClick={handlePinterestShare}
                                    />
                                  </p>
                                </div>
                            </div>

                            <hr class="mt-0" style={{ width: "91%" }} />                              
                          </div>
                        )}

                        <div className="saoijhdekjwirwer row align-items-center mb-3">
                          {productDetails?.data?.stitching_option !==
                            "Ready To Wear" && (
                            <div className="col-lg-4 col-md-6 col-sm-6 col-6 dowekrwerwer">
                              <input
                                type="radio"
                                name="so"
                                id="unstdf"
                                className="d-none position-absolute"
                                checked={selectedStitchOption === "stitch"}
                                onChange={() =>
                                  handleStitchOptionChange("stitch")
                                }
                              />
                              <label htmlFor="unstdf" className="p-3">
                                {productDetails?.data?.stitching_option}
                                <br />
                                <span>
                                  +{/* <i class="bi bi-currency-rupee"></i>  */}
                                  {formatPrice(
                                    productDetails?.data?.stiching_charges
                                      ?.price ?? 0.0
                                  )}
                                </span>
                              </label>
                            </div>
                          )}

                          {productDetails?.data?.stitching_option !==
                            "Ready To Wear" &&
                            productDetails?.data?.custom_fit?.toLowerCase() ===
                              "yes" && (
                              <div className="col-lg-4 col-md-6 col-sm-6 col-6 dowekrwerwer">
                                <input
                                  type="radio"
                                  name="so"
                                  id="cf"
                                  className="d-none position-absolute"
                                  checked={selectedStitchOption === "customFit"}
                                  onChange={() =>
                                    handleStitchOptionChange("customFit")
                                  }
                                />
                                <label
                                  htmlFor="cf"
                                  className="p-3"
                                  id="cstm-fit-btn"
                                >
                                  Custom-Fit <br />
                                  <span>
                                    +
                                    {/* <i class="bi bi-currency-rupee"></i> */}
                                    {formatPrice(
                                      productDetails?.data?.extra_charges?.price
                                    )}
                                  </span>
                                </label>
                              </div>
                            )}
                        </div>
                        {selectedStitchOption === "customFit" &&
                          productDetails?.data?.stitching_option !==
                            "Ready To Wear" &&
                          productDetails?.data?.custom_fit?.toLowerCase() ===
                            "yes" && (
                            <div className="ikasdnjiknswjirhwer mb-4">
                              <p className="mb-1">
                                Submit Measurement:{" "}
                                <span>
                                  {measurementDetails?.data ? (
                                    <Link
                                      to=""
                                      onClick={(e) => {
                                        e.preventDefault();
                                        toast.warning(
                                          "Measurement details already added!"
                                        );
                                      }}
                                    >
                                      CLICK HERE
                                    </Link>
                                  ) : (
                                    <Link
                                      to=""
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleShowModal(e);
                                      }}
                                    >
                                      CLICK HERE
                                    </Link>
                                  )}
                                </span>{" "}
                                or{" "}
                                <span>
                                  <Link onClick={handleLaterToggle} to="">
                                    Later
                                  </Link>
                                </span>
                              </p>
                              <p className="mb-0">
                                +7 days, for your chosen stitching options.
                              </p>
                            </div>
                          )}

                        {/* id="custmze-otft-btn"> */}
                        {productDetails?.data?.stitching_option ===
                          "Ready To Wear" && (
                          <div className="jlksdeflksdfk">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <label className="form-label asdadadwdwdadad mb-0">
                                <h4>Select Your Size</h4>
                              </label>

                              <div className="dfhdfhd pe-5">
                                <p className="d-flex align-items-center mb-0">
                                  <span className="me-2">SHARE:</span>

                                  <img
                                    src="/images/whatsapp.png"
                                    alt="Share on Whatsapp"
                                    onClick={handleWhatsAppShare}
                                  />

                                  <img
                                    src="/images/facebook.png"
                                    alt="Share on Facebook"
                                    onClick={handleFacebookShare}
                                  />

                                  <img
                                    src="/images/twitter.png"
                                    alt="Share on Twitter"
                                    onClick={handleTwitterShare}
                                  />

                                  <img
                                    src="/images/pinterest.png"
                                    alt="Share on Pinterest"
                                    onClick={handlePinterestShare}
                                  />
                                </p>
                              </div>
                            </div>

                            <hr class="mt-0" style={{ width: "91%" }} />

                            <div className="d-flex align-items-center justify-content-between sdfasdctgerrrrwe mb-3">
                              <div className="select-form-drpdwn weqwthyuytredfgw me-3">
                                <div className="dgndfjgdf">
                                  <select
                                      name="product_size"
                                      id="product_size"
                                      className="form-select"
                                      onChange={handleSizeChange}
                                      value={selectedSize}
                                    >
                                      <option value="">Select Size</option>

                                      {(() => {
                                        const sizeOrder = [
                                          "XXS",
                                          "XS",
                                          "S",
                                          "M",
                                          "L",
                                          "XL",
                                          "2XL",
                                          "3XL",
                                          "4XL",
                                          "5XL",
                                          "6XL",
                                          "7XL",
                                          "8XL",
                                          "9XL",
                                          "10XL",
                                        ];

                                        const flatSizes =
                                          productDetails?.data?.product_allSize?.flatMap((item) => {
                                            const arr = [];
                                            if (item.filter_size) arr.push(item.filter_size);
                                            if (item.plus_sizes && item.plus_sizes !== "0") {
                                              arr.push(item.plus_sizes);
                                            }
                                            return arr;
                                          }) || [];

                                        const uniqueSizes = [...new Set(flatSizes)];

                                        const sortedSizes = uniqueSizes.sort((a, b) => {
                                          const prefixA = a.split("-")[0];
                                          const prefixB = b.split("-")[0];
                                          return sizeOrder.indexOf(prefixA) - sizeOrder.indexOf(prefixB);
                                        });

                                        return sortedSizes.map((size, index) => {
                                          const [prefix, value] = size.split("-");

                                          return (
                                            <option key={index} value={size}>
                                              {`${prefix} - ${value}`}
                                            </option>
                                          );
                                        });
                                      })()}
                                    </select>

                                    {(() => {
                                      const data = productDetails?.data || {};

                                      const plusQty = Number(data.plus_size_quantity || 0);
                                      const rtsQty  = Number(data.rts_quantity || 0);
                                      const mtoQty  = Number(data.mto_quantity || 0);

                                      let availablesdgsfdQty = 0;

                                      if (isPlusSize(selectedSize)) {
                                        // ✅ PLUS SIZE → only plus stock matters
                                        availablesdgsfdQty = plusQty;
                                      } else {
                                        // ✅ Normal size → RTS first, then MTO
                                        availablesdgsfdQty = rtsQty > 0 ? rtsQty : mtoQty;
                                      }

                                      return availablesdgsfdQty > 0 && availablesdgsfdQty <= 5 ? (
                                        <p className="mt-0">Only few left</p>
                                      ) : null;
                                    })()}
                                </div>
                              </div>

                              <div className="select-form-side">
                                <div className="dokewhkjrhuiwerwer skdncfjsdbcfksdnf">
                                  <button
                                    className="btn btn-main px-0"
                                    onClick={() =>
                                      setShowSizeGuide(!showSizeGuide)
                                    }
                                  >
                                    <img src="/images/ruler.png" alt="" /> Size
                                    Guide
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="row">
                        <div className="fvgndfjgf">
                          <label htmlFor="" className="form-label me-1 mb-2">
                            Qty:
                          </label>

                          <select
                            name="product_quantity"
                            id="product_quantity"
                            value={selectedQuantity}
                            onChange={(e) =>
                              handleQuantitySelect(Number(e.target.value))
                            }
                            disabled={!availableQty}
                            className="form-select weqwthyuytredfgw select-form-drpdwn"
                          > 
                            {availableQty > 0 ? (
                                Array.from(
                                  { length: Math.min(availableQty, 5) },
                                  (_, i) => i + 1
                                ).map((qty) => (
                                  <option key={qty} value={qty}>
                                    {qty}
                                  </option>
                                ))
                              ) : (
                                <option value="">Out of Stock</option>
                              )}
                          </select>
                        </div>
                      </div>

                      {(productDetails?.data?.matching_turban === "1" ||
                        productDetails?.data?.matching_turban === true) && (
                        <div className="sadfvfghbrsd mt-4">
                          <div className="col-lg-12">
                            <div className="kcwenjkkwenkrhwer">
                              <div className="opjdjwerwer mb-3 col-lg-9 row align-items-center justify-content-between">
                                <div className="doweriwejrwer col-lg-6 col-md-8 col-sm-8 col-8">
                                  <div class="checkbox-wrapper-33">
                                    <label class="checkbox">
                                      <input
                                        class="checkbox__trigger visuallyhidden"
                                        type="checkbox"
                                        checked={isTurbanChecked}
                                        onChange={(e) =>
                                          setIsTurbanChecked(e.target.checked)
                                        }
                                      />

                                      <span class="checkbox__symbol">
                                        <svg
                                          aria-hidden="true"
                                          class="icon-checkbox"
                                          width="28px"
                                          height="28px"
                                          viewBox="0 0 28 28"
                                          version="1"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M4 14l8 7L24 7"></path>
                                        </svg>
                                      </span>

                                      <p class="checkbox__textwrapper">
                                        Matching Turban
                                      </p>
                                    </label>
                                  </div>
                                </div>

                                <p className="chngd-price mb-0 col-lg-4 col-md-4 col-sm-4 col-4">
                                  {/* <i class="bi bi-currency-rupee"></i> */}
                                  {formatPrice(
                                    productDetails?.data?.turban_charges
                                      ? productDetails?.data?.turban_charges
                                          ?.price
                                      : "0.00"
                                  )}
                                </p>
                              </div>

                              <div className="slkdnfkmslkmr d-flex justify-content-between align-items-center">
                                <div className="select-form-drpdwn dfgsfsfggfrfreerr me-3">
                                  <select
                                    name="product_turbanSize"
                                    className="form-select"
                                    id="product_turbanSize"
                                    disabled={!isTurbanChecked}
                                  >
                                    <option selected value="">
                                      Select size
                                    </option>
                                    <option value="20">20</option>
                                    <option value="20.5">20.5</option>
                                    <option value="21">21</option>
                                    <option value="21.5">21.5</option>
                                    <option value="22">22</option>
                                    <option value="22.5">22.5</option>
                                    <option value="23">23</option>
                                    <option value="23.5">23.5</option>
                                    <option value="24">24</option>
                                    <option value="24">24.5</option>
                                    <option value="25">25</option>
                                    <option value="25.5">25.5</option>
                                    <option value="26">26</option>
                                  </select>
                                </div>

                                <div className="select-form-side">
                                  <p
                                    className="chrt-sze mb-0"
                                    onClick={() => setTurbanModal(!turbanModal)}
                                  >
                                    <i class="fa-solid fa-maximize"></i> Size
                                    Chart
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {(productDetails?.data?.matching_stole === "1" ||
                        productDetails?.data?.matching_stole === true) && (
                        <div className="sadfvfghbrsd mt-4">
                          <div className="col-lg-12">
                            <div className="kcwenjkkwenkrhwer">
                              <div className="opjdjwerwer mb-3 row col-9 align-items-center justify-content-between">
                                <div className="doweriwejrwer col-lg-6 col-md-8 col-sm-8 col-8">
                                  <div class="checkbox-wrapper-33">
                                    <label class="checkbox">
                                      <input
                                        class="checkbox__trigger visuallyhidden"
                                        type="checkbox"
                                        checked={isStoleChecked}
                                        onChange={(e) =>
                                          setIsStoleChecked(e.target.checked)
                                        }
                                      />

                                      <span class="checkbox__symbol">
                                        <svg
                                          aria-hidden="true"
                                          class="icon-checkbox"
                                          width="28px"
                                          height="28px"
                                          viewBox="0 0 28 28"
                                          version="1"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M4 14l8 7L24 7"></path>
                                        </svg>
                                      </span>

                                      <p class="checkbox__textwrapper">
                                        Matching Stole
                                      </p>
                                    </label>
                                  </div>
                                </div>

                                <p className="chngd-price mb-0 col-lg-4 col-md-4 col-sm-4 col-4">
                                  {/* <i class="bi bi-currency-rupee"></i> */}
                                  {formatPrice(
                                    productDetails?.data?.stole_charges
                                      ? productDetails?.data?.stole_charges
                                          ?.price
                                      : "0.00"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {(productDetails?.data?.matching_mojari === "1" ||
                        productDetails?.data?.matching_mojari === true) && (
                        <div className="sadfvfghbrsd mt-4">
                          <div className="col-lg-12">
                            <div className="kcwenjkkwenkrhwer">
                              <div className="opjdjwerwer mb-3 row col-9 align-items-center justify-content-between">
                                <div className="doweriwejrwer col-lg-8 col-md-9 col-sm-9 col-9">
                                  <div class="checkbox-wrapper-33">
                                    <label class="checkbox">
                                      <input
                                        class="checkbox__trigger visuallyhidden"
                                        type="checkbox"
                                        checked={isMojriChecked}
                                        onChange={() =>
                                          setIsMojriChecked(!isMojriChecked)
                                        }
                                      />

                                      <span class="checkbox__symbol">
                                        <svg
                                          aria-hidden="true"
                                          class="icon-checkbox"
                                          width="28px"
                                          height="28px"
                                          viewBox="0 0 28 28"
                                          version="1"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M4 14l8 7L24 7"></path>
                                        </svg>
                                      </span>

                                      <p class="checkbox__textwrapper">
                                        Matching Mojri
                                      </p>
                                    </label>
                                  </div>
                                </div>

                                <p className="chngd-price mb-0 col-lg-4 col-md-3 col-sm-3 col-3">
                                  {/* <i class="bi bi-currency-rupee"></i> */}
                                  {formatPrice(
                                    productDetails?.data?.mojri_charges
                                      ? productDetails?.data?.mojri_charges
                                          ?.price
                                      : "0.00"
                                  )}
                                </p>
                              </div>

                              <div className="slkdnfkmslkmr d-flex justify-content-between align-items-center">
                                <div className="select-form-drpdwn dfgsfsfggfrfreerr me-3">
                                  <select
                                    name="product_mojriSize"
                                    className="form-select"
                                    id="product_mojriSize"
                                    disabled={!isMojriChecked}
                                  >
                                    <option value="" selected>
                                      Select Size
                                    </option>

                                    {/* INDIA / UK */}
                                    <option disabled className="disableDdlItems">
                                      -- INDIA / UK --
                                    </option>
                                    {[4,5,6,7,8,9,10,11,12,13].map(size => (
                                      <option key={`IN/UK-${size}`} value={`IN/UK ${size}`}>
                                        IN / UK Size {size}
                                      </option>
                                    ))}

                                    {/* US & CANADA */}
                                    <option disabled className="disableDdlItems">
                                      -- US & Canada --
                                    </option>
                                    {[5,6,7,8,9,10,11,12,13,14].map(size => (
                                      <option key={`US-canada-${size}`} value={`US-Canada ${size}`}>
                                        US & Canada Size {size}
                                      </option>
                                    ))}

                                    {/* EURO */}
                                    <option disabled className="disableDdlItems">
                                      -- EURO --
                                    </option>
                                    {[38,39,40,41,42,43,44,45,46,47].map(size => (
                                      <option key={`EU-${size}`} value={`EU ${size}`}>
                                        EURO Size {size}
                                      </option>
                                    ))}

                                    {/* AUSTRALIA */}
                                    <option disabled className="disableDdlItems">
                                      -- AUSTRALIA --
                                    </option>
                                    {[4,5,6,7,8,9,10,11,12,13].map(size => (
                                      <option key={`AUS-${size}`} value={`AUS ${size}`}>
                                        AUS Size {size}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="select-form-side">
                                  <p
                                    className="chrt-sze mb-0"
                                    onClick={() => setMojriModal(!mojriModal)}
                                  >
                                    <i class="fa-solid fa-maximize"></i> Size
                                    Chart
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="dowejkrnwerwer justify-content-between d-flex align-items-center mt-4">
                        <div className="doenwkjriwerwer">
                          <h4 className="mb-2 me-2">
                            You Pay :&nbsp;
                            <span>
                              {/* <i class="fa-solid fa-indian-rupee-sign"></i> */}
                              {formatPrice(finalPrice.toFixed(2))}
                            </span>
                          </h4>

                          <p class="mb-0">(Inclusive of all services)</p>
                        </div>

                        <div className="dfgndfjhgdf sdfgsefgderrqewertwr">
                          {user ? (
                            <>
                              <button
                                className="btn btn-main px-3 me-4"
                                onClick={handleAddToCart}
                                disabled={cartLoading || isOutOfStock}
                              >
                                <i className="bi bi-bag me-1"></i>
                                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                              </button>
                              <button
                                className="btn btn-main btn-transparent px-3"
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                              >
                                <i className="bi bi-bag me-1"></i>
                                {isOutOfStock ? "Out of Stock" : "Buy Now"}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-main px-3 me-4"
                                onClick={handleLoginModal}
                              >
                                <i class="bi bi-bag me-1"></i>Add to Cart
                              </button>

                              <button
                                className="btn btn-main btn-transparent px-3"
                                onClick={handleLoginModal}
                              >
                                <i class="bi bi-bag me-1"></i> Buy Now
                              </button>
                            </>
                          )}
                          
                        </div>
                      </div>

                      <div className="kjidbwejgrwerwer position-relative mt-5">
                        <i class="bi bi-geo-alt position-absolute"></i>

                        <form onSubmit={handleChangePincode}>
                          <input
                            type="number"
                            name="pincode"
                            className="form-control"
                            placeholder="ex. 700001"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            style={{ paddingRight: "125px" }}
                          />

                          <button
                            type="submit"
                            className="btn btn-main position-absolute"
                          >
                            Check
                          </button>
                        </form>
                      </div>

                      {deliveryMsg && (
                        <div className="doiejnwkhrwer mt-4">
                          <p className="mb-1">
                            {/* Delivering to GURDASPUR by 18th July 2025. Order within
                          11h 49m */}
                            {deliveryMsg}
                          </p>
                        </div>
                      )}

                      <div className="diwenjrbwebrwehgrwer mt-5">
                        <h4 className="pb-2">Customer Info</h4>

                        <hr className="mt-0" style={{ width: "86%" }} />

                        <div className="row">
                          <div className="col-6">
                            <ul className="mb-0 ps-0">
                              <li>
                                {productDetails?.data?.non_returnable !==
                                  "" && (
                                  <>
                                    <i className="bi me-1 bi-check2-circle"></i>
                                    {productDetails?.data?.non_returnable}
                                  </>
                                )}
                              </li>
                            </ul>
                          </div>

                          <div className="col-6">
                            <ul className="mb-0 ps-0">
                              <li>
                                {productDetails?.data?.premium_quality !==
                                  "" && (
                                  <>
                                    <i className="bi me-1 bi-check2-circle"></i>
                                    {productDetails?.data?.premium_quality}
                                  </>
                                )}
                              </li>
                            </ul>
                          </div>

                          <div className="col-6">
                            <ul className="mb-0 ps-0">
                              <li>
                                {productDetails?.data?.free_shipping !== "" && (
                                  <>
                                    <i className="bi me-1 bi-check2-circle"></i>
                                    {productDetails?.data?.free_shipping}
                                  </>
                                )}
                              </li>
                            </ul>
                          </div>

                          <div className="col-6">
                            <ul className="mb-0 ps-0">
                              <li>
                                {productDetails?.data?.personalized_styling !==
                                  "" && (
                                  <>
                                    <i className="bi me-1 bi-check2-circle"></i>
                                    {productDetails?.data?.personalized_styling}
                                  </>
                                )}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="diwenjrbwebrwehgrwer mt-5">
                        <p className="sidifsdiyhr pb-2 me-2 mb-0">
                          <span>Offers - </span> Coupon
                          are visible on checkout page do not forget "Tap To
                          Apply"
                        </p>

                        <hr className="mt-0" style={{ width: "90%" }} />

                        <div className="injdewrwer">
                          {/* <h4 className="mb-0 me-2">Coupon Code -</h4> */}

                          <div className="oijdmkmeiwrew d-flex align-items-center">
                            {productDetails?.data?.coupon_code &&
                              productDetails.data.coupon_code
                                .split(" , ") // Split by comma to get each coupon
                                .map((coupon, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="copn-cde text-center py-2 px-3 mb-2 me-5 rounded-2"
                                    >
                                      <h5 className="mb-0">{coupon.trim()}</h5>
                                    </div>
                                  );
                                })}
                          </div>
                        </div>
                      </div>

                      <div className="diwenjrbwebrwehgrwer mt-5">
                        <div className="d-flex align-items-center mb-2">
                          <h4 className="pb-2 me-2 mb-0">Speak To Us</h4>

                          <div className="doiejnwkhrwer">
                            <p className="mb-0">
                              If need it by a specific date?
                            </p>
                          </div>
                        </div>

                        <hr className="mt-0" style={{ width: "86%" }} />

                        <div className="dopwejoirjhwer row">
                          <div className="col-lg-4">
                            <button
                              className="btn w-100 btn-transparent"
                              onClick={() => setChatProfileDetailsShow(true)}
                            >
                              <i class="bi me-1 bi-chat-left-text"></i> Chat Now
                            </button>
                          </div>

                          <div className="col-lg-4">
                            <button
                              className="btn w-100 btn-main"
                              onClick={() =>
                                (window.location.href = "tel:7003672926")
                              }
                            >
                              <i class="bi me-1 bi-telephone-forward"></i> Call
                              Us
                            </button>
                          </div>

                          <div className="col-lg-4">
                            <button className="btn w-100 btn-transparent">
                              <i class="bi me-1 bi-envelope"></i> Mail Us
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>

                <div className="dwgerrfwefwrwrer">
                  <div className="row">
                    <div className="col-lg-9 mt-5">
                    <div className="odnwejihrwerwer mt-5">
                      <div className="dowehjkrhweirwer mb-5">
                        <div className="podmkwejrwer d-flex justify-content-between align-items-center">
                          <h4 className="mb-0">Product Descriptions</h4>

                          <i class="bi bi-chevron-down"></i>
                        </div>

                        <hr />

                        <p className="mb-4">
                          {productDetails?.data?.product_description}
                        </p>

                        <div className="dikewnirhwerjwer">
                          <Tabs
                            defaultActiveKey="specification"
                            id="uncontrolled-tab-example"
                            className="sticky-top mb-3"
                          >
                            <Tab eventKey="specification" title="Specification">
                              <div className="row">
                                <div className="col-lg-6 mb-4">
                                  <div className="idnewihrwer_inner">
                                    {productDetails?.data?.no_of_component !==
                                      null &&
                                      productDetails?.data?.no_of_component !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            No of Component <br />{" "}
                                            <span>
                                              {
                                                productDetails?.data
                                                  ?.no_of_component
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}
                                    {productDetails?.data?.type_of_work !==
                                      null &&
                                      productDetails?.data?.type_of_work !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Type of Work <br />{" "}
                                            <span>
                                              {
                                                productDetails?.data
                                                  ?.type_of_work
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.color !== null &&
                                      productDetails?.data?.color !== "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Color <br />{" "}
                                            <span>
                                              {productDetails?.data?.color}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.dupatta_color !==
                                      null &&
                                      productDetails?.data?.dupatta_color !==
                                        "0" && ( // optional: also check empty string
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Dupatta Color <br />
                                            <span>
                                              {
                                                productDetails?.data
                                                  ?.dupatta_color
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.jacket_color !==
                                      null &&
                                      productDetails?.data?.jacket_color !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Jacket Color <br />
                                            <span>
                                              {
                                                productDetails?.data
                                                  ?.jacket_color
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.bottom_closure !==
                                      null &&
                                      productDetails?.data?.bottom_closure !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Bottom Closure <br />
                                            <span>
                                              {
                                                productDetails?.data
                                                  ?.bottom_closure
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.inner_lining !==
                                      null &&
                                      productDetails?.data?.inner_lining !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Inner Lining <br />
                                            <span>
                                              {
                                                productDetails?.data
                                                  ?.inner_lining
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.weight !== null &&
                                      productDetails?.data?.weight !== "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Weight Details <br />
                                            <span>
                                              Approximate Product Weight:{" "}
                                              {productDetails?.data?.weight}
                                            </span>
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                  <div className="idnewihrwer_inner">
                                    {productDetails?.data?.component !== null &&
                                      productDetails?.data?.component !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Components <br />{" "}
                                            <span>
                                              {productDetails?.data?.component}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.occasion !== null &&
                                      productDetails?.data?.occasion !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Occasions <br />{" "}
                                            <span>
                                              Suitable for{" "}
                                              {productDetails?.data?.occasion}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.celebrity !== null &&
                                      productDetails?.data?.celebrity !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Celebrity <br />{" "}
                                            <span>
                                              {productDetails?.data?.celebrity}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.pattern !== null &&
                                      productDetails?.data?.pattern !== "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Pattern <br />{" "}
                                            <span>
                                              {productDetails?.data?.pattern}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.fabric !== null &&
                                      productDetails?.data?.fabric !== "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Material <br />{" "}
                                            <span>
                                              {productDetails?.data?.fabric}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.fit_type !== null &&
                                      productDetails?.data?.fit_type !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Fit <br />{" "}
                                            <span>
                                              Fit:{" "}
                                              {productDetails?.data?.fit_type}
                                            </span>
                                          </p>
                                        </div>
                                      )}

                                    {productDetails?.data?.care_instruction !==
                                      null &&
                                      productDetails?.data?.care_instruction !==
                                        "0" && (
                                        <div className="odjjkwehrihwerewr mb-4">
                                          <p>
                                            Care Instruction <br />{" "}
                                            <span>
                                              {" "}
                                              {
                                                productDetails?.data
                                                  ?.care_instruction
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="col-lg-12">
                                  <div className="idnewihrwer_inner dsclmer p-3">
                                    <div className="odjjkwehrihwerewr">
                                      <p className="mb-0">
                                        Disclaimer <br />{" "}
                                        <span>
                                          This product will be exclusively
                                          handcrafted for you, making the color,
                                          texture, and pattern slightly vary
                                          from the image shown, due to the high
                                          resolution of photography and
                                          processes involved. Accessories shown
                                          in the image are not a part of the
                                          product; they are for presentation
                                          purposes only.
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </div>

                      <div className="dowehjkrhweirwer mlkdfgmlkmlkmlk">
                        <div className="podmkwejrwer d-flex justify-content-between align-items-center">
                          <h4 className="mb-0">Shipping & Returns</h4>

                          <i class="bi bi-chevron-down"></i>
                        </div>

                        <hr className="mb-4" />

                        <p className="mb-1">
                          Product will be shipped by,{" "}
                          {getEstimatedShippingDate(
                            productDetails?.data?.shipping_time
                          )}
                        </p>

                        <p className="mb-3">
                          For customizations & early delivery, chat with us on
                          WhatsApp at{" "}
                          <a
                            href="https://wa.me/917003672926"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            +91 7003672926
                          </a>{" "}
                          or call us at
                          <a href="tel:7003672926"> 7003672926</a>
                        </p>

                        <p className="mb-2">Return Policy</p>

                        <p>
                          Returnable within 2 days of delivery (3 days for Gold
                          members). Custom-made orders are not returnable.
                          Product's original tags, if attached, must be intact
                          for a successful return. If the original tags are
                          missing, VinHem Fashion may decline the return request
                          and send the product back to the customer & return
                          handling charges would be applicable. For more details
                          click on
                          <Link to="/return-policy"> More Details</Link>
                        </p>
                      </div>

                      <p className="mb-1">Manufactured/Packed & Marketed By-</p>

                      <p className="mb-0">
                        <b>VinHem Fashion Pvt Ltd, Assembled in india</b>
                      </p>
                    </div>
                    </div>

                    <div className="col-lg-3 mt-5">
                    <div className="odnwejihrwerwer sticky-top mt-5">
                      <div className="dowehjkrhweirwer mb-5">
                        <div className="podmkwejrwer dowehkrhweor">
                          <h4 className="mb-0" style={{textAlign: "center"}}>Matching Products</h4>
                        </div>

                        <hr />

                        <div
                          className="coisdefisdhifhsdjifjhosd doiwejrjwejr"
                          style={{ height: "100vh" }}
                        >
                          <Swiper
                            modules={[
                              Autoplay,
                              Pagination,
                              Navigation,
                              Mousewheel,
                            ]}
                            direction="vertical"
                            slidesPerView={4}
                            spaceBetween={15}
                            loop={true}
                            mousewheel={true}
                            pagination={{ clickable: true }}
                            navigation={true}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                            className="mySwiper"
                            style={{ height: "100%" }}
                          >
                            {productDetails?.data?.matching_product.map(
                              (matchingProduct) => (
                                <SwiperSlide key={matchingProduct.id}>
                                  <div className="dfgjhbdfg matching-products sdfvdscsddfgdfg p-2 mb-3">
                                    <Link
                                      to={`/products/${matchingProduct.slug}`}
                                    >
                                      <div className="images">
                                        <div className="image d-flex position-relative">
                                          <div className="doiewjkrniuwewer position-relative col-lg-4 overflow-hidden">
                                            {/* <img src={matchingProduct?.encoded_image_url_2} alt={matchingProduct.product_name}/> */}
                                            <img
                                              className=""
                                              src={
                                                matchingProduct?.encoded_image_url_1 ||
                                                "/images/no-preview.jpg"
                                              }
                                              alt={
                                                matchingProduct?.product_name ||
                                                "Product image"
                                              }
                                            />
                                          </div>

                                          <div className="fdbdfgdfgdf col-lg-8">
                                            <h4>
                                              {matchingProduct.product_name}
                                            </h4>

                                            <h5>
                                              {formatPrice(
                                                matchingProduct.selling_price
                                              )}
                                            </h5>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </SwiperSlide>
                              )
                            )}
                          </Swiper>
                        </div>

                        <div className="coisdefisdhifhsdjifjhosd derwerwrrr d-none">
                          <Swiper
                            {...swiperMatchingConfig}
                            className="mySwiper"
                            style={{ height: "100%" }}
                          >
                            {productDetails?.data?.matching_product.map(
                              (matchingProduct) => (
                                <SwiperSlide key={matchingProduct.id}>
                                  <div className="dfgjhbdfg sdfvdscsddfgdfg p-2 mb-3">
                                    <Link
                                      to={`/products/${matchingProduct.slug}`}
                                    >
                                      <div className="images">
                                        <div className="image d-flex position-relative">
                                          <div className="doiewjkrniuwewer position-relative col-lg-4 overflow-hidden">
                                            <img
                                              src={
                                                matchingProduct?.encoded_image_url_2
                                              }
                                              alt={matchingProduct.product_name}
                                            />

                                            <img
                                              className="first"
                                              src={
                                                matchingProduct?.encoded_image_url_1
                                              }
                                              alt={matchingProduct.product_name}
                                            />
                                          </div>

                                          <div className="fdbdfgdfgdf col-lg-8">
                                            <h4>
                                              {matchingProduct.product_name}
                                            </h4>

                                            <h5>
                                              {formatPrice(
                                                matchingProduct.selling_price
                                              )}
                                            </h5>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </SwiperSlide>
                              )
                            )}
                          </Swiper>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="iuehwirwerweoih_djoej">
            <div className="container-fluid">
              <div className="col-lg-12">
                <div className="diweurbhwer_inner mt-4">
                  <div className="dfbgghdfdfgdf">
                    <div className="sdf58sdfs">
                      <h4 className="pb-2">Similar Items</h4>
                    </div>

                    <div className="fgjhdfgdfgdf py-4">
                      <Swiper {...swiperConfig}>
                        {productDetails?.data?.similar_product.map(
                          (featuredProduct) => (
                            <SwiperSlide key={featuredProduct.id}>
                              <FeaturedProducts
                                featuredProduct={featuredProduct}
                              />
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="diweurbhwer_inner mt-4">
                  <div className="dfbgghdfdfgdf">
                    <div className="sdf58sdfs">
                      <h4 className="pb-2">Customer Also Viewed</h4>
                    </div>

                    <div className="fgjhdfgdfgdf py-4">
                      <Swiper {...swiperConfig}>
                        {/* {featuredProducts.map((featuredProduct) => (
                          <SwiperSlide key={featuredProduct.id}>
                            <FeaturedProducts
                              featuredProduct={featuredProduct}
                            />
                          </SwiperSlide>
                        ))} */}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="diweurbhwer_inner mt-4">
                  <RecentlyViewed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MeasurementForm
        mssrmntSbmtConfrm={mssrmntSbmtConfrm}
        setMssrmntSbmtConfrm={setMssrmntSbmtConfrm}
        showSizeModal={showSizeModal}
        setShowSizeModal={setShowSizeModal}
        productDetails={productDetails}
      />

      {/*chat now modal*/}

      {!chatProfileDetailsShow && (
        <div
          className="dkwejkrhiwenrower position-fixed"
          onClick={() => setChatProfileDetailsShow(!chatProfileDetailsShow)}
        >
          <i class="bi text-white position-absolute bi-chat-dots-fill"></i>
        </div>
      )}

      {chatProfileDetailsShow && (
        <ChatProfileDetails
          setChatProfileDetailsShow={setChatProfileDetailsShow}
        />
      )}

      {/* size guide size */}

      <div
        className={`${
          showSizeGuide
            ? "size-guide-modal-backdrop"
            : "size-guide-modal-backdrop size-guide-modal-backdrop-hide"
        } w-100 h-100 position-fixed`}
      ></div>

      <div
        className={`${
          showSizeGuide
            ? "size-guide-modal"
            : "size-guide-modal size-guide-modal-hide"
        } position-fixed bg-white`}
      >
        <div className="size-guide-modal-header d-flex align-items-center justify-content-between px-4 py-3">
          {productDetails?.data?.product_category?.toLowerCase() ===
            "accessories" && (
            <h4 className="mb-1">
              {`Size Chart for ${productDetails?.data?.product_sub_category?.toLowerCase() ===
                "foot wear"
                  ? productDetails?.data?.product_sub_category
                  : productDetails?.data?.product_category}`}
            </h4>
          )}
          {productDetails?.data?.product_category?.toLowerCase() !==
            "accessories" && (
              <h4 className="mb-1">
                {`Size Chart for ${productDetails?.data?.product_category}`}
              </h4>
          )}

          <i
            class="fa-solid fa-xmark"
            onClick={() => setShowSizeGuide(false)}
          ></i>
        </div>

        <div className="dkewhrwerwer px-4 py-3">
          <div className="dkjjenwjknkweh">
            <div className="row align-items-center">
              <div className="col-lg-2 mb-3">
                <div className="diewnrjhwerwer">
                  <img src={productDetails?.data?.encoded_image_url_1} alt="" />
                </div>
              </div>

              <div className="col-lg-10">
                <div className="dlowenjkrnwkeh">
                  <ul>
                    <li className="mb-3">
                      If your bare chest size measurement is 40 inches, you
                      should select size 40 only from the product page. The "Top
                      Chest" attribute in the size chart refers to the garment's
                      chest size. It is inclusive of the required 3 to 4 inches
                      loosening, to ensure the right fit.
                    </li>

                    <li>
                      If your bare chest measurement falls between 2 sizes i.e.
                      37 inches, you should select size 38.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="doenwkhrkwenjkrwer">
            <DesignerSizeChart productDetails={productDetails} />
          </div>
        </div>
      </div>

      {/* mssrmnt sbmt cnfrmtn */}

      <div
        className={`${
          mssrmntSbmtConfrm
            ? "mssrmnt-sbmt-modal-backdrop"
            : "mssrmnt-sbmt-modal-backdrop mssrmnt-sbmt-modal-backdrop-hide"
        } w-100 h-100 position-fixed`}
      ></div>

      <div
        className={`${
          mssrmntSbmtConfrm
            ? "mssrmnt-sbmt-modal"
            : "mssrmnt-sbmt-modal mssrmnt-sbmt-modal-hide"
        } position-fixed bg-white`}
      >
        <div className="size-guide-modal-header d-flex align-items-center justify-content-end px-4 py-2">
          {/* <h4 className="mb-0"></h4> */}

          <i
            class="fa-solid fa-xmark"
            onClick={() => setMssrmntSbmtConfrm(false)}
          ></i>
        </div>

        <div className="dkewhrwerwer px-4 py-3">
          <div className="dkjjenwjknkweh text-center">
            <h4>Once submitted then cannot be changed</h4>

            <p>Do you want to proceed?</p>

            <div className="dfsfdtgrefcd row align-items-center justify-content-between">
              <div className="col-lg-5 mb-3">
                <button
                  className="btn btn-main w-100"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Yes, Proceed"}
                </button>
              </div>

              <div className="col-lg-5 mb-3">
                <button
                  onClick={() => setMssrmntSbmtConfrm(false)}
                  className="btn btn-main w-100"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* later modal */}

      <div
        className={`${
          showLaterModal
            ? "later-modal-backdrop"
            : "later-modal-backdrop later-modal-backdrop-hide"
        } w-100 h-100 position-fixed`}
      ></div>

      <div
        className={`${
          showLaterModal ? "later-modal" : "later-modal later-modal-hide"
        } position-fixed bg-white`}
      >
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom-0">
          {/* <h4 className="mb-0"></h4> */}

          <i class="bi bi-x-lg" onClick={handleLaterClose}></i>
        </div>

        <div className="later-modal-body text-center p-4 pt-0">
          <h4>
            You can place your order successfully, but you must provide your
            measurements first for shipping.
          </h4>

          <button onClick={handleLaterClose} className="btn btn-main mt-4 px-4">
            Ok
          </button>
        </div>
      </div>

      {/* share modal */}

      <div
        className={`${
          shareModal
            ? "share-social-modal-backdrop"
            : "share-social-modal-backdrop share-social-modal-backdrop-hide"
        } w-100 h-100 position-fixed`}
      ></div>

      <div
        className={`${
          shareModal
            ? "share-social-modal"
            : "share-social-modal share-social-modal-hide"
        } position-fixed bg-white`}
      >
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <h4 className="mb-0">SHARE</h4>

          <i class="bi bi-x-lg" onClick={() => setShareModal(false)}></i>
        </div>

        <div className="s-s-m-options d-flex p-3 align-items-center justify-content-center">
          <div className="dmnewknoirwer me-3 whtsapp-icon position-relative rounded-pill">
            <i
              class="bi position-absolute fa-2x text-white bi-whatsapp"
              onClick={handleWhatsAppShare}
            ></i>
          </div>

          <div className="dmnewknoirwer me-3 facebook-icon position-relative rounded-pill">
            <i
              class="fa-brands position-absolute fa-2x text-white fa-facebook-f"
              onClick={handleFacebookShare}
            ></i>
          </div>

          <div className="dmnewknoirwer instagram-icon position-relative rounded-pill">
            <i
              class="bi position-absolute fa-2x text-white bi-instagram"
              onClick={handleInstagramShare}
            ></i>
          </div>
        </div>
      </div>

      {/* turbon chart size */}

      <div
        className={`${
          turbanModal
            ? "turbon-chart-modal-backdrop"
            : "turbon-chart-modal-backdrop turbon-chart-modal-backdrop-hide"
        } w-100 h-100 position-fixed`}
      ></div>

      <div
        className={`${
          turbanModal
            ? "turbon-chart-modal"
            : "turbon-chart-modal turbon-chart-modal-hide"
        } position-fixed bg-white`}
      >
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <h4 className="mb-0">Turbon Chart Size & Mojri Size Chart </h4>

          <i class="bi bi-x-lg" onClick={() => setTurbanModal(false)}></i>
        </div>

        <div className="s-s-m-options p-3 align-items-center justify-content-center">
          <img src="/images/turban.jpg" className="img-fluid w-100" alt="" />
        </div>
      </div>

      {/* mojri chart size */}

      <div
        className={`${
          mojriModal
            ? "mojri-chart-modal-backdrop"
            : "mojri-chart-modal-backdrop mojri-chart-modal-backdrop-hide"
        } w-100 h-100 position-fixed`}
      ></div>

      <div
        className={`${
          mojriModal
            ? "mojri-chart-modal"
            : "mojri-chart-modal mojri-chart-modal-hide"
        } position-fixed bg-white`}
      >
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <h4 className="mb-0">Mojri Chart Size</h4>

          <i class="bi bi-x-lg" onClick={() => setMojriModal(false)}></i>
        </div>

        <div className="">
          <img src="/images/Mojri.png" className="img-fluid w-100" alt="" />
        </div>
      </div>

      {/*pd gllery*/}

      {/* --- Modal with Zoom --- */}
      <Modal
        show={showModal}
        onHide={handlePGClose}
        centered
        size="xl"
        className="zoom-gallery-modal overflow-hidden"
      >
        <Modal.Body className="mt-0 p-0 ps-3">
          <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
            <Row className="sdgdffwesfdf">
              {/* ================= SMALL THUMBNAILS ================= */}
              <Col xs={2} className="small-image-tabs pt-1 pe-0">
                <div className="position-relative">
                  {productDetails?.data?.product_image?.encoded_image_url_5 && (
                    <div
                      onClick={scrollLargeUp}
                      className="small-image-arrow position-absolute rounded-pill small-image-up-arrow"
                    >
                      <i class="fa-solid fa-angle-up"></i>
                    </div>
                  )}

                  <Nav
                    variant="pills"
                    className="flex-column"
                    ref={scrollLargeRef}
                  >
                    {[
                      "encoded_image_url_1",
                      "encoded_image_url_2",
                      "encoded_image_url_3",
                      "encoded_image_url_4",
                      "encoded_image_url_5",
                      "encoded_image_url_6",
                      "encoded_image_url_7",
                      "encoded_image_url_8",
                      "encoded_image_url_9",
                    ].map((key, index) => {
                      const img = productDetails?.data?.product_image?.[key];
                      const tabKey = `img-${index + 1}`;

                      return (
                        img && (
                          <Nav.Item key={key}>
                            <Nav.Link eventKey={tabKey}>
                              <img src={img} alt="" />
                            </Nav.Link>
                          </Nav.Item>
                        )
                      );
                    })}
                  </Nav>

                  {productDetails?.data?.product_image?.encoded_image_url_5 && (
                    <div
                      onClick={scrollLargeDown}
                      className="small-image-arrow position-absolute rounded-pill small-image-down-arrow"
                    >
                      <i class="fa-solid fa-angle-down"></i>
                    </div>
                  )}
                </div>
              </Col>

              {/* ================= LARGE ZOOM IMAGE ================= */}
              <Col xs={10} className="large-image-tab">
                <Tab.Content className="ps-2">
                  {[
                    "encoded_image_url_1",
                    "encoded_image_url_2",
                    "encoded_image_url_3",
                    "encoded_image_url_4",
                    "encoded_image_url_5",
                    "encoded_image_url_6",
                    "encoded_image_url_7",
                    "encoded_image_url_8",
                    "encoded_image_url_9",
                  ].map((key, index) => {
                    const img = productDetails?.data?.product_image?.[key];
                    const tabKey = `img-${index + 1}`;

                    return (
                      img && (
                        <Tab.Pane key={key} eventKey={tabKey}>
                          <Zoom>
                            <img src={img} alt="" className="zoom-img" />
                          </Zoom>
                        </Tab.Pane>
                      )
                    );
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Modal.Body>

        <button className="close-btn" onClick={handlePGClose}>
          ✕
        </button>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 9999999999 }}
      />
    </>
  );
};
