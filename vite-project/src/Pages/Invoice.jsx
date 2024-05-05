import React from 'react';
import { useSelector } from 'react-redux';
function Invoice() {
    const cartItems = useSelector(state=>state.cart.cartItems)
    
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
              <tr>
                <td>Product 1</td>
                <td>2</td>
                <td>$10.00</td>
                <td>$20.00</td>
              </tr>
              <tr>
                <td>Product 2</td>
                <td>1</td>
                <td>$15.00</td>
                <td>$15.00</td>
              </tr>
              {/* Add more rows for additional products */}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                <td><strong>$35.00</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
