import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import walletData from '../../../my-solana-project/dev-wallet.json';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function loadDevWallet(): Keypair {
    return Keypair.fromSecretKey(Uint8Array.from(walletData));
}

export function getDevWalletAddress(): string {
    return loadDevWallet().publicKey.toBase58();
}

export async function getBalance(pk: PublicKey, coned: boolean, conion: Connection): Promise<number | void> {
    if (!pk || !coned) {
      console.log("Cant get publicKey");
      return;
    }
    const balanceLamports = await conion.getBalance(pk);
    const balanceSol: number = balanceLamports / LAMPORTS_PER_SOL;
    return balanceSol
}

export async function getAddress(pk: PublicKey, con: boolean): Promise<string> {
    if (!pk || !con) {
      console.log("Cant get publicKey");
      return '-';
    }
    return pk.toBase58()
}