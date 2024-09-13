import axios from 'axios';

axios.defaults.validateStatus = (status) => status >= 200 && status <= 403;

export default axios;
