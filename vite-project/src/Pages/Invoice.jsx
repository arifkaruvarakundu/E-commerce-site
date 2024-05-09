import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios_instance';

function Invoice() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const [order, setOrder] = useState(null);
    const axios = AxiosInstance();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const order_id = localStorage.getItem('order_id');
        if (order_id) {
          axios.get(`order/${order_id}/`)
            .then(response => {
              setOrder(response.data);
              console.log(response.data)
              setTotalPrice(calculateTotalPrice(cartItems));
            })
            .catch(error => {
              console.error('Error fetching order details:', error);
            });
        }
    }, []);

    const calculateTotalPrice = (items) => {
        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        return totalPrice.toFixed(2);
    };

    const handlePdfGeneration = () => {
        if (order) {
            axios.get(`generate_invoice_pdf/${order.id}`, { responseType: 'blob' })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `invoice_${order.invoice_number}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(error => {
                    console.error('Error downloading PDF:', error);
                });
        }
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
                                <td><strong>${totalPrice}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    <button className="btn btn-primary" onClick={handlePdfGeneration}>Download Invoice</button>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Invoice;
