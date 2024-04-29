export function fetchNetworkId(state = null, action) {
  switch (action.type) {
    case "FETCH_NETWORK_ID":
      return action.data;
    default:
      return state;
  }
}

export function web3Data(
  state = {
    isLoggedIn: false,
    accounts: [],
  },
  action
) {
  switch (action.type) {
    case "WEB3DATA":
      return { ...action.data };
    default:
      return state;
  }
}
