import {useEffect,useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../Redux/actions'
import AxiosInstance from '../../Axios_instance';

const CartPage = () => {
  // const cartItems = useSelector(state => state.cart.cartItems);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const axios = AxiosInstance()
  const navigateTo = useNavigate()
  const dispatch = useDispatch();

  // Function to calculate the total price of the cart
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    console.log("Current cartItems:", cartItems);
    
  }, [cartItems]);

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    setTotalPrice(totalPrice);
  }, [cartItems]);

  // Function to update the quantity of an item in the cart
const handleQuantityChange = (itemId, newQuantity) => {
  if (newQuantity > 0) {
    dispatch(updateQuantity(itemId, newQuantity));

    // Update quantity of the item in the cart
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Update localStorage with the updated cart items and new quantity
    updateCartItemsInLocalStorage(updatedCartItems);
    localStorage.setItem(`quantity_${itemId}`, newQuantity);

    // Update cartItems state
    setCartItems(updatedCartItems);

    // Calculate total price after quantity change
    const totalPrice = calculateTotalPrice(updatedCartItems);
    setTotalPrice(totalPrice);
  }
};

  // Function to remove an item from the cart
  const handleRemoveFromCart = (itemId) => {
    // Dispatch action to remove item from Redux store
    dispatch(removeFromCart(itemId));
    // Update cartItems state and localStorage immediately
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
    updateCartItemsInLocalStorage(updatedCartItems);
     // Remove quantity of the item from localStorage
    localStorage.removeItem(`quantity_${itemId}`);
   };

  function updateCartItemsInLocalStorage(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
    setTotalPrice(calculateTotalPrice(items));
  }
  const user_email = localStorage.getItem('email')
  const handleCheckout = () => {
    axios
      .post('createOrder/', { total_price:totalPrice,user_email:user_email }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .then((response) => {
        console.log("Order created Successfully", response.data);
        localStorage.setItem("order_id",response.data.id)
        navigateTo('/invoice'); // Assuming navigateTo is a function to navigate to the '/invoice' route
      })
      .catch((error) => {
        console.error('Order creation Failed:', error);
  
        let errorMessage = 'Order Creation failed. Please try again later.';
  
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
  
        // Handle error or show error message
      });
  };
  



  

  return (
    <div className="bg0 p-t-75 p-b-85">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 col-xl-7 m-lr-auto m-b-100">
            <div className="m-l-25 m-r--38 m-lr-0-xl">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead style={{ padding: '100px' }}>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="how-itemcart1">
                            <img src={item.image} alt="Product Image" style={{ height: '60px', width: '60px' }} />
                          </div>
                        </td>
                        <td>{item.title}</td>
                        <td>${item.price}</td>
                        <td>
                          {item.stock < 1 ? (
                            <span className="text-danger"></span>
                          ) : (
                            <div style={{ display: 'inline-block' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                
                              <input 
                                type="number" 
                                className="form-control quantity-input" 
                                value={item.quantity} 
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value);
                                  if (newQuantity > 0) {
                                    handleQuantityChange(item.id, newQuantity);
                                  }
                                }} 
                              />
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-4 bg-gray-50 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total: ${calculateTotalPrice()}</span>
                  <button className="btn btn-sm btn-primary text-black px-6 py-3 rounded-md text-lg hover:bg-blue-600 " onClick={handleCheckout}>Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
