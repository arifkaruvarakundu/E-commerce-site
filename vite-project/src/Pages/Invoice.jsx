import React from 'react';
import { useState,useEffect } from 'react';
import AxiosInstance from '../../Axios_instance';

function Invoice() {
    // Retrieve cartItems from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const [order, setOrder] = useState(null);
    const axios = AxiosInstance()    
    // Function to calculate total price
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        return totalPrice.toFixed(2);
    };
    const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());

    

    useEffect(() => {
        // Retrieve order_id from local storage
        const order_id = localStorage.getItem('order_id');
        console.log("order_id",order_id)
    
        // Check if order_id exists
        if (order_id) {
          axios.get(`order/${order_id}/`)
            .then(response => {
              // Set the fetched order to state
              console.log('response',response.data)
              setOrder(response.data);
            })
            .catch(error => {
              console.error('Error fetching order details:', error);
            });
        }
    }, []);

  const handleCheckout = () => {
    
  };

    
    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h2 className="mb-0">Invoice</h2>
                </div>
                <div className="card-body">
                {order && (
                <>
                    <div className="row mb-3">
                        <div className="col-sm">
                            <strong>Invoice Number:</strong> {order.invoice_number}
                        </div>
                        <div className="col-sm">
                            <strong>Invoice Date:</strong> {order.invoice_date}
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                                <td><strong>${calculateTotalPrice()}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    <button className="btn btn-primary" onClick={handleCheckout}>Download Inoice</button>
                    </>
                    )}
                </div>
                
            </div>
        </div>
    );
}

export default Invoice;
