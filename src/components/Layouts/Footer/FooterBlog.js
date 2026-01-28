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
            } finally{
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);



    if (loading) {
        return <Loader />;
    }

  return (
    <div id="footer-blog" className="pt-5">
        <div className="container-fluid"> 
            <div className="row">
                <div className="col-lg-3">
                    <div className="doiwqjejir_inner pb-4 h-100">
                        <img src={Logo} className="mb-4" alt="" />

                        <p className="mb-0">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam non atque eligendi explicabo ipsum iusto officiis eveniet alias facilis nemo.
                        </p>
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
  )
}