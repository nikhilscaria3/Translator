import axios from 'axios';

// Create a new Axios instance with your custom configuration
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Set your base URL here

});

export default instance;
