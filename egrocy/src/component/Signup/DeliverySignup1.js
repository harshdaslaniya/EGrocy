import React, { useState , useRef} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

function DeliverySignup1(props) {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      Resizer.imageFileResizer(
        event.target.files[0], // uploaded file
        350, // max width
        350, // max height
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
  const [ user, setUser] = useState({
    name: "",
    password:"",
    confirmPassword: "",
    email:"",
    phone:"",
})
// useEffect(() => {
//   console.log(user);
// }, [user]);
const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'image') {
    setImage(e.target.files[0]);
  } else {
    setUser({
      ...user,
      [name]: value
    });
  }
}; 


const onClick=()=>{
  
  const{ name, password, confirmPassword, email, phone } = user
  if(!(name && password && confirmPassword && email && phone && image )){
    props.setalert({type:'error',msg:'All data not filled'});
  }
  else if(!croppedImage){
    props.setalert({type:'warning',msg:'Crop a image'});
  }
  else if(password !== confirmPassword){
        props.setalert({type:'warning',msg:'Password & ConfirmPassword not same'});    
    }
  else{
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('password', user.password);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('image', croppedImage);
        console.log(formData.get('image'));
        axios.post("http://localhost:8000/delivery/signup" ,formData,{ withCredentials: true })
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
    <div className="card-body p-4 p-md-5">
            <h4 className="fw-bold mb-2 text-uppercase">Delivery-man</h4>
            <form>
              <div className="row">
                <div className="mb-4 pb-2">

                  <div className="form-outline">
                    <input type="text" id="name" name="name" value={user.name} onChange={handleChange} className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="name">Name</label>
                  </div>

                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4 pb-2">

                  <div className="form-outline">
                  <input type="password" id="password" name="password" value={user.password} onChange={handleChange} className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="password">Password</label>
                  </div>

                </div>
                <div className="col-md-6 mb-4 pb-2">

                  <div className="form-outline">
                  <input type="password" id="confirmPassword" name="confirmPassword" value={user.confirmPassword}  onChange={handleChange} className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="phoneNumber">Confirm Password</label>
                  </div>

                </div>
              </div>  
              <div className="row">
                <div className="col-md-6 mb-4 pb-2">

                  <div className="form-outline">
                    <input type="email" id="email" name="email" value={user.email} onChange={handleChange} className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="email">Email</label>
                  </div>

                </div>
                <div className="col-md-6 mb-4 pb-2">

                  <div className="form-outline">
                    <input type="tel" id="phone" name="phone" value={user.phone} onChange={handleChange} className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                  </div>

                </div>
              </div>

              <div className="row">
                  <div className="form-outline">
  
                      <div class="input-group">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" id="image" name='image' aria-describedby="inputGroupFileAddon04" aria-label="Upload"/>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleImageSave} id="inputGroupFileAddon04">Crop Image</button> 
                      </div>
                      <label for="formFileLg" className="form-label">User's photo</label>
                      
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
                      {croppedImage && <img src={URL.createObjectURL(croppedImage)}  alt="Cropped" />}                    
                  </div>
              </div>
        
              <div className="mt-4 pt-2">
                <input className="btn btn-outline-primary btn-lg" type="button" onClick={onClick} value="Submit" />
              </div>

            </form>
          </div>
  )
}

export default DeliverySignup1