/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditCategory = () => {
  const { id } = useParams();
  const [singleCat, setSingleCat] = useState({});

  const history = useHistory();

  const token = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    fetchData();
  }, [token.token]);
  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/category/${id}`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response.data);
        setSingleCat(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setSingleCat({ ...singleCat, [name]: value });
  };

  const updateData = async () => {
    console.log(singleCat);
    singleCat["id"] = id;
    const config = {
      method: "PUT",
      url: `${API_URL}/category/`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
      data: JSON.stringify(singleCat),
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          setTimeout(() => {
            toast.success(response.data.msg, {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push("/dream-pos/product/categorylist-product");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/dream-pos/product/categorylist-product");
  };

  return (
    <>
      <div className="page-wrapper">
        <ToastContainer />
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Edit Category</h4>
              <h6>Edit a product Category</h6>
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
                      value={singleCat.categoryName}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="categoryDescription"
                      onChange={handleChange}
                      value={singleCat.categoryDescription}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <button className="btn btn-submit me-2" onClick={updateData}>
                    Submit
                  </button>
                  <button className="btn btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
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

export default EditCategory;
