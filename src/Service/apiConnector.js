import axios from "axios";

// const BASE_URL = "http://localhost:8000/api/v1";
 const FASTAPI_BASE_URL ="https://ai-news-assistant-6gwu.onrender.com/api"

export const axiosInstance = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: 60000,
   withCredentials: true, 
});



export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: headers || null, // you can override token if needed
    params: params || null,
  });
};
