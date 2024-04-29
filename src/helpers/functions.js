import getContractAddresses from "../contractData/contractAddress/addresses";
import Web3 from "web3";
import {web3} from "../web3"
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
  let d = `${date} ${months[month]} ${year} ${hrs}:${min}`;
  return d;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function compactAddress(address) {
  const newAddress = address;
  if (address) {
    const res =
      newAddress.substring(0, 4) +
      "..." +
      newAddress.substring(newAddress.length - 4, newAddress.length);
    return res;
  }
}

export async function getContract(contract, swapSelect, isV1) {
  const addresses = getContractAdd();
  let currentaddress = addresses[contract];
  let currentABI = contract === "Token";
  // let currentABI = farmingABI;
  if (contract === "farming") {
    currentaddress = isV1
      ? addresses.oldFarmingContract[swapSelect].contract
      : addresses.farmingContract[swapSelect].contract;
  }
  if (contract === "lpToken") {
    currentaddress = isV1
      ? addresses.oldFarmingContract[swapSelect].lpToken
      : addresses.farmingContract[swapSelect].lpToken;
  }
  if (contract === "pancakeLP") {
    currentaddress = addresses.pancakeLP;
  }

  try {
    let web3Instance;
    if (web3) {
      web3Instance = web3;
    } else {
      const primaryProvider = new Web3.providers.HttpProvider("https://bsc-testnet-rpc.publicnode.com");
      web3Instance = new Web3(primaryProvider);
    }
    const contractInstance = new web3Instance.eth.Contract(
      currentABI,
      web3Instance.utils.toChecksumAddress(currentaddress)
    );
    return contractInstance;
  } catch (error) {
    console.error("Error occurred while connecting to node:", error);
  }
  
}
 