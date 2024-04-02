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

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);

  console.log(productList);

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      sorter: (a, b) => a.key.length - b.key.length,
    },
    {
      title: "Name",
      dataIndex: "product_name",
      render: (text, record) => (
        <div className="productimgname">{record.product_name}</div>
      ),
      sorter: (a, b) => a.product_name.length - b.product_name.length,
      ellipsis: true,
    },
    {
      title: "SKU",
      dataIndex: "product_sku",
      sorter: (a, b) => a.product_sku.length - b.product_sku.length,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      render: (text, record) => <>{record.product_category?.categoryName}</>,
      sorter: (a, b) =>
        a.product_category?.categoryName.length -
        b.product_category?.categoryName.length,
    },
    {
      title: "Length (mm)",
      dataIndex: "product_length",
      sorter: (a, b) => a.product_length.length - b.product_length.length,
    },
    {
      title: "Width (mm)",
      dataIndex: "product_width",
      sorter: (a, b) => a.product_width.length - b.product_width.length,
    },

    {
      title: "Action",
      render: (text, record) => (
        <>
          <Link
            className="me-3"
            to={`/dream-pos/product/editproduct-product/${record._id}`}
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
      url: `${API_URL}/product`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        setProductList(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function filterDataContainingLetter(arr, letter) {
    return arr.filter((obj) =>
      obj.product_category?.categoryName.toLowerCase().includes(letter)
    );
  }

  const handleSearchCategory = (e) => {
    let value = e.target.value;
    setDefaultValue(value);
    const filteredData = filterDataContainingLetter(
      productList,
      value.toLowerCase()
    );
    setFilterData(filteredData);
    // console.log(filteredData);
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
        url: `${API_URL}/product/${id}`,
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
              <h4>Product List</h4>
              <h6>Manage your Products</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/product/addproduct-product"
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
                          <input
                            type="text"
                            name="changedrop"
                            placeholder="Search by Category...."
                            onChange={handleSearchCategory}
                          />
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
                    dataSource={productList}
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
export default ProductList;
