import { useEffect, useState } from "react";
import "./Css/AboutUs.css";
import http from "../../http";
import { useNavigate } from "react-router-dom";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import Loader from "../../components/Loader/Loader";
import { useAuthModal } from "../../context/AuthModalContext";

export const AboutUs = () => {
  // eslint-disable-next-line
  const navigate = useNavigate();
  const { handleLoginModal } = useAuthModal();

  const [AboutUsDetails, setAboutUsDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/get-about-us-details");
        setAboutUsDetails(getresponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  const description = AboutUsDetails.data?.sixth_section_description || "";

  // Replace plain SIGN IN with a clickable link
  const updatedDescription = description.replace(
    /SIGN IN/g,
    `<a class="signin-link" style="color: var(--pink-main-color); text-decoration:underline;">SIGN IN</a>`
  );
 
  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="container-fluid">
        <div
          className="aboutusbannr"
          style={{
            backgroundImage:
              AboutUsDetails?.image_url && AboutUsDetails?.data?.banner_image
                ? `url(${AboutUsDetails.image_url}/${AboutUsDetails.data.banner_image})`
                : "none",
            backgroundSize: "cover", backgroundPosition: "center", borderRadius: "27px", height: "553px", objectFit: "cover", marginTop: "1rem"
          }}
        >
          <div className="effgbhgrswfsdertrwe">
            <div className="dfgnhdfjhgdf">
              <div className="row">
                <div className="col-lg-8"></div>
                <div className="col-lg-4">
                  <div className="dfbhdf">
                    {/* <h2>{AboutUsDetails.data?.banner_title && AboutUsDetails.data.banner_title}</h2> */}
                    {/* <p>{AboutUsDetails.data?.banner_description && AboutUsDetails.data.banner_description}</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fgsdfsdf656565d">
          <div className="adfsdfwreerer">
            <div className="djhfvdffdf">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    AboutUsDetails.data?.first_section_description &&
                    AboutUsDetails.data.first_section_description,
                }}
              />
            </div>
          </div>
        </div>

        <div className="dfgjhdfbgdfgd">
          <div className="adfsdfwreerer">
            <div className="dfdfhsdff">
              <div className="row">
                <div className="col-lg-6">
                  <div className="dfngjhdfgfd">
                    {AboutUsDetails.data?.second_section_image && (
                      <img
                        src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.second_section_image}`}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="gdfngjhdfg">
                    {/* <h4>Vinhem <span>Fashion</span></h4> */}
                    <h2>
                      {AboutUsDetails.data?.second_section_title &&
                        AboutUsDetails.data.second_section_title}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          AboutUsDetails.data?.second_section_description &&
                          AboutUsDetails.data.second_section_description,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dfnhdfhsd55">
          <div className="adfsdfwreerer">
            <div className="sdfsd55">
              <div className="row">
                <div className="col-lg-6">
                  <div className="dfgjhfg">
                    <h4>
                      {AboutUsDetails.data?.third_section_title_one &&
                        AboutUsDetails.data.third_section_title_one}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          AboutUsDetails.data?.third_section_description_one &&
                          AboutUsDetails.data.third_section_description_one,
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="dfgjhfg2">
                    <h4>
                      {AboutUsDetails.data?.third_section_title_two &&
                        AboutUsDetails.data.third_section_title_two}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          AboutUsDetails.data?.third_section_description_two &&
                          AboutUsDetails.data.third_section_description_two,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xfnhvjhdfbvgdfg">
          <div className="adfsdfwreerer">
            <div className="lksdvzdxmjcb py-3" style={{ textAlign: "center" }}>
              <h2>
                {AboutUsDetails.data?.fourth_section_heading &&
                  AboutUsDetails.data.fourth_section_heading}
              </h2>
            </div>
            <div className="sdfhdfgdf">
              <div className="row">
                <div className="col-lg-4">
                  <div className="fghdfgdf">
                    <div className="dfgdf">
                      {AboutUsDetails.data?.fourth_section_image_one && (
                        <img
                          src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fourth_section_image_one}`}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="fbgdfg">
                      <h4>
                        {AboutUsDetails.data?.fourth_section_title_one &&
                          AboutUsDetails.data.fourth_section_title_one}
                      </h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            AboutUsDetails.data
                              ?.fourth_section_description_one &&
                            AboutUsDetails.data.fourth_section_description_one,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fghdfgdf">
                    <div className="dfgdf">
                      {AboutUsDetails.data?.fourth_section_image_two && (
                        <img
                          src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fourth_section_image_two}`}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="fbgdfg">
                      <h4>
                        {AboutUsDetails.data?.fourth_section_title_two &&
                          AboutUsDetails.data.fourth_section_title_two}
                      </h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            AboutUsDetails.data
                              ?.fourth_section_description_two &&
                            AboutUsDetails.data.fourth_section_description_two,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fghdfgdf">
                    <div className="dfgdf">
                      {AboutUsDetails.data?.fourth_section_image_three && (
                        <img
                          src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fourth_section_image_three}`}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="fbgdfg">
                      <h4>
                        {AboutUsDetails.data?.fourth_section_title_three &&
                          AboutUsDetails.data.fourth_section_title_three}
                      </h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            AboutUsDetails.data
                              ?.fourth_section_description_three &&
                            AboutUsDetails.data
                              .fourth_section_description_three,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sdfgbdfghgdfgd">
          <div className="adfsdfwreerer">
            <div className="gdfbgjhdfgd">
              <h2>
                {AboutUsDetails.data?.fifth_section_title &&
                  AboutUsDetails.data.fifth_section_title}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    AboutUsDetails.data?.fifth_section_description &&
                    AboutUsDetails.data.fifth_section_description,
                }}
              />
            </div>
            <div className="jhdfdfgdfsg">
              <div className="dfgbdfdf">
                {AboutUsDetails.data?.fifth_section_image_one && (
                  <img
                    src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fifth_section_image_one}`}
                    alt=""
                  />
                )}
              </div>

              <div className="dfgbdfdf dfdf ">
                {AboutUsDetails.data?.fifth_section_image_two && (
                  <img
                    src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fifth_section_image_two}`}
                    alt=""
                  />
                )}
              </div>

              <div className="dfgbdfdf  ">
                {AboutUsDetails.data?.fifth_section_image_three && (
                  <img
                    src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fifth_section_image_three}`}
                    alt=""
                  />
                )}
              </div>

              <div className="dfgbdfdf dfdf">
                {AboutUsDetails.data?.fifth_section_image_four && (
                  <img
                    src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fifth_section_image_four}`}
                    alt=""
                  />
                )}
              </div>

              <div className="dfgbdfdf">
                {AboutUsDetails.data?.fifth_section_image_five && (
                  <img
                    src={`${AboutUsDetails.image_url}/${AboutUsDetails.data.fifth_section_image_five}`}
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="ieufhvksdhjk">
          <div className="adfsdfwreerer">
            <div className="vgjlksdfj">
              <h2>
                {AboutUsDetails.data?.sixth_section_title &&
                  AboutUsDetails.data.sixth_section_title}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: updatedDescription,
                }}
                onClick={(e) => {
                  if (e.target.classList.contains('signin-link')) {
                    handleLoginModal();
                  }
                }}
              />
            </div>
          </div>
        </div>
        <hr />
      </div>

      <FooterTopComponent />
    </div>
  );
};
