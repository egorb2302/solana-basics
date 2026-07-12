import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getBalance, getAddress } from "../../utils/walletActions";
import styles from "../solanaStyles";

export default function WalletModal() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("-");
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const refreshWalletInfo = async () => {
    if (!connected || !publicKey) {
      setBalance(null);
      setAddress("-");
      return;
    }
    setInfoLoading(true);
    try {
      const [bal, addr] = await Promise.all([
        getBalance(publicKey, connected, connection),
        getAddress(publicKey, connected),
      ]);
      setBalance(typeof bal === "number" ? bal : null);
      setAddress(addr);
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshWalletInfo().catch((err) => {
      if (!cancelled) console.error("refreshWalletInfo failed:", err);
    })

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, connection]);

  const handleCopyAddress = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const getSupply = async () => {
    if (!publicKey) return;

    try {
      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Airdrop successful");
      await refreshWalletInfo();
    } catch (error) {
      console.error("Airdrop failed, try again or use faucet.solana.com, Error: ", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.gradientBorder}>
        <div className={styles.card}>
          <header className="space-y-1">
            <p className={styles.eyebrow}>Solana · Devnet</p>
            <h1 className={styles.title}>Wallet</h1>
          </header>

          <div>
            <WalletMultiButton className={styles.walletButton} />
          </div>

          {connected && (
            <div className={styles.infoBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Адрес</span>
                <button
                  onClick={handleCopyAddress}
                  className={styles.copyButton}
                  title="Скопировать адрес"
                >
                  <span className={styles.infoValueMono}>{address}</span>
                  <span className={copied ? styles.copyIconDone : styles.copyIcon}>
                    {copied ? "✓" : "⧉"}
                  </span>
                </button>
              </div>
              <div className={styles.infoDivider} />
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Баланс</span>
                <span className={styles.infoValueMono}>
                  {infoLoading ? "..." : `${balance ?? 0} SOL`}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <button
              onClick={getSupply}
              className={`${styles.actionButtonBase} ${styles.actionButtonAccent}`}
            >
              Запросить 2 SOL (airdrop)
            </button>
          </div>

          <p className={styles.footNote}>
            Airdrop доступен только в devnet/testnet. Если лимит исчерпан —
            используй{" "}
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              faucet.solana.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}