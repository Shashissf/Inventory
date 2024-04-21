import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useHistory } from "react-router-dom";

const AddBrand = () => {
  const history = useHistory();

  const [addRawMaterial, setAddRawMaterial] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  // const [getGsm, setGetGsm] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setAddRawMaterial({ ...addRawMaterial, [name]: value });
  };
  const token = JSON.parse(localStorage.getItem("items"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let raw_cat = document.getElementById("raw_category");
    addRawMaterial["raw_category"] = raw_cat.value;
    addRawMaterial["gsm_product"] =
      addRawMaterial?.raw_gsm * addRawMaterial?.raw_gauge;
    // addRawMaterial["raw_gsm"] = getGsm;
    const config = {
      method: "POST",
      url: `${API_URL}/raw-metrial`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
      data: JSON.stringify(addRawMaterial),
      // validateStatus: (status) => status !== 404,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          setTimeout(() => {
            history.push("/dream-pos/product/brandlist-product");
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
        console.log(response.data);
        setCategoryList(response.data.result);
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
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Raw Material Add</h4>
              <h6>Create new Raw Material</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Name*</label>
                      <input
                        type="text"
                        name="raw_name"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Category*</label>
                      <select
                        name="raw_category"
                        id="raw_category"
                        className="cat"
                        required
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
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Gauge*</label>
                      <input
                        type="number"
                        id="raw_gauge"
                        name="raw_gauge"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Width*(mm)</label>
                      <input
                        type="number"
                        name="raw_length"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Get GSM*</label>
                      <input
                        type="number"
                        id="raw_gsm"
                        name="raw_gsm"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Stock Quantity Alert*(KG)</label>
                      <input
                        type="number"
                        name="quantity_alert"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <hr></hr>

                  <h6 className="pb-3">
                    GSM of the Product -{" "}
                    {addRawMaterial?.raw_gsm * addRawMaterial?.raw_gauge
                      ? addRawMaterial?.raw_gsm * addRawMaterial?.raw_gauge
                      : 0}
                  </h6>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">
                      Submit
                    </button>
                    <button className="btn btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default AddBrand;
