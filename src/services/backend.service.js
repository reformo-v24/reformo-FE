import { api } from "../config";
// import { //Toast } from '../helper///Toastify.message'

export const backendServices = {
  get,
  post,
  put,
};

async function post(url, params) {
  const token = localStorage.getItem("liquidToken");
  const header = token
    ? { "content-type": "application/json", "x-auth-token": token }
    : {
        "content-type": "application/json",
      };
  return api
    .post(url, params, { headers: header })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      // Error
      if (error.response) {
        const pathname = window.location.pathname;
        //Toast.error(error.response.data.message)
        if (pathname === "/register") return error.response;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        //Toast.error(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
        //Toast.error(error.message)
      }
      // console.log(error.config);
    });
}

async function get(url) {
  const token = localStorage.getItem("liquidToken");
  const header = token
    ? {
        "x-auth-token": token,
        "api-key":
          "9979fd5e7cb73fc0a207226b7d62c7b43f98a8f27e3f05c5e79bd7d62cb1b0db",
        "content-type": "application/json",
      }
    : {
        "api-key":
          "9979fd5e7cb73fc0a207226b7d62c7b43f98a8f27e3f05c5e79bd7d62cb1b0db",
        "content-type": "application/json",
      };
  return api
    .get(url, { headers: header })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      // Error
      if (error.response) {
        return error;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        //Toast.error(error.response.data.message)
      } else if (error.request) {
        return error;
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        //Toast.error(error.request)
      } else {
        return error;
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
        //Toast.error(error.message)
      }
      // console.log(error.config);
    });
}

async function put(url, params) {
  const token = localStorage.getItem("liquidToken");
  const header = token
    ? { "x-auth-token": token }
    : {
        "content-type": "application/json",
      };
  return api
    .put(url, params, { headers: header })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      // Error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        //Toast.error(error.response.data.message)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        //Toast.error(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
        //Toast.error(error.message)
      }
      // console.log(error.config);
    });
}
