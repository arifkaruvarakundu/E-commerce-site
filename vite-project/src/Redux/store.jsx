// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import authReducer from './authslice';
const store = configureStore({
  reducer: {
    cart: rootReducer,
    auth: authReducer,
  },
});

export default store;


