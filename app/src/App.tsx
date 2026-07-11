import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import MainPage from "./pages/MainPage";
import '@solana/wallet-adapter-react-ui/styles.css';
import "./index.css";

export default function App() {
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MainPage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )  
}

