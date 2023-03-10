import { AxiosError } from "axios";


export const errorInterceptor = (error: AxiosError) => {
   if(error.message === "Network Error"){
      return Promise.reject(new Error('Error de conexão.'))
   }


   if(error.response?.status === 401) {
      return Promise.reject(new Error('algo deu errado'))
   }

   return Promise.reject(error);
};