import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import reset from "../../assets/img/reset1.png";

const EditProduct = () => {
  const { id } = useParams();
  const [singleCat, setSingleCat] = useState({});
  const [flatSize, setFlatSize] = useState("");
  const [perUnitWeight, setPerUnitWeight] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [message, setMessage] = useState([]);
  const [imageFlag, setImageFlag] = useState(false);
  const [file, setFile] = useState();
  const [inputs, setInputs] = useState([
    {
      raw_id: "",
      substrate: "",
      flat_size: "",
      perunit_weight: "",
      flat_value: "",
    },
  ]);

  const history = useHistory();

  const token = JSON.parse(localStorage.getItem("items"));

  useEffect(() => {
    fetchCategory();
  }, [token.token]);

  const fetchCategory = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/category/?type=PRODUCT`,
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
    fetchRawMaterials();
  }, [token.token]);

  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/product/${id}`,
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
    let value = e.target.value;

    if (name === "product_image") {
      value = e.target.files[0];
      setFile(URL.createObjectURL(e.target.files[0]));

      setImageFlag(true);
    }

    setSingleCat({ ...singleCat, [name]: value });
  };

  const updateData = async () => {
    var product_category = document.getElementById("product_category");
    // value = product_category.options[product_category.selectedIndex].text;
    let config = {};
    if (imageFlag) {
      let fd = new FormData();
      fd.append("product_image", singleCat.product_image);
      fd.append("product_category", product_category.value);
      fd.append("raw_required", JSON.stringify(inputs));
      fd.append("product_length", singleCat.product_length);
      fd.append("product_name", singleCat.product_name);
      fd.append("product_width", singleCat.product_width);
      fd.append("repeat_width", singleCat.repeat_width);
      fd.append("_id", id);
      config = {
        method: "PUT",
        url: `${API_URL}/product/`,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
          token: token.token,
        },
        data: fd,
      };
    } else {
      singleCat["_id"] = id;
      singleCat["raw_required"] = JSON.stringify(inputs);
      singleCat["product_category"] = product_category.value;

      console.log(singleCat);

      config = {
        method: "PUT",
        url: `${API_URL}/product/`,
        headers: {
          "Content-Type": "application/json",
          token: token.token,
        },
        data: JSON.stringify(singleCat),
      };
    }

    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          setTimeout(() => {
            toast.success(response.data.msg, {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push("/dream-pos/product/productlist-product");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/dream-pos/product/productlist-product");
  };

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      { raw_id: "", substrate: "", flat_size: "", perunit_weight: "" },
    ]);
  };
  const handleDeleteInput = () => {
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
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (singleCat.repeat_width < 1) {
          singleCat.repeat_width = 1;
        }
        let flat =
          Number(singleCat.product_width) * Number(singleCat.repeat_width) + 10;
        setFlatSize(flat * Number(singleCat.product_length));
        let unitWeight =
          flat *
          Number(singleCat.product_length) *
          Number(response.data.result.raw_gsm);
        setPerUnitWeight(unitWeight / 1000000);
        inputs[index]["substrate"] = selectedText;
        if (index > 0) {
          flat = Number(flat) + 5 * index;
          console.log(flat, index);
          if (Number(response.data.result.raw_length) < flat) {
            message[index] = "Flat Size width is greater than Substrate width";
          } else if (Number(response.data.result.raw_length) > flat) {
            message[index] = "Flat Size width is less than Substrate width";
          } else if (Number(response.data.result.raw_length) === flat) {
            message[index] = "Flat Size width same as Substrate width";
          }
          inputs[index]["flat_size"] = `${flat} X ${Number(
            singleCat.product_length
          )}`;
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
            singleCat.product_length
          )}`;
        }
        inputs[index]["perunit_weight"] = unitWeight / 1000000;
        inputs[index]["raw_id"] = value;
        inputs[index]["flat_value"] = flat * Number(singleCat.product_length);
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
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response.data);
        setRawMaterial(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    // console.log()
    if (singleCat?.raw_required?.length > 0) {
      setInputs(singleCat.raw_required);
    } else {
      setInputs([
        {
          raw_id: "",
          substrate: "",
          flat_size: "",
          perunit_weight: "",
          flat_value: "",
        },
      ]);
    }
  }, [singleCat]);

  return (
    <>
      <div className="page-wrapper">
        <ToastContainer />
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Edit</h4>
              <h6>Edit a product</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="product_name"
                      onChange={handleChange}
                      value={singleCat?.product_name}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-12">
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      name="product_sku"
                      onChange={handleChange}
                      value={singleCat?.product_sku}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Product Length</label>
                    <input
                      type="text"
                      name="product_length"
                      onChange={handleChange}
                      value={singleCat?.product_length}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Product Width</label>
                    <input
                      type="text"
                      name="product_width"
                      onChange={handleChange}
                      value={singleCat?.product_width}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Repeat in width</label>
                    <input
                      type="number"
                      name="repeat_width"
                      onChange={handleChange}
                      value={singleCat?.repeat_width}
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-sm-4 col-12">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="product_category"
                      id="product_category"
                      onChange={handleChange}
                      className="cat"
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
                    <label>Choose Image</label>
                    <div className="image-size">
                      {!file && singleCat?.product_image ? (
                        <img
                          src={`https://erp.marutiprinters.in/${singleCat?.product_image}`}
                        ></img>
                      ) : (
                        <></>
                      )}

                      {file && <img src={file} />}
                    </div>
                    <input
                      type="file"
                      name="product_image"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <hr></hr>

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

export default EditProduct;
