import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import Loader from "../../components/Loader/Loader";

export const ShippingPolicy = () =>{

    const [loading, setLoading] = useState(false);
    const [ShippingPolicyDetails, setShippingPolicyDetails] = useState({});
    
    useEffect(() => {
        const fetchShippingPolicyData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-shipping-policy-content");
                setShippingPolicyDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchShippingPolicyData();
    }, []);

    if (loading) {
        return <Loader />;
    }

  return (
    <div>
      <PolicyComponent PolicyDetails={ShippingPolicyDetails}/>
            <hr />
      
           <FooterTopComponent />
    </div>
  )
}
