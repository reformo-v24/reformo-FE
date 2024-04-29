import { services } from "../services";

const authLogin = (nonce, signature) => {
  return (dispatch) => {
    const url = "admin/login";
    let params = JSON.stringify({ nonce: nonce, signature: signature });
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        localStorage.setItem("inoRole", promise.data.data.role);
        localStorage.setItem("liquidToken", promise.data.data.token); 
        if (promise.data.data.token) {
          const newresp = await services.getWeb3(true);
          localStorage.setItem("userAddress", newresp.accounts[0]); 
          localStorage.setItem("userId", promise.data.data._id); 
          dispatch({ type: "LOGGED_IN", data: newresp });
          dispatch({ type: "USER_FETCHED", data: promise.data.data });
        }
        
      } else {
        localStorage.setItem("liquidToken", "");
        localStorage.setItem("inoRole", "");
      }
    });
  };
};

const getUser = () => {
  return (dispatch) => {
    let userID = localStorage.getItem("userId");
    const response = services.get("admin/single/" + userID);
 
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "USER_FETCHED", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const createNFT = (params) => {
  return (dispatch) => {
    let url = "/nft/create";
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "CREATE_nft", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const createProject = (params) => {
  return (dispatch) => {
    let url = "/project/create";
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "CREATE_PROJECT", data: true });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const editProject = (params) => {
  return (dispatch) => {
    let url = `/project/edit`;
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "EDIT_PROJECT", data: true });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const updateNFT = (params) => {
  return (dispatch) => {
    let url = "/nft/mint";
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "UPDATE_NFT", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const getSingleNFTDetails = (id) => {

  return (dispatch) => {
    let url = `/nft/single/${id}`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "SINGLE_NFT_DETAILS", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const getUnapprovedSubAdmins = (id) => {
  // const response = services.get('/nft/list')

  return (dispatch) => {
    let url = `/admin/list`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({
            type: "UNAPPROVED_SUBADMIN_LIST",
            data: promise.data.data,
          });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const getAdminProjects = (id) => {
  // const response = services.get('/nft/list')

  return (dispatch) => {
    let url = `project/list?createdBy=${id}`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "ADMIN_PROJECTS", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const generateSnapShot = (id) => {
  return (dispatch) => {
    let url = `/admin/gen-snapshot?projectId=${id}`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        dispatch({ type: "SNAPSHOT_GENERATED", data: true });
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const getSingleProject = (id) => {
  return (dispatch) => {
    let url = `/project/single/${id}`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "SINGLE_PROJECT_DETAILS", data: promise.data.data });
        }
      } else {
        console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const getProjects = (id, isAllProjects) => {
  return (dispatch) => {
    let url = isAllProjects ? `/project/list` : `/project/list?createdBy=${id}`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "PROJECTS_LIST", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const uploadSocialCSV = (csvData, selectedProjectId) => {
  console.log("our");
  return (dispatch) => {
    var data = new FormData();
    data.append("csv", csvData);
    data.append("projectId", selectedProjectId);
    const params = data;
    let url = `/admin/upload-social-raffle`;
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        dispatch({ type: "SOCIAL_CSV_DATA", data: true });
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const fetchSnapshotWinnersData = (selectedProjectId) => {
  console.log("our");
  return (dispatch) => {
    let url = `/admin/get-whitelisted-user?projectId=${selectedProjectId}`;

    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "SNAPSHOT_WINNERS_DATA", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const addMerkleHash = (selectedProjectId, merkleHash) => {
  return (dispatch) => {
    const params = {
      projectId: selectedProjectId,
      rootHash: merkleHash,
    };
    let url = `/project/edit`;
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "ADDED_MERKLE_HASH", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const getSnapShotData = (projectId) => {
  return (dispatch) => {
    let url = `/admin/get-snapshot-data?projectId=${projectId}`;
    const response = services.get(url);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "GET_SNAPSHOT_DATA", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const generateFileHash = (allocationdata) => {
  return (dispatch) => {
    let url = `/admin/gen-filehash`;
    const response = services.post(url, allocationdata);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "GENERATE_FILE_HASH", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const generateLottery = (projectId, allocationdata) => {
  return (dispatch) => {
    let url = `/admin/gen-lottery?projectId=${projectId}&requestNo=${allocationdata}`;
    const response = services.get(url, allocationdata);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "GENERATE_LOTTERY", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};

const getCompletedIGOPools = (page) => {
  return (dispatch) => {
    const response = services.get(`/IGOPools/completed-list?page=${page}`);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "COMPLETED_IGO_POOLS", data: promise.data.data });
          dispatch({
            type: "COMPLETED_IGO_PAGINATION",
            data: promise.data.pagination,
          });
        }
      } else {
        console.log("Something went wrong.!");
      }
    });
  };
};
const getLiveIGOPools = (page) => {
  return (dispatch)=>{
    const response =  services.get(`/IGOPools/liveIGO?${page}`)

    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "LIVE_IGO_POOLS", data: promise.data.data });
          dispatch({
            type: "LIVE_IGO_PAGINATION",
            data: promise.data.pagination,
          });
        }
      } else {
        console.log("Something went wrong.!");
      }
    });
  }
}

const getClosedregPools = (page) => {
  return (dispatch)=>{
    const response =  services.get(`IGOPools/liveCompleted-list?${page}`)

    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "CLOSEDREG_IGO_POOLS", data: promise.data.data });
          dispatch({
            type: "CLOSEDREG_IGO_PAGINATION",
            data: promise.data.pagination,
          });
        }
      } else {
        console.log("Something went wrong.!");
      }
    });
  }
}
const getUpcomingIGOPools = (page) => {
  return (dispatch) => {
    const response = services.get(`/IGOPools/upcoming-list?page=${page}`);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "UPCOMING_IGO_POOLS", data: promise.data.data });
          dispatch({
            type: "UPCOMING_IGO_PAGINATION",
            data: promise.data.pagination,
          });
        }
      } else {
        console.log("Something went wrong.!");
      }
    });
  };
};
const getFeaturedIGOPools = (page) => {
  return (dispatch) => {
    const response = services.get(`/IGOPools/featured-list?page=${page}`);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "FEATURED_IGO_POOLS", data: promise.data.data });
          dispatch({
            type: "FEATURED_IGO_PAGINATION",
            data: promise?.data.pagination,
          });
        }
      } else {
        console.log("Something went wrong.!");
      }
    });
  };
};
// const getUpcomingIGOPagination = (page) => {
//   return async (dispatch) => {
//     const response = services.get(`/IGOPools/upcoming-list?page=${page}`);
//     response.then(async (promise) => {
//       if (promise.status === 200) {
//         if (promise.data.data) {
//           console.log("promise", promise);
//           dispatch({
//             type: "UPCOMING_IGO_PAGINATION",
//             data: promise.data.pagination,
//           });
//         }
//       } else {
//         console.log("Something went wrong.!");
//       }
//     });
//   };
// };
const getSinglePoolDetail = (id) => {
  return (dispatch) => {
    const response = services.get(`/IGOPools/get-igo/${id}`);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data.data) {
          dispatch({ type: "SINGLE_IGO_POOL", data: promise.data.data });
        }
      } else {
        console.log("Something went wrong.!");
      }
    });
  };
};
const getUserProfileDetail = (address) => {
  return (dispatch) => {
    const response = services.get(`/user/user-info/${address}`);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise.data) {
          dispatch({ type: "FETCHED_USER-DETAIL", data: promise.data.data });
        }
      } else {
        // dispatch({ type: "FETCHED_USER-DETAIL", data: promise.response.data });
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const getUserIGOPools = (address, network, page) => {
  return (dispatch) => {
    const response = services.get(
      `claim/users-pools?walletAddress=${address}&network=${network}&page=${page}`
    );
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise?.data?.data) {
          dispatch({ type: "FETCH_USER_IGO_POOLS", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const editUserProfileDetail = (address, data) => {
  return (dispatch) => {
    const response = services.put(`/user/update/${address}`, data);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        if (promise?.data?.data) {
          dispatch({ type: "EDIT_PROFILE_DETAIL", data: promise.data.data });
        }
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
const applyAsProject = (data) => {
  return (dispatch) => {
    const response = services.post(`/apply-proj/add-project`, data);
    response.then(async (promise) => {
      if (promise?.status === 200) {
        dispatch({ type: "PROJECT_DETAIL", data: promise.data });
      } else {
        // console.log("error");
        //Toast.error("Something went wrong.!");
      }
    });
  };
};
export const authActions = {
  getSinglePoolDetail,
  getCompletedIGOPools,
  getUpcomingIGOPools,
  getFeaturedIGOPools,
  getUserProfileDetail,
  getUserIGOPools,
  editUserProfileDetail,
  applyAsProject,
  getLiveIGOPools,
  getClosedregPools
};
