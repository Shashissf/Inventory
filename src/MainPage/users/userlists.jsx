/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PlusIcon, EditIcon, DeleteIcon } from "../../EntryFile/imagePath";
import "react-select2-wrapper/css/select2.css";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLists = () => {
  const [users, setUsers] = useState([]);

  const [data] = useState([
    {
      id: 1,
      name: "Thomas",
      email: "thomas@example.com",
      password: "*********",
      On: "3/15/2022",
      Status: "Active",
    },
  ]);

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Password",
      dataIndex: "password",
      sorter: (a, b) => a.password.length - b.password.length,
    },
    // {
    //   title: "Role",
    //   dataIndex: "Role",
    //   sorter: (a, b) => a.Role.length - b.Role.length,
    // },
    // {
    //   title: "Created On",
    //   dataIndex: "On",
    //   sorter: (a, b) => a.On.length - b.On.length,
    // },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   render: (text, record) => (
    //     <>
    //       {text === "Active" && (
    //         <span className="badges bg-lightgreen">{text}</span>
    //       )}
    //       {text === "Restricted" && (
    //         <span className="badges bg-lightred">{text}</span>
    //       )}
    //     </>
    //   ),
    //   sorter: (a, b) => a.Status.length - b.Status.length,
    // },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <Link
            className="me-3"
            to={`/dream-pos/users/newuseredit/${record._id}`}
          >
            <img src={EditIcon} alt="img" />
          </Link>
          <Link
            className="me-3 confirm-text"
            to="#"
            onClick={() => handleDelete(record._id)}
          >
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];

  const token = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    fetchUsers();
  }, [token.token]);

  const fetchUsers = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}/user`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.result);
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
        url: `${API_URL}/user/${id}`,
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
          fetchUsers();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ToastContainer />
        <div className="page-header">
          <div className="page-title">
            <h4>User List</h4>
            <h6>Manage your User</h6>
          </div>
          <div className="page-btn">
            <Link to="/dream-pos/users/newuser" className="btn btn-added">
              <img src={PlusIcon} alt="img" className="me-2" />
              Add User
            </Link>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={users}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default UserLists;
