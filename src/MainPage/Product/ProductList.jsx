/* eslint-disable no-dupe-keys */
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../EntryFile/datatable";
import { PlusIcon, EditIcon, DeleteIcon } from "../../EntryFile/imagePath";
import "react-select2-wrapper/css/select2.css";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchDropdown from "./searchDropdown";
import Modal from "react-modal";
import defaultImage from "../../assets/img/defaultimg.jpg";

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [productNameSearch, setProductNameSearch] = useState(null);
  const [categoryNameSearch, setCategoryNameSearch] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [imagePath, setimagePath] = useState();
  const [productCat, setProductCat] = useState([]);

  useEffect(() => {
    let options = [];
    let category = [];
    productList.map((item) => {
      options.push({ title: item.product_name });
    });
    productCat.map((item) => {
      category.push({ title: item.categoryName });
    });
    setProductNameSearch(options);
    setCategoryNameSearch(category);
  }, [productList]);

  const customStyles = {
    content: {
      width: "38%",
      height: "60%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zIndex: 999999,
    },
    overlay: {
      background: "#6c5a5669",
    },
  };
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  function openModal(imagepath) {
    if (imagepath !== undefined) {
      setimagePath(`https://erp.marutiprinters.in/${imagepath}`);
    } else {
      console.log(defaultImage);
      setimagePath(defaultImage);
    }
    setIsOpen(true);
  }

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      // sorter: (a, b) => a.key.length - b.key.length,
      width: "8%",
    },
    {
      title: "Name",
      dataIndex: "product_name",
      render: (text, record) => (
        <div
          className="productimgname"
          onClick={() => openModal(record.product_image)}
        >
          {record.product_name}
        </div>
      ),
      sorter: (a, b) => a.product_name.length - b.product_name.length,
      ellipsis: true,
      width: "25%",
    },
    {
      title: "SKU",
      dataIndex: "product_sku",
      sorter: (a, b) => a.product_sku.length - b.product_sku.length,
      width: "13%",
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
    fetchRawCategory();
  }, [token.token]);

  const fetchRawCategory = async () => {
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
        console.log(response.data);
        setProductCat(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
  function filterDataContainingLetterName(arr, letter) {
    return arr.filter((obj) => obj.product_name.toLowerCase().includes(letter));
  }

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
  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      setDefaultValue(selectedOption.title);
    } else {
      setDefaultValue("");
    }

    const filteredData = filterDataContainingLetterName(
      productList,
      selectedOption?.title.toLowerCase()
    );
    setFilterData(filteredData);
  };
  const handleCategorySelect = (selectedOption) => {
    if (selectedOption) {
      setDefaultValue(selectedOption.title);
    } else {
      setDefaultValue("");
    }

    const filteredData = filterDataContainingLetter(
      productList,
      selectedOption?.title.toLowerCase()
    );
    setFilterData(filteredData);
  };

  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
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
            <div className="page-btn d-flex ">
              <Link
                to="/dream-pos/product/addproduct-product"
                className="btn btn-added me-2"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Product
              </Link>
              <button className="btn btn-added" onClick={handlePrint}>
                Print
              </button>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-4 col-sm-4 col-12 mb-3">
                        {/* <div className="form-group"> */}
                        <SearchDropdown
                          options={productNameSearch}
                          onSelect={handleSelect}
                          className="searchfield"
                          placeholder={"Search by Name"}
                        />
                        {/* </div> */}
                      </div>
                      <div className="col-lg-4 col-sm-4 col-12 mb-3">
                        {/* <div className="form-group"> */}
                        <SearchDropdown
                          options={categoryNameSearch}
                          onSelect={handleCategorySelect}
                          className="searchfield"
                          placeholder={"Search by Category"}
                        />
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div ref={printRef} className="table-responsive">
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
                    dataSource={productList.reverse()}
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
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="popup-style">
          <button className="close" onClick={closeModal}>
            X
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <img src={imagePath}></img>
        </div>
      </Modal>
    </>
  );
};
export default ProductList;
