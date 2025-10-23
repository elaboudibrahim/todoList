
import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

//  ajoute le token automatiquement
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore();
      auth.logout(); 
      router.push("/login"); 
    }
    return Promise.reject(error);
  }
);

export default api;


