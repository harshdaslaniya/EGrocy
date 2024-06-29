import axios from 'axios';
import React, { useState , useRef} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Resizer from 'react-image-file-resizer';
function Additem(props) {

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 , width: 100, height: 100  });
  const [croppedImage, setCroppedImage] = useState(null);
  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      Resizer.imageFileResizer(
        event.target.files[0], // uploaded file
        250, // max width
        250, // max height
        'JPEG', // compress format
        100, // quality
        0, // rotation
        (uri) => {
          // uri is the resized image
          setImage(uri);
        },
        'base64' // output type
      );
    }
  };

  const handleImageCrop = (crop) => {
    setCrop(crop);
  };

  const handleImageSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    const imageObj = imageRef.current;
    imageObj.onload = function () {
      ctx.drawImage(
        imageObj,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
        setCroppedImage(file);
      }, 'image/png', 1); // Set quality parameter to 1 for maximum quality
    };
    imageObj.src = image;
  };
  const [ item, setItem] = useState({
    productName: "",
    category:"",
    price: "",
    pricePer:"",
    description:"",
})
const handleChange = (e) => {

    const { name, value } = e.target;
  
    if (name === 'image') {
      setImage(e.target.files[0]);
    } else {
      setItem({
        ...item,
        [name]: value
      });
    }

  console.log(item);
};  
const categoryChange = (value) => {
  setItem({
    ...item,
    category: value,
  });
};
const priceChange = (value) => {
  setItem({
    ...item,
    pricePer: value,
  });
};

const onClick=()=>{
  
  const{ productName , category, price , pricePer , description} = item
  if(!(productName && category && price && pricePer && description )){
    props.setalert({type:'error',msg:'All data not filled'});
  }
  else if(!croppedImage){
    props.setalert({type:'warning',msg:'Crop a image'});
  }

  else{
        const formData = new FormData();
        formData.append('productName', item.productName);
        formData.append('category', item.category);
        formData.append('price', item.price);
        formData.append('pricePer', item.pricePer);
        formData.append('description', item.description);
        formData.append('image', croppedImage);
        console.log(formData.get('image'));
        axios.post("http://localhost:8000/seller/addItem" ,formData,{ withCredentials: true })
        .then( res => {
          props.setalert({type:res.data.type,msg:res.data.msg});
        }) 
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            console.log('Error:', error.response.data);
            props.setalert({msg:error.response.data.msg,type:"error"})
          } else if (error.request) {
            props.setalert({msg:error.response.request,type:"error"})
            console.log('No response from server:', error.request);
          } else {
            props.setalert({msg:error.message.msg,type:"error"})
            console.log('Error:', error.message);
          }
        });
      }
}

	return (
        <div>
        <section >
            <div className="container ">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div className="card bg-dark text-white mt-5  mb-5" style={{'borderRadius':"1 rem"}}>
                    <div className=" text-center">
                      <h3 className="fw-bold mb-2 text-uppercase">Add Item</h3>

                      <div className="card-body">
                          <h4 className="fw-bold mb-2 text-uppercase">Details</h4>
                          <div>
                            <div className="row mb-3">
                                <div className="form-outline">
                                  <input type="text" name="productName" value={item.productName} onChange={handleChange} className="form-control form-control-lg" />
                                  <label className="form-label" htmlFor="ProductName">Product Name</label>
                                </div>
                            </div>

                            <div className="row mb-3">
                            <div className="input-group ">
                              <input type="text" className="form-control form-control-lg" value={item.category} placeholder='Select category' disabled   aria-label="Text input with dropdown button"/>
                              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Category</button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li className="dropdown-item" name="category" value="Fruits" onClick={() => categoryChange("Fruits")} >Fruit</li>
                                <li className="dropdown-item" name="category" value="Grocery" onClick={() => categoryChange("Grocery")} >Grocery</li>
                                <li className="dropdown-item" name="category" value="Vegetable" onClick={() => categoryChange("Vegetable")}>Vegetable</li>
                                <li className="dropdown-item" name="category" value="House Hold" onClick={() => categoryChange("House Hold")}>House Hold</li>
                              </ul>
                            </div>
                            <label className="form-label" htmlFor="Category">Category</label>  
                            </div>  

                            <div className="row mb-3">
                            <div className="input-group ">
                              <input type="number" className="form-control  form-control-lg" name="price" placeholder='Price in Rupee' value={item.price} onChange={handleChange} aria-label="Text input with dropdown button"/>
                              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{item.pricePer}</button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li className="dropdown-item" name="pricePer" value="item" onClick={()=>priceChange("item")} >Per Item</li>
                                <li className="dropdown-item" name="pricePer" value="kg" onClick={()=>priceChange("kg")}   >Per K.G</li>
                                <li className="dropdown-item" name="pricePer" value="dozen" onClick={()=>priceChange("dozen")}  >Per Dozen</li>
                                <li className="dropdown-item" name="pricePer" value="litre" onClick={()=>priceChange("litre")}  >Per Litre</li>
                              </ul>
                            </div>
                            <label className="form-label" htmlFor="Price">Price</label>  
                            </div>  
                            

                            <div className="row">
                              <div className="col-12 mb-3">
                              <div className="input-group mb-4">
                                <span className="input-group-text text-bg-dark">Description</span>
                                <textarea className="form-control" name='description' value={item.description} onChange={handleChange}  aria-label="With textarea"></textarea>
                              </div>
                              </div>
                            </div>

                            
                            <div className="row">
                                <div className="form-outline">
                
                                    <div className="input-group">
                                      <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control  form-control-lg" id="image" name='image' aria-describedby="inputGroupFileAddon04" aria-label="Upload"/>
                                      <button className="btn btn-outline-secondary" type="button" onClick={handleImageSave} id="inputGroupFileAddon04">Crop Image</button> 
                                    </div>
                                    <label htmlFor="formFileLg" className="form-label">Product Photo</label>
                                    
                                    {image && (
                                      <div>
                                        <img
                                          src={image}
                                          alt="Original"
                                          ref={imageRef}
                                          style={{ display: 'none' }}
                                        />
                                        <ReactCrop
                                          src={image}
                                          crop={crop}
                                          onChange={setCrop}
                                          onComplete={handleImageCrop}
                                        />
                                      </div>
                                    )}
                                    {croppedImage && <img src={URL.createObjectURL(croppedImage)} style={{width:"250px" }}  alt="Cropped" />}                    
                                </div>
                            </div>

                            <div className=" pt-2">
                              <input className="btn btn-outline-primary btn-lg" type="button" onClick={onClick} value="Save Data" />
                            </div>

                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
	  
	);
  }
  

export default Additem;
