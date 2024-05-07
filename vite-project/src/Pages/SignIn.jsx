import React, { useState } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../../src/Redux/authslice';


import AxiosInstance from '../../Axios_instance';

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  
  const axios=AxiosInstance()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('login/', formData)
      .then((response) => {
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
        dispatch(setIsAuthenticated());
        navigateTo('/');
        toast.success('You SignedIn successfully',{
          autoClose: 1000,});
      })
      .catch((error) => {
        
        console.error('Sign-in error', error);
        toast.error('Invalid Credentials, Please Try Again',{autoClose:1000});
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center w-[35%]">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Sign In
        </h2>
        <form className="space-y-4 w-full px-10">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-black rounded-full px-4 py-3"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <p className="text-center py-5">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
        
      </div>
      <ToastContainer />
    </div>
    
  );
}

export default SignIn;
