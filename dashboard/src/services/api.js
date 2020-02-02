import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hugo-data.s3.us-east-2.amazonaws.com'
});

export default api;
