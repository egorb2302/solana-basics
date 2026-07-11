import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getDevWalletAddress } from "../../utils/walletActions";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import styles from "../solanaStyles";

export default function CreateTransaction() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!publicKey || !sendTransaction) return;
    setError("");
    setTxSignature("");
    setLoading(true);

    try {
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction().add(instruction);

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setTxSignature(signature);
    } catch (error) {
      const err = error as Error;
      console.error("Transaction failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.gradientBorder}>
        <div className={styles.card}>
          <header className="space-y-1">
            <p className={styles.eyebrow}>Solana · Devnet</p>
            <h1 className={styles.title}>Send SOL</h1>
          </header>

          <div className={styles.infoBox}>
            <CopyableAddress label="Твой адрес" value={publicKey?.toBase58() ?? "—"} />
            <div className={styles.infoDivider} />
            <CopyableAddress label="Тестовый получатель" value={getDevWalletAddress()} />
          </div>

          <div className="space-y-3">
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Адрес получателя</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Введите адрес Solana"
                className={`${styles.fieldInput} ${styles.fieldInputMono}`}
              />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Сумма</label>
              <div className={styles.fieldRelative}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`${styles.fieldInput} ${styles.fieldInputWithSuffix}`}
                />
                <span className={styles.fieldSuffix}>SOL</span>
              </div>
            </div>
          </div>

          <button onClick={handleSend} disabled={loading} className={styles.submitButton}>
            {loading ? "Отправка..." : "Отправить"}
          </button>

          {error && (
            <div className={styles.errorBox}>
              <p className={styles.errorText}>Ошибка: {error}</p>
            </div>
          )}

          {txSignature && (
            <div className={styles.successBox}>
              <p className={styles.successText}>Отправлено</p>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.explorerLink}
              >
                Открыть в Explorer
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyableAddress({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value || value === "—") return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <button onClick={handleCopy} className={styles.copyButton} title="Скопировать адрес">
        <span className={styles.infoValueMono}>{value}</span>
        <span className={copied ? styles.copyIconDone : styles.copyIcon}>
          {copied ? "✓" : "⧉"}
        </span>
      </button>
    </div>
  );
}