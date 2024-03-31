/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Dash1, Dash2, Dash3, Dash4 } from "../EntryFile/imagePath";
import CountUp from "react-countup";
import { Helmet } from "react-helmet";
import RightSideBar from "../components/rightSidebar";
import { API_URL } from "../config";
import axios from "axios";
import Table from "../EntryFile/datatable";

const Dashboard = () => {
  const [dataCount, setDataCount] = useState({});
  const [stockCount, setStockCount] = useState({});
  const [rawMaterial, setRawMaterial] = useState([]);

  const token = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    fetchData();
    fetchStockCount();
    fetchRawMaterials();
  }, [token.token]);

  const columns = [
    {
      title: "Sl no",
      dataIndex: "key",
      render: (text, object, index) => index + 1,
      sorter: (a, b) => a.key.length - b.key.length,
    },
    {
      title: "Name",
      dataIndex: "raw_name",
      render: (text, record) => (
        <div className="productimgname">{record.raw_name}</div>
      ),
      sorter: (a, b) => a.raw_name.length - b.raw_name.length,
    },
    {
      title: "SKU",
      dataIndex: "raw_sku",
      sorter: (a, b) => a.raw_sku.length - b.raw_sku.length,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      render: (text, record) => <>{record.raw_category?.categoryName}</>,
      sorter: (a, b) =>
        a.raw_category?.categoryName.length -
        b.raw_category?.categoryName.length,
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
      dataIndex: "raw_gsm",
      sorter: (a, b) => a.raw_length.length - b.raw_length.length,
    },
  ];

  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/user/dashboard`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response.data);
        setDataCount(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchStockCount = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/raw-metrial/stock/in-out`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        setStockCount(response.data.result);
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
        console.log(response.data);
        let data = response?.data?.result.filter((item) => {
          const totalWeight = item?.raw_stock?.reduce(
            (accumulator, currentItem) => {
              return accumulator + parseInt(currentItem.stock_weight);
            },
            0
          );
          // console.log(totalWeight, item.quantity_alert);
          return totalWeight <= item.quantity_alert;
        });
        setRawMaterial(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Dashboard</title>
          <meta name="description" content="Dashboard page" />
        </Helmet>
        <div className="content">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash1} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <span className="counters">
                      <CountUp end={dataCount?.productCount} />
                    </span>
                  </h5>
                  <h6>Total Products</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash1">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash2} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <span className="counters">
                      <CountUp end={dataCount?.rawMetrailCount} />
                    </span>
                  </h5>
                  <h6>Total Raw Materials</h6>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash2">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash3} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <span className="counters">
                      <CountUp end={dataCount?.orderCount} />
                    </span>
                  </h5>
                  <h6>Total Orders this year</h6>
                </div>
              </div>
            </div> */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <span className="counters">
                      <CountUp end={rawMaterial?.length} />
                    </span>
                  </h5>
                  <h6>Total Items in stock alert</h6>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <span className="counters">
                      <CountUp end={stockCount?.itemOutStock} />
                    </span>
                  </h5>
                  <h6>Total Items Out of Stock</h6>
                </div>
              </div>
            </div> */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <span className="counters">
                      <CountUp end={dataCount?.OrderProcessing?.length} />
                    </span>
                  </h5>
                  <h6>Total Orders under processing</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="page-header">
              <div className="page-title">
                <h4>Raw Materials Stock Alerts</h4>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={rawMaterial}
                    rowKey={(record) => record.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightSideBar />
    </>
  );
};

export default Dashboard;
