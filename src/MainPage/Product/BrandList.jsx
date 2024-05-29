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

const BrandList = () => {
  const [rawMaterial, setRawMaterial] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [rawNameSearch, setRawNameSearch] = useState(null);

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      sorter: (a, b) => a.key.length - b.key.length,
      width: "6%",
    },
    {
      title: "Name",
      dataIndex: "raw_name",
      // render: (text, record) => (
      //   <div className="productimgname">
      //     <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
      //       {record.raw_name}
      //     </Link>
      //   </div>
      // ),
      sorter: (a, b) => a.raw_name.length - b.raw_name.length,
      width: "15%",
    },
    {
      title: "SKU",
      dataIndex: "raw_sku",
      sorter: (a, b) => a.raw_sku.length - b.raw_sku.length,
      width: "13%",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      render: (text, record) => <>{record.raw_category?.categoryName}</>,
      sorter: (a, b) =>
        a.raw_category?.categoryName.length -
        b.raw_category?.categoryName.length,
      width: "15%",
    },
    {
      title: "Gauge",
      dataIndex: "raw_gauge",
      sorter: (a, b) => a.raw_gauge.length - b.raw_gauge.length,
    },
    {
      title: "Weight (KG)",
      dataIndex: "raw_weight",
      sorter: (a, b) => a.raw_weight.length - b.raw_weight.length,
      render: (text, record) => {
        const totalWeight = record.raw_stock.reduce(
          (accumulator, currentItem) => {
            return accumulator + parseInt(currentItem.stock_weight);
          },
          0
        );
        return totalWeight;
      },
    },

    {
      title: "Width (mm)",
      dataIndex: "raw_length",
      sorter: (a, b) => a.raw_length.length - b.raw_length.length,
    },
    {
      title: "GSM",
      dataIndex: "gsm_product",
      render: (text, record) => (
        <>
          <span>{truncateDecimal(record.gsm_product, 2)}</span>
        </>
      ),
      sorter: (a, b) => a.gsm_product.length - b.gsm_product.length,
    },

    {
      title: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              className="me-3"
              to={{
                pathname: `/dream-pos/product/addstock/${record._id}`,
                state: record,
              }}
            >
              Manage Stock
            </Link>
            <Link
              className="me-3"
              to={`/dream-pos/product/editbrand-product/${record._id}`}
            >
              <img src={EditIcon} alt="img" />
            </Link>
            <Link to="#" onClick={() => handleDelete(record._id)}>
              <img src={DeleteIcon} alt="img" />
            </Link>
          </div>
        </>
      ),
    },
  ];

  function truncateDecimal(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    const truncatedNumber = Math.floor(number * multiplier) / multiplier;
    return truncatedNumber;
  }

  const token = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    fetchRawMaterials();
  }, [token.token]);

  useEffect(() => {
    let options = [];
    rawMaterial.map((item) => {
      options.push({ title: item.raw_name });
    });

    setRawNameSearch(options);
  }, [rawMaterial]);

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
        console.log(response.data);
        setRawMaterial(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function filterDataContainingLetter(arr, letter) {
    return arr.filter((obj) => obj.raw_name.toLowerCase().includes(letter));
  }

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      setDefaultValue(selectedOption.title);
    } else {
      setDefaultValue("");
    }

    const filteredData = filterDataContainingLetter(
      rawMaterial,
      selectedOption?.title.toLowerCase()
    );
    setFilterData(filteredData);
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
        url: `${API_URL}/raw-metrial/${id}`,
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
          fetchRawMaterials();
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
              <h4>Raw Material List</h4>
              <h6>Manage your Raw Material</h6>
            </div>
            <div className="page-btn d-flex">
              <Link
                to="/dream-pos/product/addbrand-product"
                className="btn btn-added me-2"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Raw Material
              </Link>
              <button className="btn btn-added" onClick={handlePrint}>
                Print
              </button>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              {/* /Filter */}

              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-4 col-sm-4 col-12 mb-3">
                        {/* <div className="form-group"> */}
                        <SearchDropdown
                          options={rawNameSearch}
                          onSelect={handleSelect}
                          className="searchfield"
                          placeholder={"Search by Name"}
                        />
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}

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
                    dataSource={rawMaterial}
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
export default BrandList;
