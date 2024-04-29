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
  accounts: ["0xf2d56b2e6b6fD8Ec87193ad1C7ce30d8Ef0b0cF7"],
};
afterEach(cleanup);
async function getContractInstance(contract, swapSelect, isV1) {
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
describe("StakingCard module test", () => {
  test("7 day APY", async () => {
    const activeContract = 7;
    const stakingContractInstance = await getContractInstance(activeContract);
    const calRate = await stakingContractInstance.methods.rate().call();
    const rate = (+calRate * 365) / activeContract;
    expect((rate / 100).toFixed()).toBe("5");
  });
  test("14 day APY", async () => {
    const activeContract = 14;
    const stakingContractInstance = await getContractInstance(activeContract);
    const calRate = await stakingContractInstance.methods.rate().call();
    const rate = (+calRate * 365) / activeContract;
    expect((rate / 100).toFixed()).toBe("11");
  });
  test("30 day APY", async () => {
    const activeContract = 30;
    const stakingContractInstance = await getContractInstance(activeContract);
    const calRate = await stakingContractInstance.methods.rate().call();
    const rate = (+calRate * 365) / activeContract;
    expect((rate / 100).toFixed()).toBe("25");
  });
  test("7 days Approve or Balance check", async () => {
    const activeContract = 7;
    const tokenContractInstance = await getContractInstance("Token");
    const allowanceAddress = await getContractAddresses();
    const allowance = Number(
      web3.utils.fromWei(
        await tokenContractInstance.methods
          .allowance(web3Data.accounts[0], allowanceAddress[activeContract])
          .call()
      )
    );
    let balance = web3.utils.fromWei(
      await tokenContractInstance.methods
        .balanceOf(web3Data.accounts[0])
        .call(),
      "ether"
    );
    expect(+balance).toBeGreaterThanOrEqual(0);
    expect(+allowance).toBeGreaterThanOrEqual(0);
  });
  test("14 days Approve or Balance check", async () => {
    const activeContract = 14;
    const tokenContractInstance = await getContractInstance("Token");
    const allowanceAddress = await getContractAddresses();
    const allowance = Number(
      web3.utils.fromWei(
        await tokenContractInstance.methods
          .allowance(web3Data.accounts[0], allowanceAddress[activeContract])
          .call()
      )
    );
    let balance = web3.utils.fromWei(
      await tokenContractInstance.methods
        .balanceOf(web3Data.accounts[0])
        .call(),
      "ether"
    );
    expect(+balance).toBeGreaterThanOrEqual(0);
    expect(+allowance).toBeGreaterThanOrEqual(0);
  });
  test("30 days Approve or Balance check", async () => {
    const activeContract = 30;
    const tokenContractInstance = await getContractInstance("Token");
    const allowanceAddress = await getContractAddresses();
    const allowance = Number(
      web3.utils.fromWei(
        await tokenContractInstance.methods
          .allowance(web3Data.accounts[0], allowanceAddress[activeContract])
          .call()
      )
    );
    let balance = web3.utils.fromWei(
      await tokenContractInstance.methods
        .balanceOf(web3Data.accounts[0])
        .call(),
      "ether"
    );
    expect(+balance).toBeGreaterThanOrEqual(0);
    expect(+allowance).toBeGreaterThanOrEqual(0);
  });
});
