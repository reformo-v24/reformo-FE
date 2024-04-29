import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Onboard from "@web3-onboard/core";
import { chains, wallets,appMetadata } from './helpers/web3Config'

import { Buffer } from 'buffer';
global.Buffer = Buffer;
const onboard = Onboard({
  wallets: wallets,
  chains: chains,
  theme: "dark",
  appMetadata: appMetadata,
  connect: {
    autoConnectLastWallet: true,
  }
});

const Web3Onboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const handleConnectWallet = async () => {
    try {
      let _provider = await onboard.connectWallet();
      if (_provider.length > 0) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const [primaryWallet] = onboard.state.get().wallets;
      await onboard.disconnectWallet({ label: primaryWallet.label });
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <Button onClick={handleDisconnectWallet}>Disconnect Wallet</Button>
      ) : (
        <Button onClick={handleConnectWallet}>Connect Wallet</Button>
      )}
    </div>
  );
};

export { onboard };
export default Web3Onboard;
const Button = styled.button`
  min-width: 180px;
  text-align: center;
  background: var(--primary);
  border-radius: 5px;
  padding: 14px 0;
  box-shadow: 0 0 0 rgba(245, 204, 39, 0.53);
  &:hover {
    box-shadow: 0 0 20px rgba(245, 204, 39, 0.53);
  }
  @media (max-width: 767px) {
    min-width: inherit;
    padding: 10px 10px;
  }
  @media (max-width: 640px) {
    a {
      display: block !important;
    }
  }
`;
