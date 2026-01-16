import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import Loader from "../../components/Loader/Loader";
export const ReturnPolicy = () => {

    const [loading, setLoading] = useState(false);
    const [ReturnPolicyDetails, setReturnPolicyDetails] = useState({});

    useEffect(() => {
        const fetchReturnPolicyData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-return-policy-content");
                setReturnPolicyDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchReturnPolicyData();
    }, []);

    if (loading) {
        return <Loader />;
    }

  return (
    <div>
       <PolicyComponent PolicyDetails={ReturnPolicyDetails}/>

      <hr />

      <FooterTopComponent />
    </div>
  );
};
