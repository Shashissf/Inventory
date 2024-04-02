/* eslint-disable no-dupe-keys */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import { PlusIcon, EditIcon, DeleteIcon } from "../../EntryFile/imagePath";
// import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
// import { noAuto } from "@fortawesome/fontawesome-svg-core";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [dropChange, setDropChange] = useState("");

  console.log(categoryList);

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      sorter: (a, b) => a.key.length - b.key.length,
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      // render: (text, record) => (
      //   <div className="productimgname">
      //     <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
      //       {record.categoryName}
      //     </Link>
      //   </div>
      // ),
      onFilter: (value, record) => record.categoryName.includes(value),
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      ellipsis: true,
    },
    {
      title: "Category Description",
      dataIndex: "categoryDescription",
      sorter: (a, b) =>
        a.categoryDescription.length - b.categoryDescription.length,
    },
    {
      title: "Category Type",
      dataIndex: "type",
      sorter: (a, b) => a.type.length - b.type.length,
    },

    {
      title: "Action",
      render: (text, record) => (
        <>
          <Link
            className="me-3"
            to={`/dream-pos/product/editcategory-product/${record._id}`}
          >
            <img src={EditIcon} alt="img" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];

  const token = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    fetchData();
  }, [token.token]);

  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/category`,
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

  useEffect(() => {
    fetchDropData();
  }, [dropChange]);

  const handleDropdown = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setDropChange(value);
    console.log(name, value);
  };

  const fetchDropData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/category/?type=${dropChange}`,
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

  const handleDelete = async (id) => {
    var confirmDelete;
    if (confirm("Do you want to delete !!")) {
      confirmDelete = true;
    } else {
      confirmDelete = false;
    }
    if (confirmDelete) {
      const config = {
        method: "DELETE",
        url: `${API_URL}/category/${id}`,
        headers: {
          "Content-Type": "application/json",
          token: token.token,
        },
      };
      await axios(config)
        .then((response) => {
          console.log(response.data);
          toast.success(response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
          fetchData();
        })
        .catch((error) => {
          console.log(error);
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
              <h4>Category List</h4>
              <h6>Manage your Categories</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/product/addcategory-product"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Product
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
                          <select
                            className="select"
                            name="changedrop"
                            onChange={handleDropdown}
                          >
                            <option value={""}>Choose Category Type</option>
                            <option value="PRODUCT">Product</option>
                            <option value="RAW-MATERIAL">Raw Material</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={categoryList}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default CategoryList;
