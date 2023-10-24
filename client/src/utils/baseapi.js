import axios from 'axios';

// Create a new Axios instance with your custom configuration
const instance = axios.create({
  baseURL: 'https://translator-6r38.vercel.app', // Set your base URL here

});

export default instance;
