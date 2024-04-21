import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reset from "../../assets/img/reset1.png";

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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement("#yourAppElement");

const Editsales = () => {
  const [weight, setweight] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [stockDeduction, setStockDeduction] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [CalculateEnable, setCalculateEnable] = useState(false);
  // const [submitButDis, setSubmitButDis] = useState(true);
  var addDed = 0;
  let rawStockId = 1;

  function openModal() {
    setIsOpen(true);
  }

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    fetchSingleOrder();
  }, [id]);

  const fetchSingleOrder = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/order/${id}`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data.result);
        setweight(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [inputs, setInputs] = useState([]);
  const [bottomSum, setBottomSum] = useState(0);
  const history = useHistory();

  const token = JSON.parse(localStorage.getItem("items"));

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
    setweight({ ...weight, [name]: value });
  };

  const handleCancel = () => {
    history.push("/dream-pos/sales/saleslist/");
  };

  const calculate = async (e) => {
    e.preventDefault();
    console.log(weight);
    // setSubmitButDis(true);
    const config = {
      method: "GET",
      url: `${API_URL}/product/${weight?.product_id}`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response.data.result);
        console.log(setInputs);
        setCalculateEnable(true);
        // setInputs(response.data.result.raw_required);
        let topSum = 0;
        response.data?.result?.raw_required?.map((item) => {
          topSum = weight.product_weight * parseFloat(item.perunit_weight);
          // bottomSum += item.perunit_weight;
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
      method: "PUT",
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

    if (!item["total_weight"]) {
      item["total_weight"] = 0;
    }
    let tot = item["total_weight"] + manage_weight;

    // if (tot >= Number(req_weight.value)) {
    //   // setPlusButton(true);
    //   // addButton.disabled = true;
    // }
    if (manage_weight <= 0) {
      toast.error("Enter a Positive Value", {
        position: toast.POSITION.TOP_CENTER,
      });
      // alert("More than required stock");
      return;
    }
    if (dropValue.stock_weight < manage_weight) {
      // alert("Insufficient Stock");
      toast.error("Insufficient Stock", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else if (req_weight.value < manage_weight) {
      toast.error("More than required stock", {
        position: toast.POSITION.TOP_CENTER,
      });
      // alert("More than required stock");
      return;
    } else if (tot > Number(req_weight.value)) {
      addButton.disabled = true;
      toast.error("You are adding more than required weight", {
        position: toast.POSITION.TOP_CENTER,
      });
      // alert("You are adding more than required weight");
      return;
    } else {
      const indexToUpdate = stockDeduction.findIndex(
        (obj) => obj.id === dropValue.id
      );

      if (indexToUpdate !== -1) {
        const newData = [...stockDeduction];
        dropValue.manage_weight = manage_weight;
        newData[indexToUpdate] = dropValue;

        console.log(newData);
        setStockDeduction(newData);
      } else {
        item["total_weight"] = item["total_weight"] + manage_weight;
        dropValue["manage_weight"] = manage_weight;
        arr.push(dropValue);
        setStockDeduction(arr);
      }
    }
  };
  const handleSubmitStock = async () => {
    let mergedArray = [];
    rawMaterial.map((item) => {
      item?.raw_stock.map((subitem) => {
        mergedArray.push(subitem);
      });
    });
    console.log(stockDeduction);
    for (const obj2 of stockDeduction) {
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
      acc[raw_id].push(rest);
      return acc;
    }, {});
    console.log(groupedData);
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
  useEffect(() => {
    console.log(stockDeduction);
  }, [stockDeduction]);

  const handleDeleteStock = (index, item) => {
    setStockDeduction([]);
    item["total_weight"] = 0;
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ToastContainer />
          <div className="page-header">
            <div className="page-title">
              <h4>Edit Order</h4>
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
                        value={weight.customername}
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
                      >
                        <option value={""}>Select Product</option>
                        {allProducts?.map((item) => {
                          var selected = false;
                          item.product_name === weight.product_name
                            ? (selected = true)
                            : (selected = false);
                          return (
                            <option
                              selected={selected}
                              value={item._id}
                              key={item._id}
                            >
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
                        value={weight.product_weight}
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
                {inputs?.map((item, index) => {
                  console.log(item);
                  let rq_weight = item.req_weight / bottomSum;
                  rq_weight = Math.ceil(rq_weight * 100) / 100;
                  return (
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
                          disabled
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
                  );
                })}

                <div className="col-lg-12">
                  <button
                    className="btn btn-submit me-2"
                    disabled={!CalculateEnable}
                    onClick={() => handleSubmit("Non - Deducted")}
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
                                name="req_weight"
                                id={`req_weight${index}`}
                                value={item.substrate}
                                disabled
                              />

                              {/* <select
                                name="substrate"
                                id={`raw_category${index}`}
                                className="cat"
                                disabled
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
                                      {items.raw_name} - G : {items.raw_gauge} |
                                      W : {items.raw_length} | GSM :{" "}
                                      {items.raw_gsm}
                                    </option>
                                  );
                                })}
                              </select> */}
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
                                >
                                  {rawMaterial?.map((rawitem) => {
                                    if (rawitem._id === item.raw_id) {
                                      return (
                                        <>
                                          {rawitem?.raw_stock.map(
                                            (subitem, index) => {
                                              subitem["raw_id"] = item.raw_id;
                                              subitem["id"] = rawStockId;
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
                            {/* <div
                              className="col-lg-2 col-sm-2 col-12 form-group my-3"
                              key={index}
                            >
                              <div className="form-group"></div>
                              <button
                                onClick={() => handleDeleteStock(index, item)}
                                className="delplus"
                                id={`delplus${index}`}
                                // disabled={plusButton}
                              >
                                -
                              </button>
                            </div> */}

                            {/* <div className="body"> {JSON.stringify(inputs)} </div> */}
                            <div className="stock-cal">
                              <h4>
                                Stock:{" "}
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

export default Editsales;
