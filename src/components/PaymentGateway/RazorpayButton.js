import http from "../../http";

const RazorpayButton = ({ amount, token, onSuccess }) => {

    const loadRazorpay = () => {
        const options = {
            key: "rzp_test_CCsoWTNNqtpWEj",
            amount: amount * 100,
            currency: "INR",
            name: "Your Brand Name",
            description: "Order Payment",

            order_id: "", // will be set below

            handler: async function (response) {
                const verifyRes = await http.post(
                    "/razorpay/verify",
                    {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (verifyRes.data.success) {
                    onSuccess(response.razorpay_payment_id);
                }
            },

            theme: {
                color: "#F37254"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const createRazorpayOrder = async () => {
        const res = await http.post(
            "/razorpay/create-order",
            { amount },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
            loadRazorpay(res.data.order_id);
        }
    };

    return (
        <button className="btn btn-main w-100" onClick={createRazorpayOrder}>
            Pay with Razorpay
        </button>
    );
};

export default RazorpayButton;
