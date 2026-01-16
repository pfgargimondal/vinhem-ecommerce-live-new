import { Link } from "react-router-dom";
import "./Css/ThankYou.css";
import "./Css/ThankYouResponsive.css";

export const ThankYou = () => {
  return (
    <div className="dfjuytrgtrrt">
        <div className="row">
            <div className="col-lg-6">
                <div className="pic">
                    <img src="images/shopping-cart.jpg" className="img-fluid" alt="" />
                </div>                
            </div>

            <div className="col-lg-6">
                <div className="write pt-5 text-center">
                    <h1 className="display-2 fw-bold">Thank You</h1>
                
                    <h2>For Joining Our Shop</h2>
                    
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem
                        obcaecati quis eaque distinctio, aliquam voluptatem? Voluptatum dolorum
                        beatae veniam sint recusandae quam debitis maiores, voluptate
                        voluptates? Magni ipsum quae et?
                    </p>

                    <Link to="/">
                        <button className="btn btn-main">Back to Home</button>
                    </Link>
                </div>                
            </div>
        </div>
    </div>
  )
}