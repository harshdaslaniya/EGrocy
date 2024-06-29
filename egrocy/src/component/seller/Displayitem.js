import React ,{useState  , useEffect} from 'react';
import dummy from "./dummy1.png"
import axios from 'axios';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
  } from 'mdb-react-ui-kit';
import { Link ,useLocation ,useNavigate} from 'react-router-dom';

function Displayitem() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');


  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:8000/seller/itemDetail?id=${id}`;
        const response = await axios.get(url, { withCredentials: true });

        if (response.type === 'error') {
          navigate('/login/sellerlogin');
        }
        setData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.status === 500) {
          navigate('/login/sellerlogin');
        }
      }
    };

    fetchData();
  }, [navigate ,id]); // Empty dependency array to run effect only once
  console.log(data);
	return (
        <>
        <section>
        <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src= { (data) ? `data:image/jpeg;base64, ${data.image}` : dummy}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '250px' }}
                  fluid />
                
                <div className="d-flex justify-content-center mb-2">
                <Link to="/Seller/Updatephoto"><input type='button' className='btn btn-outline-danger mt-2' value="Upgrade" ></input></Link>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Product Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(data) ?data.productName : "loading..."}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Category</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(data) ?data.category : "loading..."}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Price</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(data) ?data.price + " ₹  per " +data.pricePer  : "loading..."}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Discription</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(data) ?data.description: "loading..."}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol >
                  <Link to="/Seller/Updatedetail"><input type='button' className='btn btn-outline-danger' value="Upgrade"></input></Link>
                  </MDBCol>
                 
                </MDBRow>
                
              </MDBCardBody>
            </MDBCard>

            
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
</>

	);
  }
  

export default Displayitem;
