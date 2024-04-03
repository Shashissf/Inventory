/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  Logo,
  SmallLogo,
  Closes,
  HeaderSearch,
  Flag,
  FlagUS,
  FlagFR,
  FlagES,
  FlagDE,
  Notification,
  Avatar2,
  Avatar3,
  Avatar6,
  Avatar17,
  Avatar13,
  Avatar,
  Logout,
  LogoWhite,
  Avatar1,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useHistory } from "react-router-dom";

const Header = () => {
  const [toggle, SetToggle] = useState(false);
  const token = JSON.parse(localStorage.getItem("items"));
  const history = useHistory();

  const logOut = () => {
    setTimeout(() => {
      localStorage.removeItem("items");
      history.push("/signin");
    }, 3000);
  };

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const sidebarOverlay = () => {
    document.querySelector(".main-wrapper").classList.toggle("slide-nav");
    document.querySelector(".sidebar-overlay").classList.toggle("opened");
    document.querySelector("html").classList.toggle("menu-opened");
  };

  let pathname = location.pathname;

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullscreen = (elem) => {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link to="/dream-pos/dashboard" className="logo logo-normal">
            <img src={Logo} alt="" />
          </Link>
          <Link to="/dream-pos/dashboard" className="logo logo-white">
            <img src={LogoWhite} alt="" />
          </Link>
          <Link to="/dream-pos/dashboard" className="logo-small">
            <img src={SmallLogo} alt="" />
          </Link>
          <Link
            id="toggle_btn"
            to="#"
            style={{
              display: pathname.includes("tasks")
                ? "none"
                : pathname.includes("compose")
                ? "none"
                : "",
            }}
            onClick={handlesidebar}
          >
            <FeatherIcon icon="chevrons-left" className="feather-16" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item nav-searchinputs"></li>
          {/* /Search */}
          {/* Flag */}

          {/* /Flag */}
          <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {/* <i data-feather="maximize" /> */}
              <FeatherIcon icon="maximize" />
            </Link>
          </li>
          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                {/* <span className="user-letter">
                  <img src={Avatar1} alt="" className="img-fluid" />
                </span> */}
                <span className="user-detail">
                  <span className="user-name">{token.email}</span>
                  <span className="user-role">Super Admin</span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    <img src={Avatar1} alt="" />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    {/* <h6>John Smilga</h6> */}
                    <h5>Super Admin</h5>
                  </div>
                </div>
                <hr className="m-0" />
                {/* <Link
                  className="dropdown-item"
                  to="/dream-pos/profile/user-profile"
                >
                  <i className="me-2" data-feather="user" /> My Profile
                </Link>
                <Link
                  className="dropdown-item"
                  to="/dream-pos/settings/generalsettings"
                >
                  <i className="me-2" data-feather="settings" />
                  Settings
                </Link> */}
                <hr className="m-0" />
                <Link className="dropdown-item logout pb-0" to="/signIn">
                  <img
                    src={Logout}
                    onClick={logOut}
                    className="me-2"
                    alt="img"
                  />
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="profile.html">
              My Profile
            </Link>
            <Link className="dropdown-item" to="generalsettings.html">
              Settings
            </Link>
            <Link className="dropdown-item" to="signin.html">
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
