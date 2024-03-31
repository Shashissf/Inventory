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

const SalesList = () => {
  const [orderList, setOrderList] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const history = useHistory();

  var options = [
    { label: "Not Started", value: "Not Started" },
    { label: "Processing", value: "Processing" },
    { label: "Completed", value: "Completed" },
    { label: "Stuck", value: "Stuck" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      sorter: (a, b) => a.key.length - b.key.length,
    },
    // {
    //   title: "Order Id",
    //   dataIndex: "order_id",
    //   sorter: (a, b) => a.order_id.length - b.order_id.length,
    // },
    {
      title: "Customer Name",
      dataIndex: "customername",
      sorter: (a, b) => a.customername.length - b.customername.length,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      render: (text, record) => (
        <div className="productimgname">{record.product_name}</div>
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
      title: "Weight",
      dataIndex: "product_weight",
      sorter: (a, b) => a.product_weight.length - b.product_weight.length,
    },
    {
      title: "R/M Status",
      dataIndex: "order_type",
      // sorter: (a, b) => a.product_weight.length - b.product_weight.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          <div>
            <Select
              style={{ width: "100%" }}
              onChange={(e) => handleStatus(e, record)}
              defaultValue={{ label: record.status, value: record.status }}
              options={options}
            />
          </div>
        </>
      ),
      sorter: (a, b) => a.product_weight.length - b.product_weight.length,
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
        setOrderList(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function filterDataContainingLetter(arr, letter) {
    return arr.filter((obj) => obj.product_name.includes(letter));
  }
  function filterDataContainingLetterCustomer(arr, letter) {
    return arr.filter((obj) => obj.customername.includes(letter));
  }
  function filterDataContainingOrderStatus(arr, letter) {
    return arr.filter((obj) => obj.status.includes(letter));
  }

  const handleSearchCategory = (e) => {
    let value = e.target.value;
    const filteredData = filterDataContainingLetter(orderList, value);
    setFilterData(filteredData);
  };
  const handleSearchCustomers = (e) => {
    let value = e.target.value;
    const filteredData = filterDataContainingLetterCustomer(orderList, value);
    setFilterData(filteredData);
  };

  const handleOrderStatus = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
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
    if (confirm("Do you want to delete !!")) {
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
                      <div className="col-lg-4 col-sm-4 col-4">
                        <div className="form-group">
                          <input
                            type="text"
                            name="changedrop"
                            placeholder="Search Customers...."
                            onChange={handleSearchCustomers}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-4">
                        <div className="form-group">
                          <input
                            type="text"
                            name="changedrop"
                            placeholder="Search Products...."
                            onChange={handleSearchCategory}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-4 col-4">
                        <div className="form-group">
                          <select
                            name="order_status"
                            id="order_status"
                            className="cat"
                            onChange={handleOrderStatus}
                          >
                            <option value={""}>Search by Status</option>
                            <option value={"Not Started"}>Not Started</option>
                            <option value={"Processing"}>Processing</option>
                            <option value={"Completed"}>Completed</option>
                            <option value={"Stuck"}>Stuck</option>
                            <option value={"Cancelled"}>Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                {filterData.length > 0 ? (
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
    </>
  );
};
export default SalesList;
