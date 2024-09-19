import axios from "axios"

export const makeRequest = axios.create({
    baseURL: 'http://localhost:9900/api',
    withCredentials: true
  });