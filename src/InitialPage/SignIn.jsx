import React, { useState } from "react";
import { API_URL } from "../config";
import {
  LoginImage,
  Logo,
  MailIcon,
  //   GoogleIcon,
  //   FacebookIcon,
} from "../EntryFile/imagePath";
// import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

const SignInPage = () => {
  const [eye, seteye] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState("");

  const onEyeClick = () => {
    seteye(!eye);
  };

  const history = useHistory();

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    setUserDetails({ ...userDetails, [name]: value });
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      method: "POST",
      url: `${API_URL}/user/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(userDetails),
      // validateStatus: (status) => status !== 404,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === 0 || response.data.success === false) {
          setError(response.data.msg);
        }
        if (response.data.success === true) {
          toast.success(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
          var storage_var = {
            email: response.data.result.email,
            token: response.data.token,
          };

          localStorage.setItem("items", JSON.stringify(storage_var));
          setTimeout(() => {
            history.push("/dream-pos/dashboard");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
        // if (error.data.success === false) {
        //   setError(error.data.msg);
        // }
      });
  };

  return (
    <>
      <div className="main-wrapper">
        <Helmet>
          <title>SignIn</title>
          <meta name="description" content="SignIn page" />
        </Helmet>
        <ToastContainer />
        <div className="account-content">
          <div className="login-wrapper">
            <div className="login-img">
              <img src={LoginImage} alt="img" />
            </div>
            <div className="login-content">
              <div className="login-userset">
                <form onSubmit={handleSubmit}>
                  <div className="login-logo">
                    <img src={Logo} alt="img" />
                  </div>
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4>Please login to your account</h4>
                  </div>
                  <div className="form-login">
                    <label>Email</label>
                    <div className="form-addons">
                      <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter your email address"
                      />
                      <img src={MailIcon} alt="img" />
                    </div>
                  </div>
                  <div className="form-login">
                    <label>Password</label>
                    <div className="pass-group">
                      <input
                        type={eye ? "password" : "text"}
                        name="password"
                        onChange={handleChange}
                        placeholder="Enter your password"
                      />
                      <span
                        onClick={onEyeClick}
                        className={`fas toggle-password ${
                          eye ? "fa-eye-slash" : "fa-eye"
                        } `}
                      />
                      {error && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="form-login">
                    <div className="alreadyuser">
                      <h4>
                        <Link to="/forgetPassword" className="hover-a">
                          ?Forgot Password
                        </Link>
                      </h4>
                    </div>
                  </div> */}
                  <div className="form-login">
                    <button className="btn btn-login">Sign In</button>
                  </div>
                </form>
                {/* <div className="signinform text-center">
                  <h4>
                    Don’t have an account?{" "}
                    <Link to="/signUp" className="hover-a">
                      Sign Up
                    </Link>
                  </h4>
                </div> */}
                {/* <div className="form-setlogin">
                  <h4>Or sign up with</h4>
                </div>
                <div className="form-sociallink">
                  <ul>
                    <li>
                      <Link to="/signin">
                        <img src={GoogleIcon} className="me-2" alt="google" />
                        Sign Up using Google
                      </Link>
                    </li>
                    <li>
                      <Link to="/signin">
                        <img src={FacebookIcon} className="me-2" alt="google" />
                        Sign Up using Facebook
                      </Link>
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
