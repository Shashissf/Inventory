import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const AddCategory = () => {
  const [token, setToken] = useState("");
  const [catDetails, setCatDetails] = useState({});
  const history = useHistory();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("items"));
    if (token) {
      setToken(token.token);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setCatDetails({ ...catDetails, [name]: value });
  };

  const handleSubmit = async () => {
    let type = document.getElementById("type");
    console.log(type.value);
    catDetails["type"] = type.value;
    console.log(catDetails);
    const config = {
      method: "POST",
      url: `${API_URL}/category`,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: catDetails,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          toast.success(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
          setTimeout(() => {
            history.push("/dream-pos/product/categorylist-product");
          }, 3000);
        } else {
          toast.error(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="page-wrapper">
        <ToastContainer />
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Add Category</h4>
              <h6>Create new product Category</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Category Name</label>
                    <input
                      type="text"
                      name="categoryName"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Category Type</label>
                    <select name="type" id="type">
                      <option value="PRODUCT">Product</option>
                      <option value="RAW-MATERIAL">Raw Material</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="categoryDescription"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button
                    className="btn btn-submit me-2"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button className="btn btn-cancel">Cancel</button>
                </div>
              </div>
            </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default AddCategory;
