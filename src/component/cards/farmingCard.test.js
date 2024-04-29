import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Web3 from "web3";
import getContractAddresses from "../../contractData/contractAddress/addresses";
import tokenAbi from "../../contractData/abis/token.json";
import feStakingABI from "../../contractData/abis/feStaking.json";
import farmingABI from "../../contractData/abis/farming.json";
import lpTokenABI from "../../contractData/abis/lpToken.json";
import pancakeLPABI from "../../contractData/abis/pancakeLP.json";
import { useState } from "react";
let web3 = new Web3(
  new Web3.providers.HttpProvider("https://bsc-testnet.public.blastapi.io")
);
let web3Data = {
  isLoggedIn: false,
  accounts: ["0xB4625f5Bfc73d97DbD5928394577f878AafAA6eD"],
};
const swaps = [
  {
    name: "Pancake Swap",
    id: "pancakeSwap",
    token: "Cake-LP",
    viewPool:
      "https://pancakeswap.finance/add/BNB/0x477bC8d23c634C154061869478bce96BE6045D12",
  },
  {
    name: "Bakery Swap",
    id: "bakerySwap",
    token: "BLP",
    viewPool:
      "https://www.bakeryswap.org/#/add/ETH/0x477bC8d23c634C154061869478bce96BE6045D12",
  },
];
afterEach(cleanup);
async function getContractInstance(contract, swapSelect, isV1 = false) {
  const addresses = getContractAddresses();
  let currentaddress = addresses[contract];
  let currentABI = contract === "Token" ? tokenAbi : feStakingABI;
  // let currentABI = farmingABI;
  if (contract === "farming") {
    currentaddress = isV1
      ? addresses.oldFarmingContract[swapSelect].contract
      : addresses.farmingContract[swapSelect].contract;
    currentABI = farmingABI;
  }
  if (contract === "lpToken") {
    currentABI = lpTokenABI;
    currentaddress = isV1
      ? addresses.oldFarmingContract[swapSelect].lpToken
      : addresses.farmingContract[swapSelect].lpToken;
  }
  if (contract === "pancakeLP") {
    currentABI = pancakeLPABI;
    currentaddress = addresses.pancakeLP;
  }

  try {
    if (web3) {
      const contractInstance = new web3.eth.Contract(
        currentABI,
        web3.utils.toChecksumAddress(currentaddress)
      );
      // console.log("contractInstance: ", contractInstance);
      return contractInstance;
    }
  } catch (error) {
    // console.log(error);
  }
}

describe("Farming Module Test", function () {
  test("Farming Module APY", async function () {
    let obj = {};
    const farmingContractInstance = await getContractInstance(
      "farming",
      swaps[0].id,
      false
    );
    obj.stakedBalance = +web3.utils.fromWei(
      await farmingContractInstance.methods.stakedBalance().call()
    );
    obj.rewardPerBlock =
      +web3.utils.fromWei(
        await farmingContractInstance.methods.rewPerBlock().call()
      ) * 20;
    obj.accShare = await farmingContractInstance.methods.accShare().call();
    obj.currentBlock = await farmingContractInstance.methods
      .currentBlock()
      .call();
    obj.startingBlock = await farmingContractInstance.methods
      .startingBlock()
      .call();
    const amountCalc = async (amt, isApy) => {
      if (isApy) return calc(365);
      async function calc(noOfDays) {
        let rewards =
          (await noOfDays) *
          28800 *
          web3.utils.toWei((obj.rewardPerBlock / 20).toString());

        let newStakebalance = (await +obj.stakedBalance)
          ? +web3.utils.toWei((obj.stakedBalance + +amt).toString())
          : 100;

        let newAccShare =
          (await +obj.accShare) + (rewards * 1e6) / newStakebalance;

        let rewDebt = (await (+amt * 10 ** 18 * obj.accShare)) / 1e6;

        let rew =
          (await ((+amt * 10 ** 18 * newAccShare) / 1e6 - rewDebt)) / 10 ** 18;

        return rew.toFixed(4);
      }
    };
    const pancakeLPContractInstance = await getContractInstance(
      "lpToken",
      swaps[0].id,
      false
    );
    const reserves = await pancakeLPContractInstance.methods
      .getReserves()
      .call();
    const totalSupply = +web3.utils.fromWei(
      await pancakeLPContractInstance.methods.totalSupply().call()
    );
    obj.rewardDistributed =
      (await ((obj.currentBlock - obj.startingBlock) * obj.rewardPerBlock)) /
      20;
    obj.rewardDistributed =
      (await obj.rewardDistributed) >= obj.totalReward
        ? obj.totalReward
        : obj.rewardDistributed;
    obj.totalReward = +web3.utils.fromWei(
      await farmingContractInstance.methods.totalReward().call()
    );
    const sfundperlp = +web3.utils.fromWei(reserves[0]) / totalSupply;
    const isZeroLeft = await (obj.rewardDistributed >= obj.totalReward);
    let amount = await amountCalc(1, true);
    const APY = isZeroLeft ? 0 : (amount / (sfundperlp * 2)) * 100;
    expect(APY).not.toBeUndefined();
    // expect(APY).not.toBe("-");
  }, 60_000);
});
