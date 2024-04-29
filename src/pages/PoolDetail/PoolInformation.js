import React from "react";
import "./TokenInformation.css";
import { TimeStampToDateString } from "../../helpers/function";
//Pool information component.
const PoolInformation = ({ singlePoolDetail }) => {
  // var date = new Date(singlePoolDetail?.tokenDistributionDate);
  var date = TimeStampToDateString(singlePoolDetail?.tokenDistributionDate);
  var distribution_date = date.toString().split(" ");
  return (
    <>
      <div className="pool_details">
        <div className="container_cust">
          <div className="inner_pool_details">
            <div className="tble">
              <h2>Pool Information</h2>
              <div className="tble-outer">
                <div className="table">
                  {/* Table for pool information */}
                  <table cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td align="left">
                          <span>Token Distribution</span>
                        </td>
                        <td align="right">
                          {/* {distribution_date[1]} {distribution_date[2]}
                          {singlePoolDetail?.tokenDistributionDate
                            ? "th"
                            : ""}{" "}
                          {distribution_date[3]}
                          {singlePoolDetail?.tokenDistributionDate
                            ? ","
                            : ""}{" "}
                          {distribution_date[4]} UTC */}
                          {date}
                        </td>
                      </tr>
                      <tr>
                        <td align="left">
                          <span>Min. Allocation</span>
                        </td>
                        <td align="right">
                          {singlePoolDetail?.phases[0].minUserAllocation
                            ? singlePoolDetail?.phases[0].minUserAllocation +
                              " " +
                              singlePoolDetail?.paymentTokenSymbol
                            : "TBA"}
                        </td>
                      </tr>

                      <tr>
                        <td align="left">
                          <span>Max. Allocation</span>
                        </td>
                        {/* <td align="right">
                          {singlePoolDetail?.phases[0][
                            singlePoolDetail?.phases[0]
                          ]
                            ? singlePoolDetail?.phases[0][
                                singlePoolDetail?.phases[0]
                              ] +
                              (singlePoolDetail?.contract_type === "BSC"
                                ? " BUSD"
                                : " BNB")
                            : "TBA"}
                        </td> */}
                        <td align="right">
                          {singlePoolDetail?.phases[0].maxUserAllocation
                            ? singlePoolDetail?.phases[0].maxUserAllocation +
                              " " +
                              singlePoolDetail?.paymentTokenSymbol
                            : "TBA"}
                        </td>
                      </tr>

                      <tr>
                        <td align="left">
                          <span>Token Price</span>
                        </td>
                        <td align="right">
                          {singlePoolDetail?.price
                            ? `1 ${singlePoolDetail?.paymentTokenSymbol} = ` +
                              singlePoolDetail?.price +
                              " " +
                              singlePoolDetail?.igoTokenSymbol
                            : "TBA"}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td className="border-left-radius" align="left">
                          <span>Access Type</span>
                        </td>
                        <td className="border-right-radius" align="right">
                          {singlePoolDetail?.accessType}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="tble">
              <h2>Token Information</h2>
              <div className="tble-outer">
                <div className="table">
                  {/* Table for token information */}

                  <table cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td align="left">
                          <span>Name</span>
                        </td>
                        <td align="right">{singlePoolDetail?.igoName}</td>
                      </tr>
                      <tr>
                        <td align="left">
                          <span>Symbol</span>
                        </td>
                        <td align="right">
                          {singlePoolDetail?.igoTokenSymbol}
                        </td>
                      </tr>

                      <tr>
                        <td align="left">
                          <span>Decimals</span>
                        </td>
                        <td align="right">
                          {singlePoolDetail?.igoTokenDecimal}
                        </td>
                      </tr>

                      <tr>
                        <td align="left">
                          <span>Address</span>
                        </td>
                        <td className="address_break" align="right">
                          {singlePoolDetail?.igoTokenAddress}
                        </td>
                      </tr>

                      <tr>
                        <td className="border-left-radius" align="left">
                          <span>Total Supply</span>
                        </td>
                        <td className="border-right-radius" align="right">
                          {singlePoolDetail?.phases[0].igoTokenSupply}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoolInformation;
