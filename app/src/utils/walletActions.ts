import { Keypair } from '@solana/web3.js';
import walletData from '../../../my-solana-project/dev-wallet.json';

export function loadDevWallet(): Keypair {
    return Keypair.fromSecretKey(Uint8Array.from(walletData));
}

export function getDevWalletAddress(): string {
    return loadDevWallet().publicKey.toBase58();
}