import React, { useEffect, useState } from "react";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Input } from "antd";

const AddStock = () => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  console.log(location);

  const [inputs, setInputs] = useState([
    { batch_no: "", stock_weight: "", date: "", status: true },
  ]);

  const [activeDataCount,setActiveDataCount]=useState(inputs.length)
let idx=0
  const data = {};

  useEffect(() => {
    if (location.state.raw_stock.length > 0) {
      setInputs(location.state.raw_stock);
    } else {
      setInputs([{ batch_no: "", stock_weight: "", date: "", status: true }]);
    }
  }, []);
  const handleAddInput = () => {
    
    setInputs([
      ...inputs,
      {batch_no: "", stock_weight: "", date: "", status: true },
    ]);
  };

  console.log(Input)
  const handleChange = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...inputs];

    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
  };

  const handleDeleteInput = (index, item) => {
    const newArray = [...inputs];
    console.log(newArray, item);
    if (item.batch_no === "" || item.stock_weight === "") {
      newArray.splice(index, 1);
      setInputs(newArray);
    } else {
      console.log(item)
      item.status = false;
      setInputs((prevItems) => 
        prevItems.map(inputItem => 
          inputItem.batch_no === item.batch_no ? { ...inputItem, item} : inputItem
        )
      );     
    }
  };

  useEffect(()=>{
    const filteredInputs = inputs.filter(item => item.status !== false);
    setActiveDataCount(filteredInputs.length)
  },[inputs])

  const token = JSON.parse(localStorage.getItem("items"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    data["raw_stock"] = inputs;
    data["_id"] = id;
    data["raw_name"] = location.state.raw_name;
    data["raw_sku"] = location.state.raw_sku;
    data["raw_gauge"] = location.state.raw_gauge;
    data["raw_length"] = location.state.raw_length;
    data["raw_weight"] = location.state.raw_weight;
    data["raw_category"] = location.state.raw_category?._id;
    // console.log(data);

    const config = {
      method: "PUT",
      url: `${API_URL}/raw-metrial`,
      headers: {
        "Content-Type": "application/json",
        token: token.token,
      },
      data: JSON.stringify(data),
      // validateStatus: (status) => status !== 404,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          setTimeout(() => {
            history.push("/dream-pos/product/brandlist-product");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCancel = () => {
    history.push("/dream-pos/product/brandlist-product");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Stock</h4>
          </div>
        </div>
        {/* /add */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {inputs?.map((item, index) => {
                  if(item.status != false){
                    idx++
                    return(<>
                    <div
                      className="col-lg-3 col-sm-3 col-12 form-group"
                      key={index}
                    >
                      <label>Batch no*</label>
                      <input
                        name="batch_no"
                        type="text"
                        value={item.batch_no}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    </div>
                    <div
                      className="col-lg-3 col-sm-3 col-12 form-group"
                      key={index}
                    >
                      <label>Weight(KG)</label>
                      <input
                        name="stock_weight"
                        type="number"
                        value={item.stock_weight}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </div>
                    <div
                      className="col-lg-3 col-sm-3 col-12 form-group"
                      key={index}
                    >
                      <label>Date</label>
                      <input
                        name="date"
                        type="date"
                        value={item.date}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </div>
                    <div
                      className="col-lg-2 col-sm-2 col-12 form-group"
                      key={index}
                    >
                      <label>Action</label>
                      {inputs.length > 1 && (
                        <button
                          className="delplus"
                          type="reset"
                          onClick={() => handleDeleteInput(index, item)}
                        >
                          -
                        </button>
                      )}
                      {idx === activeDataCount && (
                        <button
                          className="addplus"
                          onClick={() => handleAddInput()}
                        >
                          +
                        </button>
                      )}
                    </div>
                    {/* <div className="body"> {JSON.stringify(inputs)} </div> */}
                  </>
                    )
                  }
                })}

                <div className="col-lg-12">
                  <button type="submit" className="btn btn-submit me-2">
                    Submit
                  </button>
                  <button className="btn btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* /add */}
      </div>
    </div>
  );
};

export default AddStock;
