import React, { useEffect, useState   } from 'react';
import { useNavigate , Link} from "react-router-dom";
import axios from 'axios';
import Carousel from './Carousel/Carousel'
import './Dashboard1.css';
// import Item from './Item';
import cart from "./cart.gif";
// import fimage1 from "./ItemImage/f-apple.jpg";
// import fimage2 from "./ItemImage/f-banana.png";
// import fimage3 from "./ItemImage/f-guvava.jpg";
// import fimage4 from "./ItemImage/f-kiwi.jpg";
// import fimage5 from "./ItemImage/f-watermelon.jpg";
// import fimage6 from "./ItemImage/f-orange.jpg";
// import fimage7 from "./ItemImage/mango.jpeg";
// import fimage8 from "./ItemImage/f-pineapple.jpg";
// import fimage9 from "./ItemImage/f-pomogrande.jpg";
// import fimage10 from "./ItemImage/f-strawberry.jpg";
// import vimage1 from "./ItemImage/v-brinjal.jpg";
// import vimage2 from "./ItemImage/v-carrot.jpg";
// import vimage3 from "./ItemImage/v-cauliflower.jpg";
// import vimage4 from "./ItemImage/v-chilies.jpg";
// import vimage5 from "./ItemImage/v-ginger.jpg";
// import vimage6 from "./ItemImage/v-limbu.jpg";
// import vimage7 from "./ItemImage/v-onion.jpg";
// import vimage8 from "./ItemImage/v-peas.jpg";
// import vimage9 from "./ItemImage/v-potato.jpg";
// import vimage10 from "./ItemImage/v-red capsicum.jpg";
// import himage1 from "./ItemImage/h-brush.jpg";
// import himage2 from "./ItemImage/h-coke.jpg";
// import himage3 from "./ItemImage/h-detergent.jpg";
// import himage4 from "./ItemImage/h-milk.jpg";
// import himage5 from "./ItemImage/h-shampoo.jpg";
// import himage6 from "./ItemImage/h-soap.jpg";
// import himage7 from "./ItemImage/h-toilet cleaner.jpg";
// import himage8 from "./ItemImage/h-toothbrush.jpg";
// import himage9 from "./ItemImage/h-toothpaste.jpg";
// import himage10 from "./ItemImage/h-bodywash.jpg";

function Dashboard() {
  
  const [fruit, setFruit] = useState(null);
  const [vegetable, setVegetable] = useState(null);
  const [hh, setHh] = useState(null);
  const form = {
        'page': 1 ,
        'limit': 9 
    };
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams(form).toString();
            const url = `http://localhost:8000/customer/getItem?${queryParams}`;
            const res1 = await axios.get(`${url}&category=Fruits`, { withCredentials: true });
            const res2 = await axios.get(`${url}&category=Vegetable`, { withCredentials: true });
            const res3 = await axios.get(`${url}&category=House Hold`, { withCredentials: true });
        
          if (res1.type === "error") {
            navigate('/login/sellerlogin');
        }
          setFruit(res1.data);
          setVegetable(res2.data);
          setHh(res3.data);
          console.log(res1.data);
        } catch (error) {
          console.error('Error:', error);
          if (error.response && error.response.status === 500) {
            navigate('/login/sellerlogin');
        }
        }
      };
  
      fetchData();
    }, );

  return (
   <>
   <Carousel></Carousel>
   <div className="container">
          <h1 className='mt-4'> Fruits </h1>  
          <div className='button-rightside'>
          <Link to="/Display?category=Fruits" className='text-dark' style={{  textDecoration: 'none' }}><button type="button" className="btn btn-secondary btn-sm" >
              Show more
            </button></Link>
          </div>
          <ul className="cards">
            {fruit && fruit.items.map((item, index) => (
                <li className="card hovercard " key={index}> 
                <Link to={`/Displayitem?id=${item._id}`} className='text-dark' style={{  textDecoration: 'none' }}>
                  <div>
                    <img src={`data:image/jpeg;base64, ${item.image}`}   className="card-img-top  rounded " alt="..."/>
                  </div>
                  </Link>
                  <div className="card-link-wrapper ">
                    <h3 className="card-title mt-2">{item.productName}</h3>
                    <h3 className="card-title mt-2">{item.price + " ₹  per " + item.pricePer }</h3>
                    <button className="card-link rounded">Add to cart</button>
                  </div>
                </li>
                ))}  
          </ul>
          <h1 className='mt-2'> Vegetable</h1>  
          <div className='button-rightside'>
          <Link to="/Display?category=Vegetable" className='text-dark' style={{  textDecoration: 'none' }}><button type="button" className="btn btn-secondary btn-sm" >
              Show more
            </button></Link>
          </div>
          <ul className="cards">
            {vegetable && vegetable.items.map((item, index) => (
                <li className="card hovercard " key={index}> 
                <Link to={`/Displayitem?id=${item._id}`} className='text-dark' style={{  textDecoration: 'none' }}>
                  <div>
                    <img src={`data:image/jpeg;base64, ${item.image}`}   className="card-img-top  rounded " alt="..."/>
                  </div>
                  </Link>
                  <div className="card-link-wrapper ">
                    <h3 className="card-title mt-2">{item.productName}</h3>
                    <h3 className="card-title mt-2">{item.price + " ₹  per " + item.pricePer }</h3>
                    <button className="card-link rounded">Add to cart</button>
                  </div>
                </li>
                ))}  
          </ul>
          <h1 className='mt-2'> House Hold</h1>  
          <div className='button-rightside'>
          <Link to="/Display?category=House Hold" className='text-dark' style={{  textDecoration: 'none' }}><button type="button" className="btn btn-secondary btn-sm" >
              Show more
            </button></Link>
          </div>
          <ul className="cards">
            {hh && hh.items.map((item, index) => (
                <li className="card hovercard " key={index}> 
                <Link to={`/Displayitem?id=${item._id}`} className='text-dark' style={{  textDecoration: 'none' }}>
                  <div>
                    <img src={`data:image/jpeg;base64, ${item.image}`}   className="card-img-top  rounded " alt="..."/>
                  </div>
                  </Link>
                  <div className="card-link-wrapper ">
                    <h3 className="card-title mt-2">{item.productName}</h3>
                    <h3 className="card-title mt-2">{item.price + " ₹  per " + item.pricePer }</h3>
                    <button className="card-link rounded">Add to cart</button>
                  </div>
                </li>
                ))}  
          </ul>
        </div>
   {/* <Item title="Fruits" image1={fimage1} item1="Apple" image2={fimage2} item2="Banana" image3={fimage3} item3="Pear" image4={fimage4} item4="Kiwi" image5={fimage5} item5="Watermelon" image6={fimage6} item6="Orange" image7={fimage7} item7="Mango" image8={fimage8} item8="Pineapple" image9={fimage9} item9="Pomogrande" image10={fimage10} item10="Strawberry"  ></Item>
   <Item title="Vegetables" image1={vimage1} item1="brinjal" image2={vimage2} item2="carrot" image3={vimage3} item3="cauliflower" image4={vimage4} item4="chilies" image5={vimage5} item5="ginger" image6={vimage6} item6="limbu" image7={ vimage7} item7="onion" image8={vimage8} item8="peas" image9={vimage9} item9="potato" image10={vimage10} item10="red capsicum" ></Item>
   <Item title="Household" image1={himage1} item1="Brush" image2={himage2} item2="Coke" image3={himage3} item3="Detergent" image4={himage4} item4="Milk" image5={himage5} item5="Shampoo" image6={himage6} item6="Soap" image7={ himage7} item7="Cleaner" image8={himage8} item8="toothbrush" image9={himage9} item9="toothpaste" image10={himage10} item10="Body wash"></Item> */}
   <footer style={{position: "fixed",right: "10px", bottom: "10px", display: "flex",alignItems: "center", padding: "5px", zIndex: "1"}}>
          <a href="/" target="_blank" style={{display: "flex", marginLeft: "4px"}}>
            <img width="70" height="70" src={cart} alt="cart logo"/>
          </a>
          {/* <span>Add to Cart </span> */}
    </footer>
    
  
   </>
  )
}

export default Dashboard