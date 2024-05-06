import React from 'react';
import { useState } from 'react';
import AxiosInstance from '../../Axios_instance';

function Invoice() {
    // Retrieve cartItems from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
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

    

    const createOrder = async () => {
      try {
        const response = await axios.post('/orders/', {
            total_price: totalPrice,
            // You can include other order data if needed
        });
        if (response.status === 200 || response.status === 201) {
            // Order created successfully, redirect to another page or perform other actions
            history.push('/order-confirmation');
        } else {
            console.error('Failed to create order:', response.statusText);
            // Handle error accordingly
        }
    } catch (error) {
        console.error('Error creating order:', error);
        // Handle error accordingly
    }
};

  const handleCheckout = () => {
    createOrder();
  };

    
    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h2 className="mb-0">Invoice</h2>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-sm">
                            <strong>Invoice Number:</strong> INV-123456
                        </div>
                        <div className="col-sm">
                            <strong>Invoice Date:</strong> January 1, 2024
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
                    <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Invoice;
