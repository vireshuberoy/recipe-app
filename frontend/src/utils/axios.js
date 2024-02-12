import axios from "axios";
import { getToken } from "./auth";

const instance = axios.create({
  // .. where we make our configurations
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common["hacks_header"] = getToken();

export default instance;
