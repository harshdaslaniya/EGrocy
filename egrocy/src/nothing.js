import React from 'react'
import "./nothing.css"

function Nothing(){


  return (
    <>
    <div className="wrap-error">
      <div className="d-flex align-items-center h-100">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 offset-sm-2 text-center text-white">
              <h1 className=""><span>4</span><span>0</span><span>4</span></h1>
              <h5 className="">Oops! Page not found</h5>
              <p className="mb-4">we are sorry, but the page you requested was not found</p>
              <a href="/"><button className="btn btn-dark" >
                Go home
                </button></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default Nothing;
