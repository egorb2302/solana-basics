import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    type SimulatedTransactionAccountInfo,
    type TransactionError,
    type Message,
} from "@solana/web3.js";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from '../solanaStyles';

interface SimulationData {
    logs: string[] | null;
    error: TransactionError | null;
    accounts: (SimulatedTransactionAccountInfo | null)[] | null;
    consumed: number | undefined;
    returnData: { data: string; encoding: string } | null;
}

interface SimulationResult {
    data: SimulationData;
    feeInSol: number | null;
    timestamp: number;
}

export default function SimulationDashboard() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string>("0.001");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [intervalSeconds, setIntervalSeconds] = useState<number>(10);
    const [running, setRunning] = useState<boolean>(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleSendSimulation = useCallback(async (): Promise<void> => {
        if (!publicKey || !recipient) {
            setError("Connect wallet and enter recipient address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const instructions = SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(recipient),
                lamports: Number(amount) * LAMPORTS_PER_SOL,
            });

            const tx = new Transaction().add(instructions);
            const { blockhash } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = publicKey;

            const simulation = await connection.simulateTransaction(tx);

            let feeInSol: number | null = null;
            
            if (simulation.value.err) {
                console.error('Simulation failed, logs:');
                simulation.value.logs?.forEach(log => console.log(' ', log));
            } else {
                console.log('Simulation succeeded, logs:');
                simulation.value.logs?.forEach(log => console.log(' ', log));
            }

            try {
                const message = tx.compileMessage();
                const feeResponse = await connection.getFeeForMessage(
                    message as Message,
                    "confirmed"
                );
                if (feeResponse.value !== null) {
                    feeInSol = feeResponse.value / LAMPORTS_PER_SOL;
                }
            } catch {
                feeInSol = null;
            }

            const simData: SimulationData = {
                logs: simulation.value.logs ?? null,
                error: simulation.value.err ?? null,
                accounts: simulation.value.accounts ?? null,
                consumed: simulation.value.unitsConsumed ?? undefined,
                returnData: simulation.value.returnData
                    ? {
                          data: simulation.value.returnData.data.toString(),
                          encoding: "base64",
                      }
                    : null,
            };

            setResult({
                data: simData,
                feeInSol,
                timestamp: Date.now(),
            });
        } catch (err) {
            const e = err as Error;
            console.error("Transaction failed:", e.message);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [publicKey, recipient, amount, connection]);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                handleSendSimulation();
            }, intervalSeconds * 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [running, intervalSeconds, handleSendSimulation]);

    const toggleRunning = () => setRunning(prev => !prev);

    const formatTime = (ts: number) => new Date(ts).toLocaleTimeString();
    const formatLogs = (logs: string[] | null) => {
        if (!logs || logs.length === 0) return "No logs";
        return logs.join("\n");
    };
    const formatAccounts = (accounts: (SimulatedTransactionAccountInfo | null)[] | null) => {
        if (!accounts || accounts.length === 0) return "No account data";
        return accounts
            .map((acc, i) => {
                if (!acc) return `Account ${i}: null`;
                return `Account ${i}: executable=${acc.executable}, owner=${acc.owner.slice(0, 12)}..., lamports=${acc.lamports}`;
            })
            .join("\n");
    };

    return (
        <div className={styles.page}>
            <div className={styles.gradientBorder}>
                <div className={styles.card}>
                    <p className={styles.eyebrow}>Simulation</p>
                    <h2 className={styles.title}>Transaction Dashboard</h2>

                    {/* Recipient */}
                    <div className={styles.fieldWrap}>
                        <label className={styles.fieldLabel}>Recipient</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={e => setRecipient(e.target.value)}
                            placeholder="Solana address"
                            className={`${styles.fieldInput} ${styles.fieldInputMono}`}
                        />
                    </div>

                    {/* Amount */}
                    <div className={styles.fieldWrap}>
                        <label className={styles.fieldLabel}>Amount</label>
                        <div className={styles.fieldRelative}>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                step="0.001"
                                min="0.001"
                                className={`${styles.fieldInput} ${styles.fieldInputWithSuffix}`}
                            />
                            <span className={styles.fieldSuffix}>SOL</span>
                        </div>
                    </div>

                    {/* Interval */}
                    <div className={styles.fieldWrap}>
                        <label className={styles.fieldLabel}>Interval (seconds)</label>
                        <input
                            type="number"
                            value={intervalSeconds}
                            onChange={e => setIntervalSeconds(Number(e.target.value))}
                            min={5}
                            max={300}
                            className={styles.fieldInput}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                        <button
                            onClick={handleSendSimulation}
                            disabled={loading || !publicKey || !recipient}
                            className={styles.submitButton}
                        >
                            {loading ? "Simulating..." : "Simulate Once"}
                        </button>
                        <button
                            onClick={toggleRunning}
                            disabled={!publicKey || !recipient}
                            className={`${styles.actionButtonBase} ${
                                running ? "bg-[#FF6B6B]/20 border border-[#FF6B6B]/40 text-[#FF8A8A] hover:bg-[#FF6B6B]/30" : styles.actionButtonAccent
                            }`}
                        >
                            {running ? "Stop Auto Simulation" : "Start Auto Simulation"}
                        </button>
                    </div>

                    {running && (
                        <p className={styles.footNote}>
                            Auto-simulating every {intervalSeconds}s
                        </p>
                    )}

                    {/* Error */}
                    {error && (
                        <div className={styles.errorBox}>
                            <p className={styles.errorText}>{error}</p>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className={styles.infoBox}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Time</span>
                                <span className={styles.infoValueMono}>{formatTime(result.timestamp)}</span>
                            </div>
                            <div className={styles.infoDivider} />
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Status</span>
                                <span className={styles.infoValueMono}>
                                    {result.data.error ? (
                                        <span className="text-[#FF8A8A]">Failed</span>
                                    ) : (
                                        <span className="text-[#14F195]">Success</span>
                                    )}
                                </span>
                            </div>
                            {result.data.error && (
                                <>
                                    <div className={styles.infoDivider} />
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Error</span>
                                        <span className={`${styles.infoValueMono} text-[#FF8A8A]`}>
                                            {JSON.stringify(result.data.error)}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className={styles.infoDivider} />
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Compute Units</span>
                                <span className={styles.infoValueMono}>
                                    {result.data.consumed ?? "—"}
                                </span>
                            </div>
                            <div className={styles.infoDivider} />
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Estimated Fee</span>
                                <span className={styles.infoValueMono}>
                                    {result.feeInSol !== null
                                        ? `${result.feeInSol.toFixed(8)} SOL`
                                        : "—"}
                                </span>
                            </div>

                            {/* Logs */}
                            <div className={styles.infoDivider} />
                            <div className={styles.fieldWrap}>
                                <label className={styles.fieldLabel}>Logs</label>
                                <pre className={`${styles.fieldInput} font-['JetBrains_Mono'] text-[11px] h-24 overflow-auto whitespace-pre-wrap`}>
                                    {formatLogs(result.data.logs)}
                                </pre>
                            </div>

                            {/* Accounts */}
                            <div className={styles.fieldWrap}>
                                <label className={styles.fieldLabel}>Accounts</label>
                                <pre className={`${styles.fieldInput} font-['JetBrains_Mono'] text-[11px] h-24 overflow-auto whitespace-pre-wrap`}>
                                    {formatAccounts(result.data.accounts)}
                                </pre>
                            </div>

                            {/* Return Data */}
                            {result.data.returnData && (
                                <div className={styles.fieldWrap}>
                                    <label className={styles.fieldLabel}>Return Data</label>
                                    <pre className={`${styles.fieldInput} font-['JetBrains_Mono'] text-[11px] h-16 overflow-auto`}>
                                        {JSON.stringify(result.data.returnData, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                    <p className={styles.footNote}>
                        Cимуляция транзакции для получения информации: CU за операцию, Статус операции, Информацию по аккаунтам и Логи.
                    </p>
                </div>
            </div>
        </div>
    );
}