import { combineReducers } from "redux";
import {
  completedIGOPools,
  upcomingIGOPools,
  featuredIGOPools,
  singlePoolDetail,
  upcomingIGOPagination,
  completedIGOPagination,
  featuredIGOPagination,
  projectDetail,
  liveIGOPools,
  liveIGOPagination,
  closedregIGOPools,
  closedregPagination
} from "./auth.reducer";
import {
  fetchUserProfileDetail,
  fetchUserIGOPools,
  updatedProfileDetail,
} from "./user.reducer";
import { fetchNetworkId, web3Data } from "./web3.reducer";

const rootReducer = combineReducers({
  singlePoolDetail,
  fetchNetworkId,
  completedIGOPools,
  web3Data,
  projectDetail,
  upcomingIGOPools,
  featuredIGOPools,
  upcomingIGOPagination,
  completedIGOPagination,
  featuredIGOPagination,
  fetchUserProfileDetail,
  fetchUserIGOPools,
  updatedProfileDetail,
  liveIGOPools,
  liveIGOPagination,
  closedregIGOPools,
  closedregPagination
});

export default rootReducer;
