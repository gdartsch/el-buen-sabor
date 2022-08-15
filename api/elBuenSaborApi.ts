import axios from 'axios';

const elBuenSaborApi = axios.create({
    baseURL: '/api',
});

export default elBuenSaborApi;