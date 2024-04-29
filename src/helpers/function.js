import getContractAddresses from "../contractData/contractAddress/addresses";
import { web3 } from "../web3";
import { networkProviders } from "./metamask";
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function TimeStampToDateString(val) {
  const dateString = new Date(Number(val) * 1000);
  var year = dateString.getFullYear();
  // month as 2 digits (MM)
  var month = dateString.getMonth();
  // date as 2 digits (DD)
  var date = ("0" + dateString.getUTCDate()).slice(-2);
  var hrs = ("0" + dateString.getUTCHours()).slice(-2);
  var min = ("0" + dateString.getUTCMinutes()).slice(-2);
  var sec = ("0" + dateString.getUTCSeconds()).slice(-2);
  let d = `${year}-${months[month]}-${date} ${hrs}:${min} UTC`;
  return d;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function compactAdd(address) {
  const newAddress = address;
  if (address) {
    const res =
      newAddress.substring(0, 4) +
      "..." +
      newAddress.substring(newAddress.length - 4, newAddress.length);
    return res;
  }
}

export function getContract(
  network,
  currentchain,
  contractAddress,
  contractType
) {
  let currentABI =
    contractType === "token";
  let currentProvoider = currentchain ? web3 : networkProviders[network];
  try {
    if (web3) {
      const contractInstance = new currentProvoider.eth.Contract(
        currentABI,
        contractAddress
      );

      return contractInstance;
    }
  } catch (error) {
    console.log(error);
  }
}


const call = (claimToken) => {
  return web3.utils.soliditySha3(
    { type: "address", value: claimToken.walletAddress },
    { type: "uint256", value: claimToken.eTokens }
  );
};

let existingCsv = null;
export const getHexProofs = (id, walletAddress, vestingId) => {
  return new Promise((resolve, reject) => {
    let url2 = `http://localhost:5000/api/v1/claim/`;
    fetch(url2)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.data.vestings);
      })
      .catch(() => reject(false));
  });
};
export const getCSV = (id, walletAddress) => {
  return new Promise((resolve, reject) => {
    if (existingCsv && id === existingCsv?.data._id) {
      resolve(existingCsv.data.dumpId.uploadData);
    } else {
      let url1 = `http://localhost:5000/api/v1/claim/single/${id}?csvData=true`;
      fetch(url1)
        .then((response) => response.json())
        .then((data) => {
          existingCsv = data;
          resolve(data.data.dumpId.uploadData);
        })
        .catch(() => reject(false));
    }
  });
};
