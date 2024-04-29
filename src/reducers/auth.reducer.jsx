export const isAuthenticated = function (
  state = { isLoggedIn: false, accounts: [] },
  action
) {
  switch (action.type) {
    case "LOGGED_IN":
      return { ...action.data };
    case "LOGGED_IN_ERROR":
      return { ...action.data };
    case "LOGGED_OUT":
      return { ...action.data };
    default:
      return state;
  }
};

export const dataRefresh = function (state = false, action) {
  switch (action.type) {
    case "DATA_REFRESH":
      return true;
    case "DATA_REFRESHED":
      return false;
    default:
      return state;
  }
};

export const fetchNonce = function (state = null, action) {
  switch (action.type) {
    case "GENERATE_NONCE":
      return action.data;
    default:
      return state;
  }
};

export const socialCSVData = function (state = null, action) {
  switch (action.type) {
    case "SOCIAL_CSV_DATA":
      return action.data;
    default:
      return state;
  }
};

export const snapshotWinnersData = function (state = null, action) {
  switch (action.type) {
    case "SNAPSHOT_WINNERS_DATA":
      return action.data;
    default:
      return state;
  }
};

export const snapshotData = function (state = null, action) {
  switch (action.type) {
    case "GET_SNAPSHOT_DATA":
      return action.data;
    default:
      return state;
  }
};

export const fileHash = function (state = null, action) {
  switch (action.type) {
    case "GENERATE_FILE_HASH":
      return action.data;
    default:
      return state;
  }
};

export const lotteryGenerated = function (state = null, action) {
  switch (action.type) {
    case "GENERATE_LOTTERY":
      return action.data;
    default:
      return state;
  }
};

export const completedIGOPools = function (state = [], action) {
  switch (action.type) {
    case "COMPLETED_IGO_POOLS":
      return action.data;
    default:
      return state;
  }
};
export const completedIGOPagination = function (state = [], action) {
  // console.log(action);
  switch (action.type) {
    case "COMPLETED_IGO_PAGINATION":
      return action.data;
    default:
      return state;
  }
};
export const liveIGOPools = function(state=[], action) {
  switch (action.type){
    case "LIVE_IGO_POOLS":
      return action.data;
    default:
      return state;
  }
}
export const liveIGOPagination = function (state = [], action) {
  switch (action.type) {
    case "LIVE_IGO_PAGINATION":
      return action.data;
    default:
      return state;
  }
};
export const closedregIGOPools = function(state=[], action) {
  switch (action.type){
    case "CLOSEDREG_IGO_POOLS":
      return action.data;
    default:
      return state;
  }
}
export const closedregPagination = function (state = [], action) {
  switch (action.type) {
    case "CLOSEDREG_IGO_PAGINATION":
      return action.data;
    default:
      return state;
  }
};
export const upcomingIGOPools = function (state = [], action) {
  // console.log(action);
  switch (action.type) {
    case "UPCOMING_IGO_POOLS":
      return action.data;
    default:
      return state;
  }
};
export const upcomingIGOPagination = function (state = [], action) {
  // console.log("upcomingPagination", action);
  switch (action.type) {
    case "UPCOMING_IGO_PAGINATION":
      return action.data;
    default:
      return state;
  }
};
export const featuredIGOPools = function (state = [], action) {
  switch (action.type) {
    case "FEATURED_IGO_POOLS":
      return action.data;
    default:
      return state;
  }
};
export const featuredIGOPagination = function (state = [], action) {
  switch (action.type) {
    case "FEATURED_IGO_PAGINATION":
      return action.data || state;
    default:
      return state;
  }
};
export const singlePoolDetail = function (state = null, action) {
  // console.log(action);
  switch (action.type) {
    case "SINGLE_IGO_POOL":
      return action.data;
    default:
      return state;
  }
};

export const projectDetail = function (state = null, action) {
  // console.log(action);
  switch (action.type) {
    case "PROJECT_DETAIL":
      return action.data;
    default:
      return state;
  }
};
