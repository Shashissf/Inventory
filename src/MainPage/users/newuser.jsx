/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import "react-select2-wrapper/css/select2.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Newuser = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState("");

  const history = useHistory();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
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
          setTimeout(() => {
            history.push("/dream-pos/users/userlists");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.data.success === false) {
          setError(error.data.msg);
        }
      });
  };
  const handleCancel = () => {
    history.push("/dream-pos/users/userlists");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ToastContainer />
        <div className="page-header">
          <div className="page-title">
            <h4>User Management</h4>
            <h6>Add/Update User</h6>
          </div>
        </div>
        {/* /add */}
        <div className="card">
          <div className="card-body">
            <div className="row">
              <form onSubmit={handleSubmit}>
                <div className="col-lg-3 col-sm-3 col-12">
                  <div className="form-group">
                    <label>User Name</label>
                    <input
                      type="text"
                      name="username"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-3 col-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-3 col-12">
                  <div className="form-group">
                    <label>Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        className=" pass-input"
                        name="password"
                        onChange={handleChange}
                      />
                      <span
                        className={`fas toggle-password ${
                          passwordShown ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={togglePassword}
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
                </div>
                <div className="col-lg-3 col-sm-3 col-12">
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        className=" pass-input"
                        name="cpassword"
                        onChange={handleChange}
                      />
                      <span
                        className={`fas toggle-password ${
                          passwordShown ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={togglePassword}
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
                </div>
                <div className="col-lg-12">
                  <button type="submit" className="btn btn-submit me-2">
                    Sign Up
                  </button>
                  <a className="btn btn-cancel" onClick={handleCancel}>
                    Cancel
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /add */}
      </div>
    </div>
  );
};

export default Newuser;
