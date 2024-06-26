import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reset from "../../assets/img/reset1.png";
import defaultimg from "../../assets/img/defaultimg.jpg";

const customStyles = {
  content: {
    width: "60%",
    height: "80%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    background: "#6c5a5669",
  },
};

const Addsales = () => {
  const [weight, setweight] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [stockDeduction, setStockDeduction] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [imagePath, setimagePath] = useState();
  const [imageFlag, setImageFlag] = useState(false);

  var addDed = 0;

  let rawStockId = 1;
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setStockDeduction([]);
    setIsOpen(false);
    {
      inputs?.map((item) => {
        item.total_weight = 0;
        // item.req_weight = 0;
        return item;
      });
    }
  }

  const [inputs, setInputs] = useState([]);
  const [bottomSum, setBottomSum] = useState(0);
  const [CalculateEnable, setCalculateEnable] = useState(false);

  const history = useHistory();

  const token = JSON.parse(localStorage.getItem("items"));

  // useEffect(() => {
  //   console.log(addDed);
  // }, [addDed]);

  useEffect(() => {
    fetchData();
    fetchRawMaterials();
  }, [token.token]);

  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/product/`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        setAllProducts(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setimagePath("");
    setImageFlag(false);
    if (name === "product_name") {
      setCalculateEnable(false);
      setInputs([]);
    }
    setweight({ ...weight, [name]: value });
  };

  const handleCancel = () => {
    history.push("/dream-pos/sales/saleslist/");
  };

  const calculate = async (e) => {
    e.preventDefault();
    const config = {
      method: "GET",
      url: `${API_URL}/product/${weight?.product_name}`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data.result);
        setimagePath(response.data.result?.product_image);
        setImageFlag(true);
        let topSum = 0;
        if (response.data?.result?.raw_required?.length > 0) {
          setCalculateEnable(true);
        }
        response.data?.result?.raw_required?.map((item) => {
          topSum = weight.product_weight * parseFloat(item.perunit_weight);
          setBottomSum((prevSum) => prevSum + item.perunit_weight);

          let obj = {
            raw_id: item.raw_id,
            substrate: item.substrate,
            req_weight: Math.ceil(topSum * 100) / 100,
            current_stock: item.weight,
          };
          inputs.push(obj);
        });
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
        console.log(response.data.result);
        setRawMaterial(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (deducted) => {
    let product_category = document.getElementById("product_category");
    inputs.map((row) => {
      let deductionString = document.getElementById(
        `deduction-content-${row.raw_id}`
      ).innerText;
      row["deductionString"] = deductionString;
      return row;
    });
    let datas = {};
    console.log(deducted);
    if (deducted === "Deducted") {
      datas = {
        product_id: product_category.value,
        product_name:
          product_category.options[product_category.selectedIndex].text,
        product_weight: weight.product_weight,
        customername: weight.customername,
        raw_required: inputs,
        order_type: "Deducted",
      };
    } else {
      datas = {
        product_id: product_category.value,
        product_name:
          product_category.options[product_category.selectedIndex].text,
        product_weight: weight.product_weight,
        customername: weight.customername,
        raw_required: inputs,
        order_type: "Non - Deducted",
      };
    }

    const config = {
      method: "POST",
      url: `${API_URL}/order`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
      data: datas,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        history.push("/dream-pos/sales/saleslist");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStockDec = (index, item) => {
    let dropValue = document.getElementById("stock_deduction" + index);
    let manage_weight = document.getElementById("manage_weight" + index);
    let req_weight = document.getElementById("req_weight" + index);
    let addButton = document.getElementById("addplus" + index);
    manage_weight = Number(manage_weight.value);
    dropValue = JSON.parse(dropValue.value);
    let arr = [...stockDeduction];
    console.log(dropValue, req_weight.value, manage_weight);

    if (!item["total_weight"]) {
      item["total_weight"] = 0;
    }
    let tot = item["total_weight"] + manage_weight;

    if (manage_weight <= 0) {
      toast.error("Enter a Positive Value", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (dropValue.stock_weight < manage_weight) {
      toast.error("Insufficient Stock", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else if (req_weight.value < manage_weight) {
      toast.error("More than required stock", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else if (tot > Number(req_weight.value)) {
      addButton.disabled = true;
      toast.error("You are adding more than required weight", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else {
      const indexToUpdate = stockDeduction.findIndex(
        (obj) => obj.id === dropValue.id
      );
      // console.log(indexToUpdate);
      if (indexToUpdate !== -1) {
        const newData = [...stockDeduction];
        dropValue.manage_weight = manage_weight;
        newData[indexToUpdate] = dropValue;

        setStockDeduction(newData);
      } else {
        item["total_weight"] = item["total_weight"] + manage_weight;
        dropValue["manage_weight"] = manage_weight;

        arr.push(dropValue);
        setStockDeduction(arr);
      }
    }
  };
  useEffect(() => {
    console.log(stockDeduction);
  }, [stockDeduction]);

  const checkRawInclude = (id) => {
    let val = inputs.findIndex((raw) => raw.raw_id === id);
    // console.log(val);
    return val;
  };
  const handleSubmitStock = async () => {
    let mergedArray = [];
    rawMaterial.map((item) => {
      // console.log(checkRawInclude(item._id));
      if (checkRawInclude(item._id) !== -1) {
        console.log(item);
        item?.raw_stock.map((subitem) => {
          mergedArray.push(subitem);
        });
      }
    });
    for (const obj2 of stockDeduction) {
      // console.log(obj2);
      const existingIndex = mergedArray.findIndex(
        (obj1) => obj1.batch_no === obj2.batch_no
      );
      if (existingIndex !== -1) {
        obj2.stock_weight = obj2.stock_weight - obj2.manage_weight;
        mergedArray[existingIndex] = { ...mergedArray[existingIndex], ...obj2 };
      } else {
        mergedArray.push(obj2);
      }
    }
    console.log(mergedArray);
    const groupedData = mergedArray.reduce((acc, curr) => {
      const { raw_id, ...rest } = curr;
      if (!raw_id) {
        return acc;
      }
      if (!acc[raw_id]) {
        acc[raw_id] = [];
      }
      delete rest.manage_weight;
      delete rest.id;
      console.log(raw_id, acc, "22311111111111111");
      acc[raw_id].push(rest);
      return acc;
    }, {});
    // console.log(groupedData);
    let data = { stockData: groupedData, order_type: "Deducted" };
    const config = {
      method: "PUT",
      url: `${API_URL}/order/stockdeduction`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
      data: data,
    };
    console.log(data);
    await axios(config)
      .then((response) => {
        console.log(response.data);
        handleSubmit("Deducted");
        history.push("/dream-pos/sales/saleslist/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteStock = () => {
    setStockDeduction([]);
    {
      inputs?.map((item) => {
        item.total_weight = 0;
        return item;
      });
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ToastContainer />
          <div className="page-header">
            <div className="page-title">
              <h4>Add Order</h4>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <form className="sales-form" onSubmit={calculate}>
                  <div className="col-lg-3 col-sm-3 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <input
                        type="text"
                        name="customername"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-3 col-12">
                    <div className="form-group">
                      <label>Select Product</label>
                      <select
                        name="product_name"
                        id="product_category"
                        className="cat"
                        onChange={handleChange}
                        style={{ height: "40px", fontSize: "14px" }}
                      >
                        <option value={""}>Select Product</option>
                        {allProducts?.map((item) => {
                          return (
                            <option value={item._id} key={item._id}>
                              {item.product_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-3 col-sm-3 col-12">
                    <div className="form-group">
                      <label>Product Weight(KG)</label>
                      <input
                        type="number"
                        name="product_weight"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-4 col-12">
                    <button
                      disabled={CalculateEnable}
                      className="btn btn-submit-disable me-2"
                    >
                      Calculate
                    </button>
                  </div>
                </form>
                <hr></hr>

                <h6 className="pb-3">Raw Material requirements - </h6>
                <div className="add-sale-design-section">
                  <div className="add-sale-design">
                    {inputs?.map((item, index) => {
                      let rq_weight = item.req_weight / bottomSum;
                      rq_weight = Math.ceil(rq_weight * 100) / 100;
                      return (
                        <>
                          <div className="row" key={index}>
                            <div
                              className="col-lg-3 col-sm-3 col-12 form-group"
                              key={index}
                            >
                              <label>Substrate {index + 1}</label>
                              <input
                                type="text"
                                name="req_weight"
                                value={item.substrate}
                                disabled
                              />
                              {/* <select
                          name="substrate"
                          id={`raw_category${index}`}
                          className="cat"
                          // disabled
                          // onChange={(event) => handleCalChange(event, index)}
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
                        </select> */}
                            </div>
                            <div
                              className="col-lg-3 col-sm-3 col-12 form-group"
                              key={index}
                            >
                              <div className="form-group">
                                <label>Require Weight(KG)</label>
                                <input
                                  type="text"
                                  name="req_weight"
                                  value={rq_weight}
                                  disabled
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-3 col-sm-3 col-12 form-group"
                              key={index}
                            >
                              <div className="form-group">
                                <label>Current Stock(KG)</label>
                                <input
                                  type="text"
                                  name="current_stock"
                                  value={item.current_stock}
                                  disabled
                                />
                              </div>
                            </div>
                            {/* <div className="body"> {JSON.stringify(inputs)} </div> */}
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <div className="image-size">
                    {imagePath && imageFlag && (
                      <>
                        <img
                          src={`https://erp.marutiprinters.in/${imagePath}`}
                        ></img>
                      </>
                    )}
                    {!imagePath && imageFlag && (
                      <>
                        <img src={defaultimg}></img>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-lg-12">
                  <button
                    className="btn btn-submit me-2"
                    onClick={() => handleSubmit("Non - Deducted")}
                    disabled={!CalculateEnable}
                  >
                    Submit
                  </button>
                  <button className="btn btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button
                    disabled={!CalculateEnable}
                    className="btn btn-submit mx-2"
                    onClick={openModal}
                  >
                    Submit and Deduct Stock
                  </button>
                  <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <div className="popup-style">
                      <h2>Stock Deduction</h2>
                      <button className="close" onClick={closeModal}>
                        X
                      </button>
                    </div>
                    <hr></hr>
                    {inputs?.map((item, index) => {
                      let m_weight = item.req_weight / bottomSum;
                      m_weight = Math.ceil(m_weight * 100) / 100;
                      addDed = m_weight - item["total_weight"];
                      return (
                        <>
                          <div className="row" key={index}>
                            <div
                              className="col-lg-3 col-sm-3 col-12 form-group my-3"
                              key={index}
                            >
                              <label>Substrate {index + 1}</label>
                              <input
                                type="text"
                                name="substrate"
                                id={`substrate${index}`}
                                value={item.substrate}
                                disabled
                              />
                            </div>
                            <div
                              className="col-lg-2 col-sm-2 col-12 form-group my-3"
                              key={index}
                            >
                              <div className="form-group">
                                <label>Require Weight</label>
                                <input
                                  type="text"
                                  name="req_weight"
                                  id={`req_weight${index}`}
                                  value={m_weight}
                                  disabled
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-3 col-sm-3 col-12 form-group my-3"
                              key={index}
                            >
                              <div className="form-group">
                                <label>Stock Deduction</label>
                                <select
                                  name="stock_deduction"
                                  id={`stock_deduction${index}`}
                                  className="cat"
                                  style={{ height: "40px", fontSize: "14px" }}
                                >
                                  {rawMaterial?.map((rawitem) => {
                                    if (rawitem._id === item.raw_id) {
                                      console.log();

                                      return (
                                        <>
                                          {rawitem?.raw_stock.map(
                                            (subitem, index) => {
                                              if (subitem.status != false) {
                                                subitem["raw_id"] = item.raw_id;
                                                subitem["id"] = rawStockId;
                                                subitem[
                                                  "previous_stock_weight"
                                                ] = subitem.stock_weight;
                                                rawStockId++;

                                                // setRawStockId((prev) => prev + 1);
                                                return (
                                                  <option
                                                    value={JSON.stringify(
                                                      subitem
                                                    )}
                                                    key={index}
                                                  >
                                                    {subitem.batch_no}-
                                                    {subitem.stock_weight}
                                                  </option>
                                                );
                                              }
                                            }
                                          )}
                                          ;
                                        </>
                                      );
                                    }
                                  })}
                                </select>
                              </div>
                            </div>
                            <div
                              className="col-lg-2 col-sm-2 col-12 form-group my-3"
                              key={index}
                            >
                              <div className="form-group">
                                <label>Deduct Weight</label>
                                <input
                                  type="text"
                                  name="manage_weight"
                                  id={`manage_weight${index}`}
                                ></input>
                              </div>
                            </div>
                            <div
                              className="col-lg-2 col-sm-2 col-12 form-group my-3"
                              key={index}
                            >
                              <div className="form-group"></div>
                              <button
                                style={{ marginRight: "10px" }}
                                onClick={() => handleStockDec(index, item)}
                                className="addplus"
                                id={`addplus${index}`}
                                // disabled={plusButton}
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleDeleteStock(index, item)}
                                className="reset"
                                id={`delplus${index}`}
                                // disabled={plusButton}
                              >
                                <img src={reset} />
                              </button>
                            </div>
                            <div className="stock-cal">
                              <h4>
                                Stock:{" "}
                                <div id={`deduction-content-${item.raw_id}`}>
                                  {stockDeduction?.map((stockitem, index) => {
                                    if (stockitem?.raw_id === item?.raw_id) {
                                      return (
                                        <span key={index}>
                                          {`${stockitem.batch_no} - ${stockitem.manage_weight}`}
                                          {` `}+{` `}
                                        </span>
                                      );
                                    }
                                  })}
                                </div>
                              </h4>
                              <h4>
                                Add/Deduct:{""}
                                {addDed && addDed !== m_weight ? (
                                  addDed.toFixed(2)
                                ) : (
                                  <></>
                                )}
                              </h4>
                            </div>
                            <hr></hr>
                          </div>
                        </>
                      );
                    })}
                    <button
                      onClick={handleSubmitStock}
                      id="disable"
                      className="btn btn-submit-disable me-2"
                      // disabled={submitButDis}
                    >
                      Submit
                    </button>
                  </Modal>
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

export default Addsales;
