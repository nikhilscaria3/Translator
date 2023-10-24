// utils/api.js
import axios from 'axios';


export const setAuthToken = (token) => {
  if (token) {
    // Apply the token to all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove the token for logout or when it's no longer needed
    delete axios.defaults.headers.common['Authorization'];
  }
};


