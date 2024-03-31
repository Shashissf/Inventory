import React, { useState } from "react";
import { API_URL } from "../config";
import {
  LoginImage,
  Logo,
  MailIcon,
  // GoogleIcon,
  // FacebookIcon,
} from "../EntryFile/imagePath";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [eye, seteye] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState("");

  const history = useHistory();

  const onEyeClick = () => {
    seteye(!eye);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    setUserDetails({ ...userDetails, [name]: value });
    console.log(name, value);
  };

  // useEffect(() => {
  //   history.push("/signin");
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      method: "POST",
      url: `${API_URL}/user/register`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(userDetails),
      // validateStatus: (status) => status !== 404,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === false) {
          setError(response.data.msg);
        }
        if (response.data.success === true) {
          toast.success(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
          console.log("hh");
          setTimeout(() => {
            history.push("/signin");
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
          <title>SignUp</title>
          <meta name="description" content="SignUp page" />
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
                    <h3>Create an Account</h3>
                    <h4>Continue where you left off</h4>
                  </div>
                  {/* <div className="form-login">
                    <label>Full Name</label>
                    <div className="form-addons">
                      <input type="text" placeholder="Enter your full name" />
                      <img src={Users1} alt="img" />
                      <div className="invalid-feedback"></div>
                    </div>
                  </div> */}
                  <div className="form-login">
                    <label>Email</label>
                    <div className="form-addons">
                      <input
                        type="text"
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
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
                        required
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
                  <div className="form-login">
                    <label>Confirm Password</label>
                    <div className="pass-group">
                      <input
                        type={eye ? "password" : "text"}
                        name="cpassword"
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
                  <div className="form-login">
                    <button type="submit" className="btn btn-login">
                      Sign Up
                    </button>
                  </div>
                  <div className="signinform text-center">
                    <h4>
                      Already a user?{" "}
                      <Link to="/signIn" className="hover-a">
                        Sign In
                      </Link>
                    </h4>
                  </div>
                  {/* <div className="form-setlogin">
                    <h4>Or sign up with</h4>
                  </div>
                  <div className="form-sociallink">
                    <ul>
                      <li>
                        <a href="#">
                          <img src={GoogleIcon} className="me-2" alt="google" />
                          Sign Up using Google
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img
                            src={FacebookIcon}
                            className="me-2"
                            alt="google"
                          />
                          Sign Up using Facebook
                        </a>
                      </li>
                    </ul>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
