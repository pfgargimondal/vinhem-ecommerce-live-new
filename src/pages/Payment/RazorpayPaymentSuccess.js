import { useEffect } from "react";
import "./PaypalPaymentSuccess.css";
import http from "../../http";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { placeOrderAPI } from "../../api/order";
import { useCart } from "../../context/CartContext";

export const RazorpayPaymentSuccess = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { resetCart } = useCart();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    const razorpay_payment_id = query.get("razorpay_payment_id");
    const razorpay_order_id = query.get("razorpay_order_id");
    const razorpay_signature = query.get("razorpay_signature");

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      toast.error("Invalid Razorpay response");
      return;
    }

    const verifyPayment = async () => {
      try {
        const verifyRes = await http.post("/razorpay/verify-payment", {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });

        if (!verifyRes?.data?.success) {
          toast.error("Payment verification failed");
          return;
        }

        const shippingFinalAddress = JSON.parse(localStorage.getItem("shipping_address"));
        const billingFinalAddress = JSON.parse(localStorage.getItem("billing_address"));
        const amount = localStorage.getItem("final_total");
        const shipping_charge = localStorage.getItem("shipping_charge");

        const countryData = JSON.parse(localStorage.getItem("selectedCurrency"));
        const country = countryData?.country_name ?? "";

        const coupon_code = localStorage.getItem("coupon_code");
        const coupon_discount = localStorage.getItem("coupon_discount");
        const is_gift = localStorage.getItem("is_gift");
        const gstNumber = localStorage.getItem("gst_number");

        const resp = await placeOrderAPI({
          token,
          payment_method: "razorpay",
          shipping_address: shippingFinalAddress,
          billing_address: billingFinalAddress,
          country: country,
          coupon_code: coupon_code,
          coupon_discount: coupon_discount,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          razorpay_order_id: razorpay_order_id,
          amount_payable: amount,
          shipping_charge: shipping_charge,
          is_gift: is_gift ? 1 : 0,
          gst_number: gstNumber,
        });

        if (resp?.success) {
          resetCart();
          navigate("/thank-you");
        }

      } catch (error) {
        console.error(error);
        toast.error("Razorpay payment verification failed");
      }
    };

    verifyPayment();
  }, [token, resetCart, navigate]);


  return (
    <div className="payment-success-wrapper">
      <div className="payment-success-box">
        <div className="icon">✔</div>
        <h2>Payment Successful</h2>
        <p>Your Razorpay transaction was completed successfully.</p>
      </div>
    </div>
  );
};
