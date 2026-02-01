import axios from "axios";
import { config } from "../config";

const http = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
});

export default http;
