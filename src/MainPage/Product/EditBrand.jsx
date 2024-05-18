import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditBrand = () => {
  const { id } = useParams();
  const [singleCat, setSingleCat] = useState({});
  // const [singleRaw, setSingleRaw] = useState({});

  const [categoryList, setCategoryList] = useState([]);
  const history = useHistory();

  const token = JSON.parse(localStorage.getItem("items"));

  useEffect(() => {
    fetchCategory();
  }, [token.token]);

  const fetchCategory = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/category/?type=RAW-MATERIAL`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response.data);
        setCategoryList(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [token.token]);

  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/raw-metrial/${id}`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
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
    // setDisabled(false);
  };

  const updateData = async () => {
    singleCat["id"] = id;

    console.log(singleCat);
    const config = {
      method: "PUT",
      url: `${API_URL}/raw-metrial/`,
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
            history.push("/dream-pos/product/brandlist-product");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitAndManageStock = async () => {
    singleCat["id"] = id;

    console.log(singleCat);
    const config = {
      method: "PUT",
      url: `${API_URL}/raw-metrial/`,
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
            history.push({
              pathname: `/dream-pos/product/addstock/${id}`,
              state: singleCat,
            });
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/dream-pos/product/brandlist-product");
  };

  return (
    <>
      <div className="page-wrapper">
        <ToastContainer />
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Raw Material Edit</h4>
              <h6>Edit a Raw Material</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="raw_name"
                      onChange={handleChange}
                      value={singleCat?.raw_name}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-4 col-12">
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      name="raw_sku"
                      onChange={handleChange}
                      value={singleCat?.raw_sku}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="raw_category"
                      id="product_category"
                      className="cat"
                    >
                      {categoryList?.map((item) => {
                        return (
                          <option value={item._id} key={item._id}>
                            {item.categoryName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Gauge</label>
                    <input
                      type="text"
                      name="raw_gauge"
                      onChange={handleChange}
                      value={singleCat?.raw_gauge}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Width</label>
                    <input
                      type="text"
                      name="raw_length"
                      onChange={handleChange}
                      value={singleCat?.raw_length}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Get GSM</label>
                    <input
                      type="text"
                      name="raw_gsm"
                      onChange={handleChange}
                      value={singleCat?.raw_gsm}
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Stock Quantity Alert</label>
                    <input
                      type="number"
                      name="quantity_alert"
                      value={singleCat?.quantity_alert || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <hr></hr>

                <h6 className="pb-3">
                  GSM of the Product -{" "}
                  {singleCat?.raw_gsm * singleCat?.raw_gauge
                    ? singleCat?.raw_gsm * singleCat?.raw_gauge
                    : 0}
                </h6>
                <div className="col-lg-12">
                  <button className="btn btn-submit me-2" onClick={updateData}>
                    Submit
                  </button>
                  <button
                    className="btn btn-cancel me-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={submitAndManageStock}
                  >
                    Submit and manage stock
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

export default EditBrand;
