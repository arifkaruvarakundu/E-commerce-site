import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import AxiosInstance from '../../Axios_instance';

const ProductDetails = () => {
  
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const axios = AxiosInstance();

  useEffect(() => {
    axios.get('products_list/')
      .then(response => {
        const foundProduct = response.data.find(prod => prod.id === parseInt(productId));
        setProduct(foundProduct);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center">
  {/* Left column for the image */}
  <div>
    <img src={product.image} alt={product.title} className="max-w-xs h-auto" />
  </div>
  {/* Right column for the product details */}
  <div className="lg:w-1/2 flex flex-col justify-center">
    {/* Product details */}
    <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
    <p className="text-lg mb-4">{product.description}</p>
    <p className="text-lg mb-4">Price: ${product.price}</p>  
    {/* Add to cart button */}
    <Link to={`/cart/${productId}`} className="bg-blue-800 text-black px-6 py-3 rounded-lg text-lg hover:bg-blue-600">
  Go to Cart
</Link>
  </div>
</div>
  );
};

export default ProductDetails;
