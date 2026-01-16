import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";

import "./FooterBlog.css";

export const FooterBlog = () => {
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

                        <Link to="">Lorem ipsum dolor sit amet</Link>

                        <Link to="">Lorem ipsum </Link>

                        <Link to="">Lorem ipsum dolor</Link>

                        <Link to="">Lorem ipsum dolor sit</Link>

                        <Link to="">Lorem ipsum dolor</Link>

                        <Link to="">Lorem ipsum dolor sit</Link>
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="doiwqjejir_inner pb-4 h-100">
                        <h5 className="mb-3 text-white">Popular Posts</h5>

                        <Link to="">Lorem ipsum dolor sit amet</Link>

                        <Link to="">Lorem ipsum </Link>

                        <Link to="">Lorem ipsum dolor</Link>

                        <Link to="">Lorem ipsum dolor sit</Link>
                        
                        <Link to="">Lorem ipsum dolor sit</Link>
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="doiwqjejir_inner border-end-0 pb-4 h-100">
                        <h5 className="mb-3 text-white">Categories</h5>

                        <Link to="">Lorem ipsum dolor sit amet</Link>

                        <Link to="">Lorem ipsum </Link>

                        <Link to="">Lorem ipsum dolor</Link>

                        <Link to="">Lorem ipsum dolor sit</Link>

                        <Link to="">Lorem ipsum </Link>

                        <Link to="">Lorem ipsum dolor</Link>

                        <Link to="">Lorem ipsum dolor sit</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}