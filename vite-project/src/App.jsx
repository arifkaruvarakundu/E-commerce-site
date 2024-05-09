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
import OrdersList from './Pages/Dashboard/OrderList';
import Dashboard from './Pages/Dashboard/Home';
import OrderSalesReport from './Pages/Dashboard/OrderReport';

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
            <Route path="/Home" element = {<Dashboard/>}/>
            <Route path="/ordersList" element = {<OrdersList/>}/>
            <Route path="/orderReport" element = {<OrderSalesReport/>}/>
          </Routes>
        </Router>
      </Provider>
  )
}

export default App
