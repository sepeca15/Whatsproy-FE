
import axios from 'axios';

const globalApi = axios.create({
  baseURL: 'app.whatsproy.com/',
});

export default globalApi

