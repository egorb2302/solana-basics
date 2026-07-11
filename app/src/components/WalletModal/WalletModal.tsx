import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import styles from "../solanaStyles";

export default function WalletModal() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const walletAddress = () => {
    if (!connected || !publicKey) {
      console.log("Cant get publicKey");
      return;
    }
    console.log(`Address: ${publicKey.toBase58()}`);
  };

  const walletBalance = async () => {
    if (!publicKey) return;
    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSol: number = balanceLamports / LAMPORTS_PER_SOL;
    console.log(`Balance: ${balanceSol} SOL`);
  };

  const getSupply = async () => {
    if (!publicKey) return;

    try {
      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Airdrop successful");
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

          <div className="space-y-2.5">
            <button
              onClick={walletAddress}
              className={`${styles.actionButtonBase} ${styles.actionButtonGhost}`}
            >
              Показать адрес в консоли
            </button>
            <button
              onClick={walletBalance}
              className={`${styles.actionButtonBase} ${styles.actionButtonGhost}`}
            >
              Показать баланс в консоли
            </button>
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