import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../../Axios_instance';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const axios = AxiosInstance();

  useEffect(() => {
    axios.get(`ordersList/`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const viewOrderDetails = (orderId) => {
    const selected = orders.find(order => order.id === orderId);
    setSelectedOrder(selected);
  };

  const goBackToList = () => {
    setSelectedOrder(null);
  };

  const downloadOrderPdf = () => {
    if (selectedOrder) {
      axios.get(`orderPdf/${selectedOrder.id}`, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `order_${selectedOrder.invoice_number}.pdf`);
          document.body.appendChild(link);
          link.click();
        })
        .catch(error => {
          console.error('Error downloading PDF:', error);
        });
    }
  };

  if (selectedOrder) {
    return (
      <div className="container">
        <h2>Order Details</h2>
        <button onClick={goBackToList} className="btn btn-secondary mb-3">Back to Orders</button>
        <p><strong>ID:</strong> {selectedOrder.id}</p>
        <p><strong>Invoice Number:</strong> {selectedOrder.invoice_number}</p>
        <p><strong>Invoice Date:</strong> {selectedOrder.invoice_date}</p>
        <p><strong>Customer ID:</strong> {selectedOrder.user}</p>
        <p><strong>Status:</strong> {selectedOrder.status}</p>
        <p><strong>Total:</strong> ${selectedOrder.total_price}</p>
        <button onClick={downloadOrderPdf} className="btn btn-primary">Download PDF</button>
      </div>
    );
  } else {
    return (
      <div className="container">
        <h2>Orders List</h2>
        <ul className="list-group">
          {orders.map(order => (
            <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{order.invoice_number}</span>
              <button onClick={() => viewOrderDetails(order.id)} className="btn btn-primary">View Details</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default OrdersList;
