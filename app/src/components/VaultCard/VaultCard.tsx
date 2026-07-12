import { useEffect, useMemo, useState } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, web3 } from "@coral-xyz/anchor";
import {
  fetchVault,
  getVaultLamports,
  getVaultProgram,
  initializeVault,
  depositToVault,
  withdrawFromVault,
  type VaultAccount,
} from "../../anchor/vaultHelpers";
import styles from "../solanaStyles";

const isValidAmount = (value: string) => {
  const n = Number(value);
  return value.trim() !== "" && !Number.isNaN(n) && n > 0;
};

export default function VaultCard() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet(); 
  const provider = useMemo(() => {
    if (!anchorWallet) return null;
    return new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
  }, [connection, anchorWallet]);

  const program = useMemo(() => (provider ? getVaultProgram(provider) : null), [provider]);

  const [vault, setVault] = useState<VaultAccount | null>(null);
  const [vaultLamports, setVaultLamports] = useState<number | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [initError, setInitError] = useState<string>("");

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [depositError, setDepositError] = useState<string>("");

  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string>("");

  const refresh = async () => {
    if (!program || !publicKey) {
      setVault(null);
      setVaultLamports(null);
      return;
    }
    setFetching(true);
    try {
      const [account, lamports] = await Promise.all([
        fetchVault(program, publicKey),
        getVaultLamports(program, publicKey),
      ]);
      setVault(account);
      setVaultLamports(lamports);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, publicKey]);

  const handleInitialize = async () => {
    if (!program || !publicKey) return;
    setInitError("");
    setInitLoading(true);
    try {
      await initializeVault(program, publicKey);
      await refresh();
    } catch (err) {
      setInitError(err instanceof Error ? err.message : "Не удалось создать vault");
    } finally {
      setInitLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!program || !publicKey || !isValidAmount(depositAmount)) return;
    setDepositError("");
    setDepositLoading(true);
    try {
      await depositToVault(program, publicKey, Number(depositAmount));
      setDepositAmount("");
      await refresh();
    } catch (err) {
      setDepositError(err instanceof Error ? err.message : "Не удалось внести депозит");
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!program || !publicKey || !isValidAmount(withdrawAmount)) return;
    setWithdrawError("");
    setWithdrawLoading(true);
    try {
      await withdrawFromVault(program, publicKey, Number(withdrawAmount));
      setWithdrawAmount("");
      await refresh();
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : "Не удалось вывести средства");
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className={styles.page}>
        <div className={styles.gradientBorder}>
          <div className={styles.card}>
            <p className={styles.footNote}>Подключи кошелёк, чтобы работать с vault.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.gradientBorder}>
        <div className={styles.card}>
          <header className="space-y-1">
            <p className={styles.eyebrow}>Anchor · Devnet</p>
            <h1 className={styles.title}>Vault</h1>
          </header>

          {fetching && !vault && <p className={styles.footNote}>Загрузка...</p>}

          {!fetching && vault === null && (
            <div className="space-y-3">
              <p className={styles.footNote}>
                У тебя ещё нет vault-аккаунта — его нужно создать один раз перед депозитом.
              </p>
              <button
                onClick={handleInitialize}
                disabled={initLoading}
                className={`${styles.actionButtonBase} ${styles.actionButtonAccent}`}
              >
                {initLoading ? "Создание..." : "Создать vault"}
              </button>
              {initError && (
                <div className={styles.errorBox}>
                  <p className={styles.errorText}>Ошибка: {initError}</p>
                </div>
              )}
            </div>
          )}

          {vault !== null && (
            <>
              <div className={styles.infoBox}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Баланс vault</span>
                  <span className={styles.infoValueMono}>
                    {vaultLamports !== null ? (vaultLamports / web3.LAMPORTS_PER_SOL).toFixed(4) : "..."} SOL
                  </span>
                </div>
                <div className={styles.infoDivider} />
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Всего внесено</span>
                  <span className={styles.infoValueMono}>
                    {(vault.totalDeposited.toNumber() / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL
                  </span>
                </div>
              </div>

              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Депозит (SOL)</label>
                <input
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.0"
                  type="number"
                  min="0"
                  step="any"
                  disabled={depositLoading}
                  className={styles.fieldInput}
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={depositLoading || !isValidAmount(depositAmount)}
                className={styles.submitButton}
              >
                {depositLoading ? "Отправка..." : "Внести"}
              </button>
              {depositError && (
                <div className={styles.errorBox}>
                  <p className={styles.errorText}>Ошибка: {depositError}</p>
                </div>
              )}

              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel}>Вывод (SOL)</label>
                <input
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.0"
                  type="number"
                  min="0"
                  step="any"
                  disabled={withdrawLoading}
                  className={styles.fieldInput}
                />
              </div>
              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading || !isValidAmount(withdrawAmount)}
                className={styles.submitButton}
              >
                {withdrawLoading ? "Отправка..." : "Вывести"}
              </button>
              {withdrawError && (
                <div className={styles.errorBox}>
                  <p className={styles.errorText}>Ошибка: {withdrawError}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}