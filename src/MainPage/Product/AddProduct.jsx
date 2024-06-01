import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import reset from "../../assets/img/reset1.png";

const AddProduct = () => {
  const [token, setToken] = useState("");
  const [rawMaterial, setRawMaterial] = useState([]);

  const [productDetails, setProductDetails] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [flatSize, setFlatSize] = useState("");
  const [perUnitWeight, setPerUnitWeight] = useState("");
  const [message, setMessage] = useState([]);

  const [inputs, setInputs] = useState([
    {
      raw_id: "",
      substrate: "",
      flat_size: "",
      perunit_weight: "",
      flat_value: "",
      weight: "",
    },
  ]);

  useEffect(() => {
    fetchRawMaterials();
  }, [token]);

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
    let value = e.target.value;

    if (name === "product_image") {
      value = e.target.files[0];
    }
    console.log(value)
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let product_category = document.getElementById("product_category");
    let fd=new FormData()
    fd.append('product_image',productDetails.product_image)
    fd.append('product_category',product_category.value)
    fd.append('raw_required',JSON.stringify(inputs))
    fd.append('product_length',productDetails.product_length)
    fd.append('product_name',productDetails.product_name)
    fd.append('product_width',productDetails.product_width)
    fd.append('repeat_width',productDetails.repeat_width)
    const config = {
      method: "POST",
      url: `${API_URL}/product`,
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
        "type": "formData",
        token: token,
      },
      data: fd,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          toast.success(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
          setTimeout(() => {
            history.push("/dream-pos/product/productlist-product");
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
  useEffect(() => {
    fetchCategory();
  }, [token]);

  const fetchCategory = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/category/?type=PRODUCT`,
      headers: {
        "Content-Type": "application/json",
        token: token,
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
  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        raw_id: "",
        substrate: "",
        flat_size: "",
        perunit_weight: "",
        weight: "",
      },
    ]);
  };
  const handleDeleteInput = () => {
    setMessage("");
    // const newArray = [...inputs];
    // newArray.splice(index, 1);
    setInputs([
      {
        raw_id: "",
        substrate: "",
        flat_size: "",
        perunit_weight: "",
        weight: "",
      },
    ]);
  };

  const handleCalChange = (event, index) => {
    let { value } = event.target;
    let id = `raw_category${index}`;

    var raw_category = document.getElementById(id);
    var selectedText = raw_category.options[raw_category.selectedIndex].text;

    fetchSingleData(selectedText, value, index, perUnitWeight, flatSize);
  };
  const fetchSingleData = async (selectedText, value, index) => {
    const config = {
      method: "GET",
      url: `${API_URL}/raw-metrial/${value}`,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (productDetails.repeat_width < 1) {
          productDetails.repeat_width = 1;
        }
        let flat =
          Number(productDetails.product_width) *
            Number(productDetails.repeat_width) +
          10;

        setFlatSize(flat * Number(productDetails.product_length));

        inputs[index]["substrate"] = selectedText;
        if (index > 0) {
          flat = Number(flat) + 5 * index;
          console.log(flat);
          if (Number(response.data.result.raw_length) < flat) {
            message[index] = "Flat Size width is greater than Substrate width";
          } else if (Number(response.data.result.raw_length) > flat) {
            message[index] = "Flat Size width is less than Substrate width";
          } else if (Number(response.data.result.raw_length) === flat) {
            message[index] = "Flat Size width same as Substrate width";
          }
          inputs[index]["flat_size"] = `${flat} X ${Number(
            productDetails.product_length
          )}`;
          let unitWeight =
            flat *
            Number(productDetails.product_length) *
            Number(response.data.result.raw_gsm);
          setPerUnitWeight(unitWeight / 1000000);
          inputs[index]["perunit_weight"] = unitWeight / 1000000;
        } else {
          if (Number(response.data.result.raw_length) < flat) {
            message[index] = "Flat Size width is greater than Substrate width";
          } else if (Number(response.data.result.raw_length) > flat) {
            message[index] = "Flat Size width is less than Substrate width";
          } else if (Number(response.data.result.raw_length) === flat) {
            message[index] = "Flat Size width same as Substrate width";
          }
          setMessage(message);
          inputs[index]["flat_size"] = `${flat} X ${Number(
            productDetails.product_length
          )}`;
          let unitWeight =
            flat *
            Number(productDetails.product_length) *
            Number(response.data.result.raw_gsm);
          setPerUnitWeight(unitWeight / 1000000);
          inputs[index]["perunit_weight"] = unitWeight / 1000000;
        }

        inputs[index]["raw_id"] = value;
        inputs[index]["flat_value"] =
          flat * Number(productDetails.product_length);

        const totalWeight = response.data.result.raw_stock.reduce(
          (accumulator, currentItem) => {
            return accumulator + parseInt(currentItem.stock_weight);
          },
          0
        );
        inputs[index]["weight"] = totalWeight;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchRawMaterials = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/raw-metrial`,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      // validateStatus: (status) => status !== 404,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        setRawMaterial(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    // console.log()
    if (productDetails?.raw_required?.length > 0) {
      setInputs(productDetails.raw_required);
    } else {
      setInputs([
        {
          raw_id: "",
          substrate: "",
          flat_size: "",
          perunit_weight: "",
          flat_value: "",
          weight: "",
        },
      ]);
    }
  }, [productDetails]);
  console.log(message);

  const handleCancel = () => {
    history.push("productlist-product");
  };
  return (
    <>
      <div className="page-wrapper">
        <ToastContainer />
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Add</h4>
              <h6>Create new product</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Name*</label>
                      <input
                        type="text"
                        name="product_name"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Category*</label>
                      <select
                        name="product_category"
                        id="product_category"
                        className="cat"
                        required
                        style={{ height: "40px", fontSize: "14px" }}
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
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Length*(mm)</label>
                      <input
                        type="number"
                        name="product_length"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Width*(mm)</label>
                      <input
                        type="number"
                        name="product_width"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Repeat in Width*</label>
                      <input
                        type="number"
                        name="repeat_width"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Choose Image</label>
                      <input
                        type="file"
                        name="product_image"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <h6 className="pb-3">Raw Material requirements - </h6>
                  {inputs?.map((item, index) => (
                    <>
                      <div
                        className="col-lg-3 col-sm-3 col-12 form-group"
                        key={index}
                      >
                        <label>Substrate {index + 1}</label>
                        <select
                          name="substrate"
                          id={`raw_category${index}`}
                          className="cat"
                          onChange={(event) => handleCalChange(event, index)}
                          required
                          style={{ height: "40px", fontSize: "14px" }}
                        >
                          <option value={""}>Choose Raw Material</option>
                          {rawMaterial?.map((items) => {
                            var selected = false;
                            item.substrate ===
                            `${items.raw_name} - G : ${items.raw_gauge} | W : ${items.raw_length} | GSM : ${items.raw_gsm}`
                              ? (selected = true)
                              : (selected = false);
                            return (
                              <option
                                selected={selected}
                                value={items._id}
                                key={items._id}
                              >
                                {items.raw_name} - G : {items.raw_gauge} | W :{" "}
                                {items.raw_length} | GSM : {items.raw_gsm}
                              </option>
                            );
                          })}
                        </select>
                        <span>{message[index]}</span>
                      </div>
                      <div
                        className="col-lg-3 col-sm-3 col-12 form-group"
                        key={index}
                      >
                        <div className="form-group">
                          <label>Flat Size (sq mm)</label>
                          <input
                            type="text"
                            name="flat_size"
                            onChange={(event) => handleCalChange(event, index)}
                            value={item.flat_size}
                            disabled
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-3 col-sm-3 col-12 form-group"
                        key={index}
                      >
                        <div className="form-group">
                          <label>Per Unit Weight (gram)</label>
                          <input
                            type="text"
                            name="perunit_weight"
                            onChange={(event) => handleCalChange(event, index)}
                            value={item.perunit_weight}
                            disabled
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-2 col-sm-2 col-12 form-group"
                        key={index}
                      >
                        {index === 0 && <label>Action</label>}
                        {index > 0 && <label>&nbsp;</label>}
                        <div className="d-flex">
                          {index === inputs.length - 1 && (
                            <button
                              className="addplus"
                              onClick={() => handleAddInput()}
                            >
                              +
                            </button>
                          )}
                          {index === inputs.length - 1 && index > 0 && (
                            <>
                              <button
                                className="reset mx-3"
                                onClick={() => handleDeleteInput(index)}
                              >
                                <img src={reset} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {/* <div className="body"> {JSON.stringify(inputs)} </div> */}
                    </>
                  ))}
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

export default AddProduct;
