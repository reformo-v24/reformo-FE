import { services } from "../../services";
let networkId = 97;

function getContractAddresses() {

  if (networkId === "0x61" || +networkId === 97)
    return {
      pancakeLP: "0xA567eF8802461c8a37aa0dAD0615453E6Bf6c1Db",  
      Token: "0x641C37C5BedDc99cE7612f29EaD6dc757Fdc49d2",
      1:"0xFd930ED43633629E931Fa03A217d41fd9FF7d8c7",
      7: "0xdf080b0ED1C7B3EC22bbFB9bD557F841153749D6",
      14: "0x20D3a589F5486b39a4512373F9e65cbc5C541fB6",

      farmingContract: {
        pancakeSwap: {
          contract: "0x436F41e2f06DEB9B7ED14586d0dA0945fE1F4356", 
          lpToken: "0xA567eF8802461c8a37aa42560615E53E6Bf6c1Db", 
        },
        bakerySwap: {
          contract: "0x5b40238E06B2a8bEef5d785412AD329E52902Eb8BB",
          lpToken: "0xc2Eed0F5a0dc28cfa895084b74526B8B8279aE492",
        },
      },
    };
  else if (+networkId === 56 || networkId === "0x38")
    return {
      pancakeLP: "0x74fA517715C4ec65EF045782ad5335f90dce7CC87",
      Token: "0x477bc8d23c634c154061869475412e96be6045d12",
     
      7: "0xb667c499b88AC66899E54e27A14523688d9Fba69",
      14: "0x027fC3A49383D0E7Bd6b81ef6C71236FD7d22a9e",
      30: "0x8900475BF7ed42eFcAcf9AE8CfC214526098f776",

      farmingContract: {
        pancakeSwap: {
          contract: "0x6b23fad324e12a177c7645129150d6be648db6e6",
          lpToken: "0x74fa517715c4ec65ef01d55ad5335f94512ce7cc87",
        },
        bakerySwap: {
          contract: "0x1544be2dC66eaE3E91d983c6D274512CB1CDe74AcF",
          lpToken: "0x782f3f0d2b321D5aB7F15cd1665B4125479Dcfa5",
        },
      },
      oldFarmingContract: {
        pancakeSwap: {
          contract: "0x7439bCF0B97ecd7f3A11c35Cc2301236Eaf04fC0",
          lpToken: "0x74fa517715c4ec65ef01d55ad5475890dce7cc87",
        },
        bakerySwap: {
          contract: "0x1272B728B8964e75786c0f17412563719C0Fa5eAc",
          lpToken: "0x782f3f0d2b321D5aB7F15cd166452125479Dcfa5",
        },
      },
    };
  else
    return {
      pancakeLP: "0x74fA517715C4ec65EF01d55a45125f90dce7CC87",
      Token: "0x477bc8d23c634c15406184521578bce96be6045d12",
      7: "0xb667c499b88AC66899E54e2744440d423d9Fba69",
      14: "0x027fC3A49383D0E7Bd6b81ef452612aFD7d22a9e",
      30: "0x8900475BF7ed42eFcAcf9AE8C7589Aa96098f776",

      farmingContract: {
        pancakeSwap: {
          contract: "0x6b23fad324e12a177c7683041250d6be648db6e6",
          lpToken: "0x74fa517715c4ec65ef01d55a12475f90dce7cc87",
        },
        bakerySwap: {
          contract: "0x1544be2dC66eaE3E91d983c6D25369B1CDe74AcF",
          lpToken: "0x782f3f0d2b321D5aB7F15cd16651458C479Dcfa5",
        },
      },
      oldFarmingContract: {
        pancakeSwap: {
          contract: "0x7439bCF0B97ecd7f3A11c35Cc4256F01Eaf04fC0",
          lpToken: "0x74fa517715c4ec65ef01d55ad54868990dce7cc87",
        },
        bakerySwap: {
          contract: "0x1272B728B8964e75786c0f17720412569C0Fa5eAc",
          lpToken: "0x782f3f0d2b321D5aB7F15cd166545263C479Dcfa5",
        },
      },
    };


}
export default getContractAddresses;
