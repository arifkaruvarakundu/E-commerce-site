import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AxiosInstance from '../../Axios_instance';

const CartPage = () => {
  const { productId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const axios = AxiosInstance();

  useEffect(() => {
    axios.get('products_list/')
      .then(response => {
        const foundProduct = response.data.find(prod => prod.id === parseInt(productId));
        setCartItems([foundProduct]);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      newQuantity = 1;
    }
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
  };

  // Function to calculate the total price of the cart
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-semibold text-gray-900">Cart</h1>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-800">
                {cartItems.map((item) => (
                  <tr key={item.id} className="flex items-center justify-between py-6">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="w-full h-32 object-cover rounded-full mb-4"
                        src={item.image}
                        alt={item.title}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stock < 1 ? (
                        <span className="text-red-500">Out of Stock</span>
                      ) : (
                        <div className="flex items-center">
                          <button
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-input w-16 text-center mx-2"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                          />
                          <button
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-500" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-4 bg-gray-50 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total: ${calculateTotalPrice()}</span>
              <button className="bg-blue-500 text-black px-6 py-3 rounded-md text-lg hover:bg-blue-600">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
