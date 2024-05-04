import { useState } from 'react'
import ProductList from './Pages/ProductList'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/Cart';

function App() {
  

  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:productId" element ={<ProductDetails/>}/>
          <Route path="/cart/:productId" element={<CartPage/>}/>
        </Routes>
      </Router>
    
  )
}

export default App
