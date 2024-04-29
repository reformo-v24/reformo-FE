import axios from "axios";

// For common config
axios.defaults.headers.post["Content-Type"] = "application/json";
export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
 
});
