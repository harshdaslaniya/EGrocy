import React ,{useState} from 'react'
import { TimePicker } from 'antd';
import "./Signup.css"
import axios from 'axios';
// import { useEffect } from 'react';

function SellerSignup1(props) {

  const [time, setTime] = useState([null, null]);
  const [timing, setTiming] = useState({
    startHour: '',
    startMin: '',
    startSec: '',
    endHour: '',
    endMin: '',
    endSec: ''
  });

  const handleTimeChange = (newTime) => {
    setTime(newTime);

    if (newTime[0]) {
      setTiming((prevTiming) => ({
        ...prevTiming,
        startHour: newTime[0].hour(),
        startMin: newTime[0].minute(),
        startSec: newTime[0].second()
      }));
    }

    if (newTime[1]) {
      setTiming((prevTiming) => ({
        ...prevTiming,
        endHour: newTime[1].hour(),
        endMin: newTime[1].minute(),
        endSec: newTime[1].second()
      }));
    }
  };


  const [ user, setUser] = useState({
    name: "",
    shopName: "",
    password:"",
    confirmPassword: "",
    email:"",
    phone:"",
    timing:{},
    address:""
})
const handleChange = (e) => {
  const {name , value} = e.target;
  setUser({
    ...user,
  [name] : value
  })  
}

const onClick = ()=>{
  user.timing = timing;
  console.log(user);
  if(user.password === user.confirmPassword){
      axios.post('http://localhost:8000/seller/signup', user,{ withCredentials: true })
      .then(response => {
        props.setalert({msg:response.data.msg,type:response.data.type})
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Error:', error.response.data);
          props.setalert({msg:error.response.data.msg,type:"error"})
        } else if (error.request) {
          console.log("aaaaaaaaa");
          // props.setalert({msg:error.response.request,type:"error"})
          console.log('No response from server:', error.request);
        } else {
          // props.setalert({msg:error.message.msg,type:"error"})
          console.log('Error:', error.message);
        }
      });
  }
  else{
    props.setalert({msg:"password and confirm password not Same",type:"warning"})
  }
}

  return (
        <div className="card-body p-4 p-md-5">
          <h4 className="fw-bold mb-2 text-uppercase">Seller</h4>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <input type="text" name="name" value={user.name}  id="name" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="firstName">User Name</label>
                </div>

              </div>
              <div className="col-md-6 mb-4">

                <div className="form-outline">
                  <input type="text" name="shopName" value={user.shopName} id="shopName" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="shopName">Shop Name</label>
                </div>

              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4 pb-2">

                <div className="form-outline">
                <input type="password" name="password" value={user.password} id="password" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="password">Password</label>
                </div>

              </div>
              <div className="col-md-6 mb-4 pb-2">

                <div className="form-outline">
                <input type="password" name="confirmPassword" value={user.confirmPassword} id="confirmPassword" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                </div>

              </div>
            </div>  
            <div className="row">
              <div className="col-md-6 mb-4 pb-2">

                <div className="form-outline">
                  <input type="email" name="email" value={user.email} id="email" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="email">Email</label>
                </div>

              </div>
              <div className="col-md-6 mb-4 pb-2">

                <div className="form-outline">
                  <input type="tel" name="phone" value={user.phone} id="phone" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                </div>

              </div>
            </div>

            <div className="row">
              <div className="mb-4">
                <div className="form-outline">
                <TimePicker.RangePicker
                  className="form"
                  value={time}
                  onChange={handleTimeChange}
                  size="large"
                  id="time"
                  name="time"
                />      
                  <label className="form-label" htmlFor="time">Opening & Closing Time</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
              <div className="form-outline">
                  <input type="textarea" name="address" value={user.address} id="address" onChange={handleChange} className="form-control form-control-lg" />
                  <label className="form-label" htmlFor="address">Address</label>
                </div>

              </div>
            </div>

            <div className="mt-4 pt-2">
              <input className="btn btn-outline-primary btn-lg" type="button" onClick={onClick} value="Submit" />
            </div>
        </div>
  )
}

export default SellerSignup1