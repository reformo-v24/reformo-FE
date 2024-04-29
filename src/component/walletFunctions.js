import { getContractInstance } from "../helpers/function";
import { networkProviders } from "../helpers/metamask";
import { web3 } from "../web3";
// import { SolanaVestingV3 } from "./solanaSdk/src/solana-vesting-v3.class";
// import { SolanaVestingV3 } from "./solanaSdk/src/solana-vesting-v3.class";
import vestingUsers from "../vestingUsers.json";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { checkWhitelist } from "./solanaSdk/src/utils";
// import plutonionsCSV from "../plutonians.json";
import solanaPublicCSV from "../newpld.json";

export async function dataFunctions(chain, pools, web3Data, merkeUsers) {
  switch (chain) {
    case "ETH":
    case "BNB":
    case "MATIC": {
      const _userTokensClaimArr = await Promise.all(
        pools?.map(async (pool) => {
          let vestings = null;
          const tokenContractInstance = getContractInstance(
            pool.networkName,
            false,
            pool.tokenAddress,
            "token"
          );
          let decimals;
          decimals = await tokenContractInstance.methods.decimals?.().call();

          const contractInstance = getContractInstance(
            pool.networkName,
            false,
            pool.contractAddress,
            pool.vestingType
          );

          ///////////////////merkle//////////////////////////////////////////////////////////////

          /////////////////////merkle-end//////////////////////////////////////////////////////

          let fxn = "getUserPhaseTokenClaim";
          let fxn1 = "hasClaimed";
          let params = [pool.tokenAddress, pool.phaseNo, web3Data.accounts[0]];
          let claimable;

          if (pool.vestingType === "linear") {
            fxn = "userVesting";
            params = [web3Data.accounts[0]];
            try {
              claimable = await contractInstance.methods
                .getClaimableAmount(web3Data.accounts[0])
                .call({
                  from: web3Data.accounts[0],
                });
              claimable =
                decimals == 18
                  ? web3.utils.fromWei(claimable)
                  : +claimable / 10 ** +decimals;
            } catch {
              claimable = 0;
            }
          }
          if (pool.vestingType === "merkle") {
            let totaltokens = pool.isInvested;

            vestings = await Promise.all(
              pool.vestings.map(async (vest, key) => {
                try {
                  let vestTokens, userStatus;
                  if (!totaltokens)
                    return {
                      vestTokens: 0,
                      userStatus: "notInvested",
                      percentage: vest.vestingPercent,
                      startTime: vest.timestamp,
                      rootHash: vest.rootHash,
                      vestingId: vest._id,
                    };
                  if (vest.status === "uploaded") {
                    params = [web3Data.accounts[0], key];

                    vestTokens = (
                      (+totaltokens * +vest.vestingPercent) /
                      100
                    ).toFixed(6);
                    let hasClaimed = await contractInstance.methods[fxn1](
                      ...params
                    ).call({
                      from: web3Data.accounts[0],
                    });
                    userStatus = +totaltokens
                      ? +vest.timestamp < new Date().getTime() / 1000
                        ? hasClaimed
                          ? "claimed"
                          : "notClaimed"
                        : "upcoming"
                      : "notInvested";
                  } else {
                    vestTokens = (
                      (+pool.isInvested * vest.vestingPercent) /
                      100
                    ).toFixed(6);
                    userStatus = +pool.isInvested ? "upcoming" : "notInvested";
                  }
                  return {
                    vestTokens: vestTokens,
                    userStatus: userStatus,
                    percentage: vest.vestingPercent,
                    startTime: vest.timestamp,
                    rootHash: vest.rootHash,
                    vestingId: vest._id,
                  };
                } catch (err) {
                  console.log(err);
                }
              })
            );

            return {
              val: totaltokens,
              vestings: vestings,
              totaltokens: totaltokens,
              isVesting: true,
            };
          } else {
            let v2 = await contractInstance.methods[fxn](...params).call({
              from: web3Data.accounts[0],
            });
            //   v2 = decimals == 18 ? web3.utils.fromWei(v2) : +v2 / 10 ** +decimals;
            // let  userStatus = pool.isInvested ?  !+v2 ? "claimed" : "notClaimed":"notInvested";

            if (pool.vestingType == "linear") {
              const claimed =
                +v2.totalAmount && +v2.claimed === +v2.totalAmount;
              const totalAmount =
                decimals == 18
                  ? web3.utils.fromWei(v2.totalAmount)
                  : +v2.totalAmount / 10 ** +decimals;
              const claimedAmount =
                decimals == 18
                  ? web3.utils.fromWei(v2.claimed)
                  : +v2.claimed / 10 ** +decimals;
              const rVal = totalAmount - claimedAmount;

              return {
                claimable: +claimable,
                val: rVal,
                claimed: claimed,
                totalAmount: +totalAmount,
                claimedAmount: +claimedAmount,
              };
            } else {
              const final =
                decimals == 18 ? web3.utils.fromWei(v2) : +v2 / 10 ** +decimals;
              const claimed = pool.isInvested && !+final ? true : false;
              return { val: final, claimed: claimed };
            }
          }
        })
      );
      return { _userTokensClaimArr: _userTokensClaimArr };

      // case "SOL":
      //   // const whitelist = vestingUsers;
      //   const connection = new Connection(
      //     "https://solana-api.projectserum.com",
      //     // "https://api.mainnet-beta.solana.com",
      //     "finalized"
      //   );

      //   // const programID = "DmZtFoY6X1n7w6fBqgo6A32NYVNuUNzYKAMF6iAWsqCu";
      //   // const vestingInfo = "8xZfLqvsBPodn582waZ4tsdtJkR2Nrv1SHRtmBCqSFdR";
      //   // const mintOriginal = "5nJDM5SuwgVytqEcgRn5E3qZjDAf19cfW2epFqhe8MBG";
      //   // const vesting = new SolanaVestingV3(
      //   //   connection,
      //   //   programID,
      //   //   vestingInfo,
      //   //   mintOriginal,
      //   //   1e9,
      //   //   whitelist
      //   // );

      //   // await vesting.init();
      //   // const vestingInfos = await vesting.getVestingInfoDataParsed();
      //   // const vestingBalance = await vesting.getVestingBalance(
      //   //   "3rp6ZnwV9YhU4a4riTxASnjxzR5P24rYdg2zo7Mw3peG"
      //   // );
      //   // return {
      //   //   solanaVesting: vesting,
      //   //   claimable: +vestingBalance.unlocked,
      //   //   val: vestingBalance.collateralized,
      //   //   claimed:
      //   //     vestingBalance.claimedWithProof - vestingBalance.collateralized,
      //   //   totalAmount: +vestingBalance.claimedWithProof,
      //   //   claimedAmount:
      //   //     +vestingBalance.claimedWithProof - vestingBalance.collateralized,
      //   // };
      //   const _userTokensClaimArrSol = await Promise.all(
      //     pools.map(async (pool, key) => {
      //       const programID = pool.contractAddress;
      //       const vestingInfo = pool.vestingInfo;
      //       const mintOriginal = pool.tokenAddress;
      //       // const programID = "FiE7jBM4JhEsLthq8vZMK4VC7pdF9YUxsH2M5oW2ymko";
      //       // const vestingInfo = "6br1Nrhfk8u8KywfVm3bxVvbEJvzr3vTV7T3e6azVsS4";
      //       // const mintOriginal = "2cJgFtnqjaoiu9fKVX3fny4Z4pRzuaqfJ3PBTMk2D9ur";
      //       let whitelist = merkeUsers[key] ? merkeUsers[key] : vestingUsers;
      //       // let whitelist = solanaPublicCSV;

      //       const vesting = new SolanaVestingV3(
      //         connection,
      //         programID,
      //         vestingInfo,
      //         mintOriginal,
      //         1e6,
      //         whitelist
      //       );
      //       await vesting.init();

      //       // const vestingInfos = await vesting.getVestingInfoDataParsed();
      //       try {
      //         const vestingBalance = await vesting.getVestingBalance(
      //           web3Data.accounts[0]
      //         );
      //         // const vestingBalance = 0;
      //         if (!vestingBalance) {
      //           const canAirdrop = await vesting.getAllowedToAirdropAmount(
      //             web3Data.accounts[0]
      //           );
      //           // const canAirdrop = "34";
      //           return {
      //             solanaVesting: vesting,
      //             claimable: 0,
      //             val: canAirdrop,
      //             claimed: false,
      //             totalAmount: canAirdrop,
      //             claimedAmount: 0,
      //             unLock: true,
      //           };
      //         }

      //         return {
      //           solanaVesting: vesting,
      //           claimable: +vestingBalance.unlocked,
      //           val: vestingBalance.collateralized,
      //           claimed: +vestingBalance.collateralized === 0,
      //           totalAmount: +vestingBalance.claimedWithProof,
      //           claimedAmount:
      //             +vestingBalance.claimedWithProof -
      //             vestingBalance.collateralized,
      //         };
      //       } catch (err) {
      //         console.log("this one", err);
      //       }
      //     })
      //   );
      //   return { _userTokensClaimArr: _userTokensClaimArrSol };
      //   break;
    }
    default:
  }
}

// export async function transactionFunction(web3Data) {
//   const NETWORK = clusterApiUrl('mainnet-beta');
//   const connection = new Connection(NETWORK);
//   // const createTransferTransaction = async () => {
//   //   if (!provider.publicKey) {
//   //     return;
//   //   }

//   // const message = `Owner of punk #8888`;
//   // const encodedMessage = new TextEncoder().encode(message);
//   // const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");

//   // const message = `Owner of punk #8888`;
//   // const encodedMessage = new TextEncoder().encode(message);
//   // try {
//   //   const data1 = await window.solana.signMessage(encodedMessage, "utf8");
//   // } catch (err) {
//   //   console.warn(err);
//   //   // addLog("Error: " + JSON.stringify(err));
//   // }
//   // addLog("Message signed");
//   /////////////////////////////////////////////////////////////////////////
//   // const transaction = await createTransferTransaction(web3Data);
//   // if (transaction) {
//   //   try {
//   //     let signed = await window.solana.signTransaction(transaction);
//   //     // addLog("Got signature, submitting transaction");
//   //     let signature = await connection.sendRawTransaction(signed.serialize());
//   //     // addLog(
//   //     //   "Submitted transaction " + signature + ", awaiting confirmation"
//   //     // );
//   //     await connection.confirmTransaction(signature);
//   //     // addLog("Transaction " + signature + " confirmed");
//   //   } catch (err) {
//   //     console.warn(err);
//   //     // addLog("Error: " + JSON.stringify(err));
//   // }
//   // }

//   /////////////////////////////////////////////////////////////////////////
//   // let transaction = new Transaction().add(
//   //   SystemProgram.transfer({
//   //     fromPubkey: web3Data.accounts[0],
//   //     toPubkey: web3Data.accounts[0],
//   //     lamports: 100,
//   //   })
//   // );
//   // transaction.feePayer = web3Data.accounts[0];
//   // // addLog("Getting recent blockhash");
//   // const anyTransaction = transaction;
//   // anyTransaction.recentBlockhash = (
//   //   await connection.getRecentBlockhash()
//   // ).blockhash;
//   // return transaction;
//   // };
// }

// // const sendTransaction = async () => {
// //   const transaction = await createTransferTransaction();
// //   if (transaction) {
// //     try {
// //       let signed = await .signTransaction(transaction);
// //       // addLog("Got signature, submitting transaction");
// //       let signature = await connection.sendRawTransaction(signed.serialize());
// //       // addLog(
// //       //   "Submitted transaction " + signature + ", awaiting confirmation"
// //       // );
// //       await connection.confirmTransaction(signature);
// //       // addLog("Transaction " + signature + " confirmed");
// //     } catch (err) {
// //       console.warn(err);
// //       // addLog("Error: " + JSON.stringify(err));
// //     }
// //   }
// // };

// // const createTransferTransaction = async (web3Data) => {
// //   // if (!provider.publicKey) {
// //   //   return;
// //   // }
// //   const NETWORK = clusterApiUrl('mainnet-beta');
// //   const connection = new Connection(NETWORK);
// //   let transaction = new Transaction().add(
// //     SystemProgram.transfer({
// //       fromPubkey: web3Data.accounts[0],
// //       toPubkey: web3Data.accounts[0],
// //       lamports: 100,
// //     })
// //   );
// //   transaction.feePayer = web3Data.accounts[0];
// //   // addLog("Getting recent blockhash");
// //   const anyTransaction = transaction;
// //   anyTransaction.recentBlockhash = (
// //     await connection.getRecentBlockhash()
// //   ).blockhash;
// //   return transaction;
// // };

// // export const runThis = () => {
// (async () => {
//   // Connect to cluster
//   const connection = new web3Sol.Connection(
//     web3Sol.clusterApiUrl('devnet'),
//     'confirmed'
//   );

//   // Generate a new wallet keypair and airdrop SOL
//   var fromWallet = web3Sol.Keypair.generate();
//   var fromAirdropSignature = await connection.requestAirdrop(
//     fromWallet.publicKey,
//     web3Sol.LAMPORTS_PER_SOL
//   );
//   // Wait for airdrop confirmation
//   await connection.confirmTransaction(fromAirdropSignature);

//   // Generate a new wallet to receive newly minted token
//   const toWallet = web3Sol.Keypair.generate();

//   // Create new token mint
//   const mint = await splToken.Token.createMint(
//     connection,
//     fromWallet,
//     fromWallet.publicKey,
//     null,
//     9,
//     splToken.TOKEN_PROGRAM_ID
//   );

//   // Get the token account of the fromWallet Solana address, if it does not exist, create it
//   const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
//     fromWallet.publicKey
//   );

//   //get the token account of the toWallet Solana address, if it does not exist, create it
//   const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
//     toWallet.publicKey
//   );

//   // Minting 1 new token to the "fromTokenAccount" account we just returned/created
//   await mint.mintTo(
//     fromTokenAccount.address,
//     fromWallet.publicKey,
//     [],
//     1000000000
//   );

//   // Add token transfer instructions to transaction
//   const transaction = new web3Sol.Transaction().add(
//     splToken.Token.createTransferInstruction(
//       splToken.TOKEN_PROGRAM_ID,
//       fromTokenAccount.address,
//       toTokenAccount.address,
//       fromWallet.publicKey,
//       [],
//       1
//     )
//   );

//   // Sign transaction, broadcast, and confirm
//   const signature = await web3Sol.sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [fromWallet],
//     { commitment: 'confirmed' }
//   );
// })();
// // };

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // const getProvider = () => {
// //   if ('solana' in window) {
// //     const anyWindow = window;
// //     const provider = anyWindow.solana;
// //     if (provider.isPhantom) {
// //       return provider;
// //     }
// //   }
// //   window.open('https://phantom.app/', '_blank');
// // };
// // const provider = getProvider();
// const NETWORK = clusterApiUrl('devnet');
// const connection = new Connection(NETWORK);

// // const createTransferTransaction = async () => {
// //   if (!web3.publicKey) {
// //     return;
// //   }
// //   let transaction = new Transaction().add(
// //     SystemProgram.transfer({
// //       fromPubkey: web3.publicKey,
// //       toPubkey: web3.publicKey,
// //       lamports: 100,
// //     })
// //   );
// //   transaction.feePayer = web3.publicKey;
// //   // addLog('Getting recent blockhash');

// //   const anyTransaction = transaction;
// //   anyTransaction.recentBlockhash = (
// //     await connection.getRecentBlockhash()
// //   ).blockhash;
// //   return transaction;
// // };

// // export const sendTransaction = async () => {
// //   const transaction = await createTransferTransaction();
// //   if (transaction) {
// //     try {
// //       let signed = await web3.signTransaction(transaction);
// //       // addLog('Got signature, submitting transaction');
// //       let signature = await connection.sendRawTransaction(signed.serialize());
// //       // addLog('Submitted transaction ' + signature + ', awaiting confirmation');
// //       await connection.confirmTransaction(signature);
// //       // addLog('Transaction ' + signature + ' confirmed');
// //     } catch (err) {
// //       console.warn(err);
// //       // addLog('Error: ' + JSON.stringify(err));
// //     }
// //   }
// // };

// const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
//   'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
// );

// export async function findAssociatedTokenAddress(
//   walletAddress,
//   tokenMintAddress
// ) {
//   return (
//     await PublicKey.findProgramAddress(
//       [
//         walletAddress.toBuffer(),
//         TOKEN_PROGRAM_ID.toBuffer(),
//         tokenMintAddress.toBuffer(),
//       ],
//       SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
//     )
//   )[0];
// }

// export async function getAssociatedTokenProgram(
//   walletAddress,
//   tokenMintAddress
// ) {
//   const associatedAddress =
//     await splToken.Token.getOrCreateAssociatedAccountInfo(
//       new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'), // associatedProgramId
//       new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // programId
//       new PublicKey('GyDxDg7YHUmamgnkKdTV38Yhsr45yHc9H28A2pydcn2H'), // publicKey
//       new PublicKey('D79cZ9JUWsrYD3NKtNWFkwLdfUd1wqpR3quDGG9r6Eoi') // owner
//     );
// }

// export async function createAccosiatedaccount(walletAddress) {
//   const NETWORK = clusterApiUrl('testnet');
//   const connection = new Connection(NETWORK);
//   const owneraddress = await Keypair.generate();
//   const mintPublicKey = new PublicKey(
//     'GyDxDg7YHUmamgnkKdTV38Yhsr45yHc9H28A2pydcn2H'
//   );
//   const mintToken = new splToken.Token(
//     connection,
//     mintPublicKey,
//     TOKEN_PROGRAM_ID,
//     new PublicKey(walletAddress) // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
//   );

//   const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
//     new PublicKey(walletAddress)
//   );
// }

// /////////////////////

// // const createTransferTransaction = async () => {
// //   if (!web3.publicKey) {
// //     return;
// //   }
// //   let transaction = new Transaction().add(
// //     SystemProgram.transfer({
// //       fromPubkey: web3.publicKey,
// //       toPubkey: web3.publicKey,
// //       lamports: 100,
// //     })
// //   );
// //   transaction.feePayer = web3.publicKey;
// //   // addLog('Getting recent blockhash');

// //   const anyTransaction = transaction;
// //   anyTransaction.recentBlockhash = (
// //     await connection.getRecentBlockhash()
// //   ).blockhash;
// //   return transaction;
// // };

// // export const sendTransaction = async () => {
// //   const transaction = await createTransferTransaction();
// //   if (transaction) {
// //     try {
// //       let signed = await web3.signTransaction(transaction);
// //       // addLog('Got signature, submitting transaction');
// //       let signature = await connection.sendRawTransaction(signed.serialize());
// //       // addLog('Submitted transaction ' + signature + ', awaiting confirmation');
// //       await connection.confirmTransaction(signature);
// //       // addLog('Transaction ' + signature + ' confirmed');
// //     } catch (err) {
// //       console.warn(err);
// //       // addLog('Error: ' + JSON.stringify(err));
// //     }
// //   }
// // };

// export function testFunction() {
//   // Address: 9vpsmXhZYMpvhCKiVoX5U8b1iKpfwJaFpPEEXF7hRm9N
//   const DEMO_WALLET_SECRET_KEY = new Uint8Array([
//     37, 21, 197, 185, 105, 201, 212, 148, 164, 108, 251, 159, 174, 252, 43, 246,
//     225, 156, 38, 203, 99, 42, 244, 73, 252, 143, 34, 239, 15, 222, 217, 91,
//     132, 167, 105, 60, 17, 211, 120, 243, 197, 99, 113, 34, 76, 127, 190, 18,
//     91, 246, 121, 93, 189, 55, 165, 129, 196, 104, 25, 157, 209, 168, 165, 149,
//   ]);
//   (async () => {
//     // Connect to cluster
//     var connection = new web3.Connection(web3.clusterApiUrl('testnet'));
//     // Construct wallet keypairs
//     var fromWallet = web3.Keypair.fromSecretKey(DEMO_WALLET_SECRET_KEY);
//     var toWallet = web3.Keypair.generate();
//     const mintPublicKey = new PublicKey(
//       'GyDxDg7YHUmamgnkKdTV38Yhsr45yHc9H28A2pydcn2H'
//     );
//     // Construct my token class
//     var myMint = new PublicKey('GyDxDg7YHUmamgnkKdTV38Yhsr45yHc9H28A2pydcn2H');
//     var myToken = new splToken.Token(
//       connection,
//       myMint,
//       splToken.TOKEN_PROGRAM_ID,
//       fromWallet
//     );
//     // Create associated token accounts for my token if they don't exist yet
//     var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
//       fromWallet.publicKey
//     );

//     var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
//       new PublicKey('DRUSqRpZJJdpT8aeczdwX2SAAJ92yuwWfvmq1ofxDfB7')
//     );
//     // Add token transfer instructions to transaction
//     var transaction = new web3.Transaction().add(
//       splToken.Token.createTransferInstruction(
//         splToken.TOKEN_PROGRAM_ID,
//         fromTokenAccount.address,
//         toTokenAccount.address,
//         fromWallet.publicKey,
//         [],
//         0
//       )
//     );
//     // Sign transaction, broadcast, and confirm
//     var signature = await web3.sendAndConfirmTransaction(
//       connection,
//       transaction,
//       [fromWallet]
//     );
//   })();
// }
