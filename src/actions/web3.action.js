import { services } from "../services";
// import { //Toast } from "../helper///Toastify.message";

function fetchUserBalances(data) {
  return {
    type: "FETCH_USER_BALANCES", // dispatch user login event
    data: data,
  };
}

function setDispatchData(data, type) {
  return { data: data, type: type };
}

// get defi categories
function getNetworkId() {
  return (dispatch) => {
    const response = services.getNetworkId();
    response.then((promise) => {
      dispatch(setDispatchData(promise, "FETCH_NETWORK_ID"));
    });
  };
}

function getWeb3(val) {
  if (val) {
    return (dispatch) => {
      dispatch(
        setDispatchData(
          {
            isLoggedIn: false,
            accounts: [],
          },
          "WEB3DATA"
        )
      );
    };
  } else
    return (dispatch) => {
      const response = services.getWeb3();
      response.then((promise) => {
        if (promise) {
          dispatch(setDispatchData(promise, "WEB3DATA"));
        } else {
          // console.log('errorrrr in actions');
        }
      });
    };
}
const enableMetamask = () => {
  return (dispatch) => {
    const response = services.enableMetamask();
    response.then((promise) => {
      if (!promise.error) {
        dispatch({ type: "LOGGED_IN", data: promise });
      } else {
        if (promise.error)
          //Toast.error(promise.msg);
          dispatch({ type: "LOGGED_IN_ERROR", data: promise });
      }
    });
  };
};

const enabledWalletConnect = () => {
  return (dispatch) => {
    const response = services.enabledWalletConnect();
    response.then((promise) => {
      if (promise) {
        dispatch({ type: "LOGGED_IN", data: promise });
      } else {
        dispatch({
          type: "LOGGED_OUT",
          data: { isLoggedIn: false, accounts: [] },
        });
      }
    });
  };
};

// const getWeb3 = () => {
//   return (dispatch) => {
//     const response = services.getWeb3();
//     response.then((promise) => {
//       if (promise?.accounts[0]) {
//         dispatch({ type: "LOGGED_IN", data: promise });
//       } else {
//         dispatch({
//           type: "LOGGED_OUT",
//           data: { isLoggedIn: false, accounts: [] },
//         });
//       }
//     });
//   };
// };

const generateNonce = (address) => {
  return async (dispatch) => {
    const url = `admin/get-nonce/${address}`;
    const response = services.get(url);
    response.then((promise) => {
      if (promise?.status === 200) {
        dispatch({ type: "GENERATE_NONCE", data: promise.data.data.nonce });
      } else {
        dispatch({
          type: "LOGGED_OUT",
          data: { isLoggedIn: false, accounts: [] },
        });
      }
    });
  };
};

const enableWeb3Modal = () => {
  return async (dispatch) => {
    try {
      // services.web3
      const response = services.enableWeb3Modal(dispatch);
      response.then((promise) => {
        if (promise) {
          dispatch({ type: "WEB3DATA", data: promise });
        } else {
          dispatch({
            type: "WEB3DATA",
            data: { isLoggedIn: false, accounts: [] },
          });
        }
      });
    } catch (error) {
      console.error("error occurred during enable wallet", error);
    }
  };
};

const disableWeb3Modal = () => {
  return async (dispatch) => {
    const response = services.disableWeb3Modal();
    response.then((promise) => {
      if (promise) {
        dispatch({ type: "WEB3DATA", data: promise });
      } else {
        dispatch({
          type: "WEB3DATA",
          data: { isLoggedIn: false, accounts: [] },
        });
      }
    });
  };
};

export const web3Actions = {
  enableWeb3Modal,
  enabledWalletConnect,
  enableMetamask,
  generateNonce,
  getWeb3,
  getNetworkId,
  disableWeb3Modal,
  // refreshAccountData,
};
