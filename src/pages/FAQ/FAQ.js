import "./Css/FAQ.css";
import http from "../../http";
import { useEffect, useState } from "react";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import Loader from "../../components/Loader/Loader";

export const FAQ = () => {

  const [FAQDetails, setFAQDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFAQData = async () => {
       setLoading(true);
      try {
        const getresponse = await http.get("/faq");
        const all_response = getresponse.data;

        setFAQDetails(all_response);                  

      } catch (error) {
        console.error("Error fetching FAQ:", error);
      } finally{
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  if (loading) {
    return <Loader />;
  }


  return (
    <div>
      {/* Banner Section */}
      <div className="fgyfgfd5215g">
        <div className="container-fluid">
          <div
            className="aboutusbannr55"
            style={{
              backgroundImage: FAQDetails.data?.banner_image
                ? `url(${FAQDetails.image_url}/${FAQDetails.data.banner_image})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center", borderRadius: "27px", height: "553px", objectFit: "cover", marginTop: "1rem"
            }}
          >
            <div className="dfgnhdfjhgdf">
              <div className="row">
                <div className="col-lg-7"></div>
                <div className="col-lg-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="fjgnfg55d">
        <div className="wrapper">
          <div className="container-fluid">
            <h1 className="mb-4">
              {FAQDetails.data?.title &&
                FAQDetails.data.title}
            </h1>

            <div
              dangerouslySetInnerHTML={{
                __html:
                  FAQDetails.data?.description &&
                  FAQDetails.data.description,
              }}
          />
          </div>
        </div>
      </div>

      <hr />
      <FooterTopComponent />
    </div>
  );
};
