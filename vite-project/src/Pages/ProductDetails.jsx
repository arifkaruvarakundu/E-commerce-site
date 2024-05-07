import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AxiosInstance from '../../Axios_instance';
import { useDispatch,useSelector } from 'react-redux';
import { addToCart } from '../Redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const axios = AxiosInstance();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cart.cartItems);

  useEffect(() => {
    axios.get(`products_list/`)
      .then(response => {
        const foundProduct = response.data.find(prod => prod.id === parseInt(productId));
        setProduct(foundProduct);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [productId]);

  const addToCartHandler = (product) => {
    console.log("Before adding to cart:", cartItems); // Log before dispatching action
    dispatch(addToCart(product));
  };

  useEffect(() => {
    console.log("After adding to cart:", cartItems);
    localStorage.setItem('cartItems',JSON.stringify(cartItems))
  }, [cartItems]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <section className="product-details spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="card">
              <img className="card-img-top" src={product.image} alt={product.title} />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="card-body">
              <h3 className="card-title">{product.title}</h3>
              <div className="card-text">Rs: {product.price}</div>
              <p className="card-text">{product.description}</p>
              <Link to='/'>
              <button onClick={() => addToCartHandler(product)} className="btn btn-primary">ADD TO CART</button> {/* Use addToCart function */}
              </Link>
              <Link to={`/cart`} className="btn btn-secondary ml-2"><FontAwesomeIcon icon={faCartShopping} /></Link>
              <ul className="list-group mt-3">
                <li className="list-group-item"><b>Availability:</b> In Stock</li>
                <li className="list-group-item"><b>Shipping:</b> 01 day shipping. Free pickup today</li>
                <li className="list-group-item"><b>Weight:</b> 0.5 kg</li>
                <li className="list-group-item"><b>Share on:</b>
                  <div className="share">
                    <a href="#" className="btn btn-sm btn-outline-primary mr-1"><i className="fa fa-facebook"></i></a>
                    <a href="#" className="btn btn-sm btn-outline-info mr-1"><i className="fa fa-twitter"></i></a>
                    <a href="#" className="btn btn-sm btn-outline-danger mr-1"><i className="fa fa-instagram"></i></a>
                    <a href="#" className="btn btn-sm btn-outline-warning"><i className="fa fa-pinterest"></i></a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
