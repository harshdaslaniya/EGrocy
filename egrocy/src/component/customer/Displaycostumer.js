import React ,{useState  , useEffect} from 'react';
// import dum from "../seller/dummy1.png";
import { Link ,useLocation ,useNavigate} from 'react-router-dom';
import axios from 'axios';

function Displaycostumer() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category= searchParams.get('category');
    const [form, setForm] = useState({
        'page': 1 ,
        'limit': 9 ,
        'category':category
    });
    const [data, setData] = useState(null);

  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams(form).toString();
            const url = `http://localhost:8000/customer/getItem?${queryParams}`;
            const response = await axios.get(url, { withCredentials: true });
        
          if (response.type === "error") {
            navigate('/login/customerlogin');
        }
          setData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error:', error);
          if (error.response && error.response.status === 500) {
            navigate('/login/customerlogin');
        }
        }
      };
  
      fetchData();
    }, [navigate , form]);

    const handlePageChange = (pageNumber) => {
        if(pageNumber === 'previous'){
            if(form.page !== 1){
                setForm({
                    'page': form.page - 1 ,
                    'limit': 9 
                })
            }
            
        }
        else if(pageNumber === 'next'){
           
            if(form.page !== data.totalPage){
                setForm({
                    'page': form.page + 1 ,
                    'limit': 9 
                })
            }
            
        }
        else {
            setForm({
                'page': pageNumber ,
                'limit': 9 
            })
        }
        
      };

	return (
        <div className='container mb-5 '>
            <h1>{category}</h1>

            <div className="row row-cols-1 row-cols-md-4 g-4">

            {data && data.items.map((item, index) => (
                <div className="col" key={index}>
                    <Link to={`/Seller/Displayitem?id=${item._id}`} className="card-link text-secondary" style={{  textDecoration: 'none' }}>
                    <div className="card h-100">
                    <img src={`data:image/jpeg;base64, ${item.image}`} className="card-img-top" alt="" />
                    <div className="card-body">
                        <h5 className="card-title">{item.productName}</h5>
                    </div>
                    </div>
                    </Link>
                </div>
                ))}
            </div>
	  

        {/* // pagination********************************************************************* */}

        <nav aria-label="...">
        <ul className="pagination justify-content-center m-5 ">
            <li className="page-item ">
            <button className="page-link" onClick={() => handlePageChange('previous')} >Previous</button>
            </li>
            
            {data &&  [...Array(data.totalPage)].map((_, index) => (
                <li className={`page-item ${index + 1 === form.page ? 'active' : ''}`} key={index}>
                    <button className="page-link"  onClick={() => handlePageChange(index + 1)} >{index + 1}</button>
                </li>
                ))}


            <li className="page-item">
            <button  className="page-link"  onClick={() => handlePageChange('next')}>Next</button>
            </li>
        </ul>
        </nav>
        </div>


	);
  }
  

export default Displaycostumer;
