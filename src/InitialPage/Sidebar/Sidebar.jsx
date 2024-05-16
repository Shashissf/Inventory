/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import FeatherIcon from "feather-icons-react";

const Sidebar = (props) => {
  const [isSideMenu, setSideMenu] = useState("");
  const [path, setPath] = useState("");
  const history = useHistory();

  const toggleSidebar = (value) => {
    setSideMenu(value);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const pageRefresh = (url, page) => {
    history.push(`/dream-pos/${url}/${page}`);
    window.location.reload();
  };
  const location = useLocation();
  let pathname = location.pathname;

  useEffect(() => {
    document.querySelector(".main-wrapper").classList.remove("slide-nav");
    document.querySelector(".sidebar-overlay").classList.remove("opened");
    document.querySelector(".sidebar-overlay").onclick = function () {
      this.classList.remove("opened");
      document.querySelector(".main-wrapper").classList.remove("slide-nav");
    };
  }, [pathname]);
  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-four",
    "/reactjs/template/dream-pos/index-two",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  return (
    <>
      <div
        className={`sidebar index-4 ${
          pathname.includes("/index-three") ? "d-none" : ""
        }`}
        id="sidebar"
      >
        <Scrollbars>
          <div className="slimScrollDiv">
            <div className="sidebar-inner slimscroll">
              <div
                id="sidebar-menu"
                className="sidebar-menu"
                onMouseOver={expandMenuOpen}
                onMouseLeave={expandMenu}
              >
                <ul>
                  <li className="submenu-open">
                    <h6 className="submenu-hdr">Main</h6>
                    <ul>
                      <li
                        className={
                          pathname.includes("dashboard") ? "active" : ""
                        }
                      >
                        <Link to="/dream-pos/dashboard">
                          {/* <i data-feather="grid" /> */}
                          <FeatherIcon icon="grid" />
                          <span>Dashboard</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="submenu-open">
                    <h6 className="submenu-hdr">Products</h6>
                    <ul>
                      <li
                        className={
                          pathname.includes("productlist-product")
                            ? "active"
                            : ""
                        }
                      >
                        <Link
                          className={
                            pathname.includes("productlist-") ? "active" : ""
                          }
                          to="/dream-pos/product/productlist-product"
                        >
                          <FeatherIcon icon="box" />
                          <span>Products</span>
                        </Link>
                      </li>
                      <li
                        className={
                          pathname.includes("categorylist-product")
                            ? "active"
                            : ""
                        }
                      >
                        <Link
                          className={
                            pathname.includes("categorylist-") ? "active" : ""
                          }
                          to="/dream-pos/product/categorylist-product"
                        >
                          <FeatherIcon icon="codepen" />
                          <span>Category</span>
                        </Link>
                      </li>
                      <li
                        className={
                          pathname.includes("brandlist-product") ? "active" : ""
                        }
                      >
                        <Link
                          className={
                            pathname.includes("brandlist-") ? "active" : ""
                          }
                          to="/dream-pos/product/brandlist-product"
                        >
                          {/* <i data-feather="tag" /> */}
                          <FeatherIcon icon="tag" />
                          <span>Raw Materials</span>
                        </Link>
                      </li>
                      <li
                        className={
                          pathname.includes("subcategorytable-product")
                            ? "active"
                            : ""
                        }
                      ></li>
                    </ul>
                  </li>
                  <li className="submenu-open">
                    <h6 className="submenu-hdr">Orders</h6>
                    <ul>
                      <li
                        className={
                          pathname.includes("saleslist") ? "active" : ""
                        }
                      >
                        <Link
                          className={
                            pathname.includes("saleslist") ? "active" : ""
                          }
                          to="/dream-pos/sales/saleslist"
                        >
                          <i data-feather="shopping-cart" />
                          <FeatherIcon icon="shopping-cart" />
                          <span>Orders</span>
                        </Link>
                      </li>

                      {/* <li>
                        <Link to="/pos">
                          <FeatherIcon icon="hard-drive" />
                          <span>POS</span>
                        </Link>
                      </li> */}
                    </ul>
                  </li>

                  <li className="submenu-open">
                    <h6 className="submenu-hdr">User Management</h6>
                    <ul>
                      <li className="submenu">
                        <Link
                          to="#"
                          className={
                            pathname.includes("/dream-pos/users")
                              ? "subdrop active"
                              : "" || isSideMenu == "Users"
                              ? "subdrop active"
                              : ""
                          }
                          onClick={() =>
                            toggleSidebar(isSideMenu == "Users" ? "" : "Users")
                          }
                        >
                          <FeatherIcon icon="users" />
                          <span>Manage Users</span>{" "}
                          <span className="menu-arrow" />
                        </Link>
                        {isSideMenu == "Users" ? (
                          <ul>
                            <li>
                              <Link
                                to="/dream-pos/users/newuser"
                                className={
                                  pathname.includes("newuser") ? "active" : ""
                                }
                              >
                                New User{" "}
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/dream-pos/users/userlists"
                                className={
                                  pathname.includes("userlists") ? "active" : ""
                                }
                              >
                                Users List
                              </Link>
                            </li>
                          </ul>
                        ) : (
                          ""
                        )}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default withRouter(Sidebar);
