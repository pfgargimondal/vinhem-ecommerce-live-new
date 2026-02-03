import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";

import "./FooterBlog.css";
import Loader from "../../Loader/Loader";
import http from "../../../http";
import { useEffect, useState } from "react";

export const FooterBlog = () => {
  const [loading, setLoading] = useState(false);
  const [blogsHeader, setBlogsHeader] = useState([]);
  const [popularblogs, setPopularBlogs] = useState([]);
  const [recentblogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogHeader = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/fetch-blog-header");
        const dataheaderCategories = getresponse.data.data;

        setBlogsHeader(dataheaderCategories);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogHeader();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/blogs");
        const dataBlogs = getresponse.data;

        setPopularBlogs(dataBlogs.popularblog);
        setRecentBlogs(dataBlogs.recentblog);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="footer-blog">
        <div className="dweoriwenirjweoijrwer pt-5">
            <div className="container-fluid">
            <div className="row">
                <div className="col-lg-3">
                <div className="doiwqjejir_inner pb-4 h-100">
                    <img src={Logo} className="mb-4" alt="" />

                    <p className="mb-0">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Veniam non atque eligendi explicabo ipsum iusto officiis
                    eveniet alias facilis nemo.
                    </p>

                    <h6 className="text-white mb-2 mt-3">
                    CERTIFIED & VERIFIED BY :
                    </h6>

                    <div className="certification-grid mt-3">
                    <img
                        src="https://img.freepik.com/free-photo/happy-lady-stylish-skirt-boater-posing-pink-wall_197531-23653.jpg?t=st=1770035879~exp=1770039479~hmac=7da8547c7e06a280ba968f44296799a91b7ec95f256d80239cc2aadddacadebb&w=1060"
                        alt="Silk Mark"
                    />
                    <img
                        src="https://img.freepik.com/free-photo/three-young-beautiful-smiling-girls-trendy-summer-casual-dresses-sexy-carefree-women-posing_158538-4846.jpg?t=st=1770036732~exp=1770040332~hmac=d645cb1efa6a8e3565646dbf9e0d50678e14d306dc0a5dd0dce78ce19de1e51e&w=2000"
                        alt="ISO Certified"
                    />
                    <img
                        src="https://img.freepik.com/free-photo/young-woman-with-shopping-bags-beautiful-dress_1303-17549.jpg?t=st=1770036865~exp=1770040465~hmac=2d20476dcc318b9a25afa24a9d13167b008768db431f9976807f9581942bf93b&w=2000"
                        alt="GST Registered"
                    />
                    <img
                        src="https://img.freepik.com/free-photo/blithesome-woman-with-brown-hair-standing-violet-wall_197531-13223.jpg?t=st=1770036915~exp=1770040515~hmac=acfc34ec784ac966605c0d2f3733e0d2dd61c495d5a65f56f60cc712dc0f2e4b&w=2000"
                        alt="Make in India"
                    />
                    <img
                        src="https://img.freepik.com/free-photo/optimistic-ginger-lady-bright-sunglasses-laughing-smiling-stunning-girl-jeans-posing-pink_197531-11044.jpg?t=st=1770037147~exp=1770040747~hmac=f4171ed0b7ddad2183afd4036dd0edca3afa14e5196878bff11cf669098c00f7&w=2000"
                        alt="Verified"
                    />
                    <img
                        src="https://img.freepik.com/free-photo/dreamy-dark-haired-lady-jumping-purple-wall-sensual-girl-white-sneakers-pink-pants-having-fun-indoor-photoshoot_197531-5120.jpg?t=st=1770037186~exp=1770040786~hmac=44619a108f10669bb3ce517602ca554143c9853764f670853570c32ff4e8ef38&w=1060"
                        alt="Trusted Seller"
                    />
                    </div>
                </div>
                </div>

                <div className="col-lg-3">
                <div className="doiwqjejir_inner pb-4 h-100">
                    <h5 className="mb-3 text-white">Recent Posts</h5>
                    {recentblogs.map((recentblogsItem) => (
                    <Link
                        key={recentblogsItem.slug}
                        to={recentblogsItem.slug}
                        target="_blank"
                    >
                        {recentblogsItem.title}
                    </Link>
                    ))}
                    {/* <Link to="">Lorem ipsum dolor sit amet</Link> */}
                </div>
                </div>

                <div className="col-lg-3">
                <div className="doiwqjejir_inner pb-4 h-100">
                    <h5 className="mb-3 text-white">Popular Posts</h5>
                    {popularblogs.map((popularblogsItem) => (
                    <Link
                        key={popularblogsItem.slug}
                        to={popularblogsItem.slug}
                        target="_blank"
                    >
                        {popularblogsItem.title}
                    </Link>
                    ))}

                    {/* <Link to="">Lorem ipsum dolor sit amet</Link> */}
                </div>
                </div>

                <div className="col-lg-3">
                <div className="doiwqjejir_inner border-end-0 pb-4 h-100">
                    <h5 className="mb-3 text-white">Categories</h5>
                    {blogsHeader.map((blogHeaderItem) => (
                    <Link
                        key={blogHeaderItem.category_url}
                        to={blogHeaderItem.category_url}
                        target="_blank"
                    >
                        {blogHeaderItem.head_category}
                    </Link>
                    ))}
                    {/* <Link to="">Lorem ipsum dolor sit amet</Link> */}
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="sadfdfgeadetr py-2 text-center text-white">
            <p className="mb-0">Vinhem Fashion Blog <i class="bi bi-c-circle"></i> 2012-2026, All Rights Reserved.</p>
        </div>
    </div>
  );
};
