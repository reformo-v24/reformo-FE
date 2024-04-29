import { render, screen } from "@testing-library/react";
import { mount, shallow } from "enzyme";
// const axios = require("axios");
import axios from "axios";
// import { render, screen, cleanup } from "@testing-library/react";

// import Claimnew from "../pages/claim_page/Claimnew";
// import  callPools from '../pages/claim_page/Claimnew'
// test('test',()=>{
//     render(<Claimnew/>);
//     const claimEle=screen.getAllByTestId();
//     expect(claimEle).toBeInTheDocument();
// })
/*
describe("claimPage  testing", () => {
  it("should match the snapshot ", () => {
    let wrapper = shallow(<Claimnew />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it("class check", () => {
    let wrapper = shallow(<Claimnew />);
    // console.log(wrapper);
    expect(wrapper.exists(".container_cust")).toEqual(true);
  });
  it("call pool method test", () => {
    let wrapper = shallow(<Claimnew />);
    return wrapper
      .instance()
      .callPools()
      .then((data) => {
        console.log(data);
        expect(data).toEqual({ networkName: "binance" });
      });
  });
  it("jest spyOn useEffect ", () => {
    jest.spyOn(Claimnew.prototype, "useEffect");
    shallow(<Claimnew />);
  });
});

import { Claimnew } from "../pages/claim_page/Claimnew";

test("renders with heading element", () => {
  render(<Claimnew />);
  const headingEle = screen.getByText(/Select Network/i);
  expect(headingEle).toBeInTheDocument();
});

test("initial render", () => {
  render(<Claimnew />);
  screen.debug();
  // const headingEle = screen.getByText(/Select Network/i);
  // expect(headingEle).toBeInTheDocument();
}); 
*/

// it("returns the NetworkName", async () => {
//   const title = await callPools(); // Run the function
//   expect(title).toEqual("quidem molestiae enim"); // Make an assertion on the result
// });

// // jest.mock("fetch");
// const callPools = async () => {
//   let url = `https://m22api.minddeft.com/api/v1/claim/list?network='BSC'&isDisabledBit=true&vestingType='monthly'&page=1`;
//   // if (web3Data.isLoggedIn)
//   url = url + `&walletAddress="0x86286a1a5833cB1EFdd2ae5987dde5B79e847Eda"`;
//   fetch(url, {
//     headers: {
//       "api-key":
//         "da3f89789b06fa0c5c3be65e5e18a7fafdda6bcdb51db9fe2b821c634c042405",
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   })
//     .then((response) => response.json())
//     .then(console.log)
//     .catch((err) => Promise.resolve(err));
// };
// describe("claim_page test", () => {
//   test("callpoll test", async () => {
//     return callPools()
//       .then((data) => {
//         expect(data).toEqual({
//           _id: "63777d99c7acf23f36a934ea",
//           vestingInfo: null,
//           endTime: 1668775146,
//           startAmount: null,
//           logo: "https://cdn.sstatic.net/Sites/ethereum/Img/logo.svg?v=eab43e0ed749",
//           vestingType: "monthly",
//           isDisabledBit: false,
//           vestings: [],
//           isSnft: false,
//           description: "This is for testing purpose",
//           tokenAddress: "0x510601cb8db1fd794dce6186078b27a5e2944ad6",
//           contractAddress: "0x8177af9d368bdd0c5b0e37af20157edbc54ec8b4",
//           networkName: "binance",
//           networkSymbol: "BNB",
//           networkId: "0x61",
//           amount: 79800,
//           name: "Monthly Pool test_6",
//           timestamp: 1668775800,
//           phaseNo: 34,
//           dumpId: {
//             _id: "63777d11c7acf23f36a934cc",
//             transactionHash: [
//               "0xdf0cb3aebd0b340d56a0ad02def76de7dbc43beb80592643c5fd84a4527b41ca",
//               "0x068d236ba061742572d4f40a3199ab1cbe7577fb93a5b960c46c165d0958e122",
//               "0x3dc3b1be59835c7d2ccd469653667bebb46e82ce955de7fb0578cfe9d670f690",
//               "0xf509d50c4c8f698ad183a329bf77a7204f2bb5a8fee7a39669afb2702d28939e",
//             ],
//           },
//           createdAt: "2022-11-18T12:42:01.243Z",
//           updatedAt: "2022-11-18T12:42:01.243Z",
//           __v: 0,
//           isInvested: "100",
//         });
//       })
//       .catch(console.error);
//   });
// });

const callPools = async () => {
  let url = `https://m22api.minddeft.com/api/v1/claim/list?network='BSC'&isDisabledBit=true&vestingType='monthly'&page=1`;
  url = url + `&walletAddress="0x86286a1a5833cB1EFdd2ae5987dde5B79e847Eda"`;
  const response = await axios.get(url);
  return response.data[0].networkName;
};

jest.mock("axios");

it("returns the NetworkName", async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        _id: "63777d99c7acf23f36a934ea",
        vestingInfo: null,
        endTime: 1668775146,
        startAmount: null,
        logo: "https://cdn.sstatic.net/Sites/ethereum/Img/logo.svg?v=eab43e0ed749",
        vestingType: "monthly",
        isDisabledBit: false,
        vestings: [],
        isSnft: false,
        description: "This is for testing purpose",
        tokenAddress: "0x510601cb8db1fd794dce6186078b27a5e2944ad6",
        contractAddress: "0x8177af9d368bdd0c5b0e37af20157edbc54ec8b4",
        networkName: "binance",
        networkSymbol: "BNB",
        networkId: "0x61",
        amount: 79800,
        name: "Monthly Pool test_6",
        timestamp: 1668775800,
        phaseNo: 34,
        dumpId: {
          _id: "63777d11c7acf23f36a934cc",
          transactionHash: [
            "0xdf0cb3aebd0b340d56a0ad02def76de7dbc43beb80592643c5fd84a4527b41ca",
            "0x068d236ba061742572d4f40a3199ab1cbe7577fb93a5b960c46c165d0958e122",
            "0x3dc3b1be59835c7d2ccd469653667bebb46e82ce955de7fb0578cfe9d670f690",
            "0xf509d50c4c8f698ad183a329bf77a7204f2bb5a8fee7a39669afb2702d28939e",
          ],
        },
        createdAt: "2022-11-18T12:42:01.243Z",
        updatedAt: "2022-11-18T12:42:01.243Z",
        __v: 0,
        isInvested: "100",
      },
      {
        _id: "637615987537541f06ab3fff",
        vestingInfo: null,
        endTime: null,
        startAmount: null,
        logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        vestingType: "monthly",
        isDisabledBit: false,
        vestings: [],
        isSnft: false,
        description: "Test 2 monthly",
        tokenAddress: "0x510601cb8db1fd794dce6186078b27a5e2944ad6",
        contractAddress: "0x8177af9d368bdd0c5b0e37af20157edbc54ec8b4",
        networkName: "binance",
        networkSymbol: "BNB",
        networkId: "0x61",
        amount: 79800,
        name: "Monthly Pool test2",
        timestamp: 1668740400,
        phaseNo: 11,
        dumpId: {
          _id: "637615417537541f06ab3fe2",
          transactionHash: [
            "0xa1aeb08bb6d193bac13cf319843e7907af400232c7654124b60beacd01696c64",
            "0x0a01799f4f0b2210fae8627e332b7cb74040e3027d22b4d921b2ac358d9ee9c6",
            "0xcde5072c4bd3a1318da2a3692df4d7ae1f7f394d3df6e47d4023008925c97bd0",
            "0x6939e2e3d46ab53b649258ec6de1f6a729ce10aabd6c983e9147b8b44407907f",
          ],
        },
        createdAt: "2022-11-17T11:06:00.859Z",
        updatedAt: "2022-11-17T11:06:00.859Z",
        __v: 0,
        isInvested: "100",
      },
    ],
  });

  const networkName = await callPools();
  expect(networkName).toEqual("binance");
});
