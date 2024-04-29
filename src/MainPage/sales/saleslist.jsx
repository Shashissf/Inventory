/* eslint-disable no-dupe-keys */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../EntryFile/datatable";
import { PlusIcon, DeleteIcon } from "../../EntryFile/imagePath";
import "react-select2-wrapper/css/select2.css";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select } from "antd";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";

const SalesList = () => {
  const [orderList, setOrderList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [singleYieldData, setSingleYieldData] = useState({});
  const [orderData, setOrderData] = useState({});

  const history = useHistory();

  var options = [
    { label: "Not Started", value: "Not Started" },
    { label: "Processing", value: "Processing" },
    { label: "Completed", value: "Completed" },
    { label: "Stuck", value: "Stuck" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const customStyles = {
    content: {
      width: "40%",
      height: "70%",
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
  const customOrderStyles = {
    content: {
      width: "60%",
      height: "70%",
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

  function openModal(data, record) {
    console.log(record);
    setSingleYieldData(record);
    getSingleOrderDetails(record);
    setIsOpen(data);
  }

  const getSingleOrderDetails = async (id) => {
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
        console.log(response.data);
        setOrderData(response.data.result);
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

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      sorter: (a, b) => a.key - b.key,
    },
    // {
    //   title: "Order Id",
    //   dataIndex: "order_id",
    //   sorter: (a, b) => a.order_id.length - b.order_id.length,
    // },
    {
      title: "Customer Name",
      dataIndex: "customername",
      render: (text, record) => (
        <div
          className="productimgname"
          onClick={() => openModal("orderDetails", record._id)}
        >
          {record.customername}
        </div>
      ),
      sorter: (a, b) => a.customername.length - b.customername.length,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      render: (text, record) => (
        <div
          className="productimgname"
          onClick={() => openModal("orderDetails", record._id)}
        >
          {record.product_name}
        </div>
      ),
      sorter: (a, b) => a.product_name.length - b.product_name.length,
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "Date",
      render: (text, record) => {
        let date = new Date(record.Date);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
          dt = "0" + dt;
        }
        if (month < 10) {
          month = "0" + month;
        }
        return year + "-" + month + "-" + dt;
      },
    },
    {
      title: "Weight(KG)",
      dataIndex: "product_weight",
      sorter: (a, b) => a.product_weight.length - b.product_weight.length,
    },
    {
      title: "R/M Status",
      dataIndex: "order_type",
    },
    {
      title: "Order Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          <div>
            <Select
              style={{ width: "100%" }}
              onChange={(e) => handleStatus(e, record)}
              value={{ label: record.status, value: record.status }}
              options={options}
            />
          </div>
        </>
      ),
      sorter: (a, b) => a.product_weight.length - b.product_weight.length,
    },
    {
      title: "Yield",
      dataIndex: "yield",
      render: (text, record) => (
        <>
          <div>
            <button
              className="yield"
              onClick={() => openModal("yield", record)}
            >
              {record.actual_field_weight
                ? Math.round(record.actual_field_weight * 100) / 100
                : "100"}
              %
            </button>
          </div>
        </>
      ),
      sorter: (a, b) => a.yield - b.yield,
    },
    {
      title: "Action",
      render: (text, record) => {
        if (record.order_type === "Non - Deducted") {
          return (
            <>
              <button
                onClick={() => handleDeductStock(record._id)}
                className="btn btn-submit-disable me-2"
                // disabled={submitButDis}
              >
                Deduct Stock
              </button>
              <Link
                to="#"
                onClick={() => handleDelete(record.raw_required, record._id)}
              >
                <img src={DeleteIcon} alt="img" />
              </Link>
            </>
          );
        } else {
          return (
            <Link
              to="#"
              onClick={() => handleDelete(record.raw_required, record._id)}
            >
              <img src={DeleteIcon} alt="img" />
            </Link>
          );
        }
      },
    },
  ];

  const handleStatus = async (selectedValue, data) => {
    data["status"] = selectedValue;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios
      .put(`${API_URL}/order`, data, config)
      .then((response) => {
        console.log(response.data);
        if (response.data?.result?.modifiedCount > 0) {
          toast.success("order status updated", {
            position: toast.POSITION.TOP_CENTER,
          });
          fetchData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const token = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    fetchData();
  }, [token.token]);

  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/order`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        response?.data?.result.map((item) => {
          console.log(item.status);
        });
        setOrderList(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function filterDataContainingLetter(arr, letter) {
    return arr.filter((obj) => obj.product_name.toLowerCase().includes(letter));
  }
  function filterDataContainingLetterCustomer(arr, letter) {
    return arr.filter((obj) => obj.customername.toLowerCase().includes(letter));
  }
  function filterDataContainingOrderStatus(arr, letter) {
    return arr.filter((obj) => obj.status.includes(letter));
  }

  const handleSearchCategory = (e) => {
    let value = e.target.value;
    setDefaultValue(value);

    const filteredData = filterDataContainingLetter(
      orderList,
      value.toLowerCase()
    );
    setFilterData(filteredData);
  };
  const handleSearchCustomers = (e) => {
    let value = e.target.value;
    setDefaultValue(value);
    const filteredData = filterDataContainingLetterCustomer(
      orderList,
      value.toLowerCase()
    );
    setFilterData(filteredData);
  };

  const handleOrderStatus = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setDefaultValue(value);
    const filteredData = filterDataContainingOrderStatus(orderList, value);
    console.log(filteredData);
    setFilterData(filteredData);
  };

  const handleDelete = async (data, id) => {
    let rawid = [];
    data?.map((item) => {
      rawid.push(item.raw_id);
    });
    console.log(rawid);

    var confirmDelete;
    if (
      confirm("Do you want to delete? This will re-add raw material stocks")
    ) {
      confirmDelete = true;
    } else {
      confirmDelete = false;
    }
    if (confirmDelete) {
      const config = {
        method: "POST",
        url: `${API_URL}/order/revertstock/`,
        headers: {
          "Content-Type": "application/json",
          token: token.token,
        },
        data: { rawid },
      };
      await axios(config)
        .then((response) => {
          console.log(response.data);
          toast.success(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
          handleClearData(id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleClearData = async (id) => {
    const config = {
      method: "DELETE",
      url: `${API_URL}/order/${id}/`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response.data);
        toast.success(response.data.msg, {
          position: toast.POSITION.TOP_CENTER,
        });
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeductStock = (id) => {
    history.push(`edit-sales/${id}`);
  };

  const handleSubmit = async () => {
    let actualFieldWeight = document.getElementById(
      "actual_field_weight"
    ).value;
    let val =
      (100 * Number(actualFieldWeight)) /
      Number(singleYieldData.product_weight);
    // console.log(actualFieldWeight, singleYieldData.product_weight, val);
    console.log(val);
    let data = {};
    data["actual_field_weight"] = val;
    data["_id"] = singleYieldData._id;
    if (val) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: token.token,
        },
      };
      await axios
        .put(`${API_URL}/order`, data, config)
        .then((response) => {
          console.log(response.data);
          if (response.data?.result?.modifiedCount > 0) {
            toast.success("Yield updated", {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsOpen(false);
            fetchData();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const getNewDate = (date) => {
    var timestamp = Number(new Date(date));
    var gdate = new Date(timestamp).toDateString();
    return gdate;
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ToastContainer />
          <div className="page-header">
            <div className="page-title">
              <h4>Order List</h4>
              <h6>Manage your Sales</h6>
            </div>
            <div className="page-btn">
              <Link to="/dream-pos/sales/add-sales" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Order
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-4 col-sm-4 col-xs-6">
                        <div className="form-group">
                          <input
                            type="text"
                            name="changedrop"
                            placeholder="Search Customers...."
                            onChange={handleSearchCustomers}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-xs-6">
                        <div className="form-group">
                          <input
                            type="text"
                            name="changedrop"
                            placeholder="Search Products...."
                            onChange={handleSearchCategory}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-xs-6">
                        <div className="form-group">
                          <select
                            name="status"
                            id="status"
                            className="cat"
                            onChange={handleOrderStatus}
                          >
                            <option value="">Search by Status</option>
                            <option value="Not Started">Not Started</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Stuck">Stuck</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                {defaultValue?.length > 0 ? (
                  <>
                    <Table
                      columns={columns}
                      dataSource={filterData}
                      rowKey={(record) => record.id}
                    />
                  </>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={orderList}
                    rowKey={(record) => record.id}
                  />
                )}
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen === "yield"}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="popup-style">
          <h2>Actual Product Weight</h2>
          <button className="close" onClick={closeModal}>
            X
          </button>
        </div>
        <hr></hr>

        <div className="row">
          <div className="col-lg-6 col-sm-6 col-12 form-group my-3">
            <label>Actual Weight</label>

            <input
              type="number"
              name="actual_field_weight"
              id="actual_field_weight"
              // value={actualFieldWeight.actual_field_weight}
            />
          </div>
        </div>

        <button className="btn btn-submit-disable me-2" onClick={handleSubmit}>
          Submit
        </button>
      </Modal>
      <Modal
        isOpen={modalIsOpen === "orderDetails"}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customOrderStyles}
        contentLabel="Example Modal"
      >
        <div className="popup-style">
          <h2>Order Details</h2>
          <button className="close" onClick={closeModal}>
            X
          </button>
        </div>
        <hr></hr>

        <div className="row">
          <div className="col-lg-6 col-sm-6 col-12 form-group my-3">
            <h4>
              <strong>Customer Name</strong> : {orderData.customername}
            </h4>
            <h4>
              <strong>Order Date</strong> :{" "}
              {orderData?.Date && getNewDate(orderData?.Date)}
            </h4>
            <h4>
              <strong>Raw Material Status</strong> : {orderData.order_type}
            </h4>
          </div>
          <div className="col-lg-6 col-sm-6 col-12 form-group my-3">
            <h4>
              <strong>Product Name</strong> : {orderData.product_name}
            </h4>
            <h4>
              <strong>Weight</strong> : {orderData.product_weight}
            </h4>
            <h4>
              <strong>Order Status</strong> : {orderData.status}
            </h4>
          </div>
          <div className="col-lg-12 col-sm-12 col-12 form-group my-3">
            <h4>
              <strong>Raw Materials</strong> :
            </h4>
            <table className="orderDetails">
              <tr>
                <td>Name</td>
                <td>Required Weight</td>
                <td>Stock Deduction</td>
              </tr>

              {orderData?.raw_required?.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td key={index}>{item.substrate}</td>
                      <td key={index}>{item.req_weight}</td>
                      <td key={index}></td>
                    </tr>
                  </>
                );
              })}
            </table>
          </div>
          <div className="d-flex">
            {orderData.order_type === "Non - Deducted" && (
              <>
                <button
                  style={{ width: "200px" }}
                  onClick={() => handleDeductStock(orderData._id)}
                  className="btn btn-submit-disable me-2"
                  // disabled={submitButDis}
                >
                  Deduct Stock
                </button>
              </>
            )}
            <div>
              <Select
                style={{ width: "200px", height: "45px", border: "2px solid" }}
                onChange={(e) => handleStatus(e, orderData)}
                value={{ label: orderData.status, value: orderData.status }}
                options={options}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SalesList;
