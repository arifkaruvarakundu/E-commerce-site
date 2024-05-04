import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios_instance';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';


function ProductList() {
  const [products, setProducts] = useState([]);
  const axios = AxiosInstance();

  useEffect(() => {
    axios.get('products_list/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 py-5 underline">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-100 flex flex-col items-center justify-center">
              {product.image && <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded-full mb-4" />}
              <h2 className="text-xl font-semibold text-center">{product.title}</h2>
              <p className="text-sm text-center">Price: {product.price}</p>
              <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline font-bold mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
