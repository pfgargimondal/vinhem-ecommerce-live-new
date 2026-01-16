import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../../context/AuthContext";
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/ChangePassword.module.css";
import http from "../../http";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { token, dispatch } = useAuth();

  const [inputs, setInputs] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!inputs.new_password.trim()) {
      newErrors.new_password = "New password is required";
    } else if (inputs.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
    }

    if (!inputs.confirm_password.trim()) {
      newErrors.confirm_password = "Please confirm your new password";
    } else if (inputs.confirm_password !== inputs.new_password) {
      newErrors.confirm_password = "Password and confirm password should be same";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {

        const response = await http.post("/user/update-password", inputs, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
                toast.success(response.data.message || "Password changed successfully");
                dispatch({ type: "LOGOUT" });
                setTimeout(() => navigate("/login"), 3000);
        } else {
            toast.error(response.data.message || "Failed to change password");
        }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.ffhfdf}>
      <div className="ansjidnkuiweer">
        <div className={styles.fbghdfg}>
          <div className="row">
            <div className="col-lg-3">
              <UserProfileNavMenu />
            </div>

            <div className="col-lg-9">
              <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                  <h4 className="mb-0">Change Password</h4>

                  <p className="ndiwhermweoewrr mb-0 d-none">
                    <Link to="/">
                      <i className="fa-solid me-1 fa-arrow-left"></i> Back To Home{" "}
                      <i className="fa-solid ms-1 fa-house"></i>
                    </Link>
                  </p>
                </div>

                <p className="mb-5">
                  Update your password regularly to keep your account safe. Enter
                  your new password below and confirm it to make the change.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className={styles.fxnjhdfsdfds}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className={styles.dfndf}>
                          <label>New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter New Password"
                            name="new_password"
                            value={inputs.new_password}
                            onChange={handleChange}
                          />
                          <p style={{ color: "red" }}>{errors.new_password}</p>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className={styles.dfndf}>
                          <label>Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Confirm Password"
                            name="confirm_password"
                            value={inputs.confirm_password}
                            onChange={handleChange}
                          />
                          <p style={{ color: "red" }}>{errors.confirm_password}</p>
                        </div>
                      </div>

                      <div className={`${styles.dienwrhwerwer} mt-5`}>
                        <div className={styles.dnjhsddsfsd}>
                          <button type="submit">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  style={{ zIndex: 9999999999 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
