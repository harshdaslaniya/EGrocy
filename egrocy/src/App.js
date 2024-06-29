import  {useState ,useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/Navbar';
import './App.css';
import Login from './component/Login/Login';
import Dashboard from './component/customer/Dashboard';
import Displaycostumer from './component/customer/Displaycostumer';
import Cart from './component/customer/Shopcart';
import Orderstatus from './component/customer/Orderstatus';
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
   Navigate
} from "react-router-dom";
import Footer from './component/Footer';
import CustomerLogin from './component/Login/CustomerLogin';
import SellerLogin from './component/Login/SellerLogin';
import DeliveryLogin from './component/Login/DeliveryLogin';
import Signup from './component/Signup/Signup';
import CustomerSignup from './component/Signup/CustomerSignup';
import DeliverySignup1 from './component/Signup/DeliverySignup1';
import SellerSignup1 from './component/Signup/SellerSignup1';
import About from './component/aboutUs/About';
import Service from './component/services/Service';
import Nothing from './nothing';
import CostumerDisplayItem from './component/customer/DisplayItem'
import Seller from './component/seller/Seller';
import Home from './component/seller/Home';
import Additem from './component/seller/Additem';
import Display from './component/seller/Display';
import Displayitem from './component/seller/Displayitem';
import Updatephoto from './component/seller/Updatephoto';
import Updatedetail from './component/seller/Updatedetail';
import Delivery from './component/delivery/Delivery';
import Homed from './component/delivery/Home';
import Order from './component/delivery/Order';
import Orderdetail from './component/delivery/Orderdetail';

function App() {
  const [alert , setalert]=useState({
    msg:"",
    type:""
  })
  useEffect(() => {
    if(alert.type === "success")
    {
        toast.success(alert.msg, {
            position: toast.POSITION.TOP_RIGHT
        });
    }
    else if(alert.type === "error")
    {
        toast.error(alert.msg, {
            position: toast.POSITION.TOP_RIGHT
        });
    }
    else if(alert.type === "warning")
    {
        toast.warning(alert.msg, {
            position: toast.POSITION.TOP_RIGHT
        });
    }
}, [alert]);

  const [ user, setLoginUser] = useState({
    "status":"Login",
    "user":""
  })
  
 
  return (
    <>
    <Router>
    <div >
      <Navbar user={user} setLoginUser={setLoginUser}></Navbar>

        <ToastContainer />
      <Routes>
        
        <Route  path="/" element={<Dashboard/ >} />
        <Route  path="/Display" element={<Displaycostumer/ >} />
        <Route  path="DisplayItem" element={<CostumerDisplayItem setalert={setalert} />} />
        <Route  path="/404" element={<Nothing setalert={setalert}  / >} />
        <Route  path="/AboutUs" element={<About/ >} />
        <Route  path="/Services" element={<Service/>} />
        <Route  path="/Cart" element={<Cart/>} />
        <Route  path="/Orderstatus" element={<Orderstatus/>} />
        {/* in sub route not use "/" before giving path */}
        <Route  path="Seller" element={<Seller/>} >
          <Route  path="Home" element={<Home setalert={setalert} />} />
          <Route  path="Display" element={<Display setalert={setalert}  />} />
          <Route  path="DisplayItem" element={<Displayitem setalert={setalert} />} />
          <Route  path="UpdatePhoto" element={<Updatephoto setalert={setalert} />} />
          <Route  path="UpdateDetail" element={<Updatedetail setalert={setalert} />} />
          <Route  path="AddItem" element={<Additem setalert={setalert}  />} >
          </Route>
        </Route>
        <Route  path="Delivery" element={<Delivery/>} >
          <Route  path="Home" element={<Homed/>} />
          <Route  path="Order" element={<Order/>} />
          <Route  path="Orderdetail" element={<Orderdetail/>} />
        </Route>
          <Route  path="login" element={<Login/ >}>
              <Route  path='customerlogin' element={<CustomerLogin setalert={setalert} / >} />
              <Route  path='sellerlogin' element={<SellerLogin setalert={setalert} / >} />
              <Route  path='deliverymanlogin' element={<DeliveryLogin setalert={setalert}/ >} />                
          </Route>
          <Route  path="signup" element={<Signup/ >}>
              <Route  path='customersignup' element={<CustomerSignup setalert={setalert}  />} />
              <Route  path='sellersignup' element={<SellerSignup1 setalert={setalert} />} />
              <Route  path='deliverymansignup' element={<DeliverySignup1 setalert={setalert} / >} />  
          </Route>
          <Route path="*" element={<Navigate to="/404" />} />
      </Routes>   
      <Outlet/>
    </div>
      <div >
      <Footer></Footer>
      {/* <button onClick={()=>{setalert({msg:"done bhai done",type:"success"}); console.log(alert);}}>898</button> */}
      </div>
    </Router>
    </>
  );
}

export default App;

