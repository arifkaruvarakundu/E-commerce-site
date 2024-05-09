import React from 'react';
import { Link } from 'react-router-dom'; 
import { FaShoppingCart, FaList } from 'react-icons/fa'; 

const Dashboard = () => {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-6">
          <Link to="/orderReport" className="text-dark text-decoration-none">
            <div className="card mb-4">
              <div className="card-body">
                <FaList size={50} />
                <h5 className="card-title mt-3">Order Report</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/ordersList" className="text-dark text-decoration-none">
            <div className="card mb-4">
              <div className="card-body">
                <FaShoppingCart size={50} />
                <h5 className="card-title mt-3">Orders</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
