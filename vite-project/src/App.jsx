import { Provider } from 'react-redux';
import store from './Redux/store';
import ProductList from './Pages/ProductList'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/Cart';
import Invoice from './Pages/Invoice';
import 'bootstrap/dist/css/bootstrap.css';
import SignUp from './Pages/Signup';
import SignIn from './Pages/SignIn';


function App() {
  

  return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/product/:productId" element ={<ProductDetails/>}/>
            
            <Route path="/cart" element={<CartPage/>}/>
            
            <Route path="/invoice" element = {<Invoice/>}/>
          </Routes>
        </Router>
      </Provider>
  )
}

export default App
