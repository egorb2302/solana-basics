import { AnchorProvider, BN, Program, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/wallet_vault.json";
import type { WalletVault } from "../idl/wallet_vault"; 

export const PROGRAM_ID = new PublicKey("2aq3ztLFrXogHHPXghEVLe6vpaTeU385HsiHFk1tatWo");

export function getVaultProgram(provider: AnchorProvider): Program<WalletVault> {
  return new Program(idl as WalletVault, provider);
}

export function getVaultPda(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), owner.toBuffer()],
    PROGRAM_ID
  );
}

export type VaultAccount = {
  owner: PublicKey;
  totalDeposited: BN;
  bump: number;
};

export async function fetchVault(
  program: Program<WalletVault>,
  owner: PublicKey
): Promise<VaultAccount | null> {
  const [vaultPda] = getVaultPda(owner);
  try {
    const account = await program.account.vault.fetch(vaultPda);
    return account as unknown as VaultAccount;
  } catch {
    return null;
  }
}

export async function getVaultLamports(
  program: Program<WalletVault>,
  owner: PublicKey
): Promise<number> {
  const [vaultPda] = getVaultPda(owner);
  return program.provider.connection.getBalance(vaultPda);
}

export async function initializeVault(program: Program<WalletVault>, owner: PublicKey) {
  const [vaultPda] = getVaultPda(owner);
  return program.methods
    .initialize()
    .accounts({
      vault: vaultPda,
      user: owner,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}

export async function depositToVault(
  program: Program<WalletVault>,
  owner: PublicKey,
  amountSol: number
) {
  const [vaultPda] = getVaultPda(owner);
  const lamports = new BN(Math.round(amountSol * web3.LAMPORTS_PER_SOL));
  return program.methods
    .deposit(lamports)
    .accounts({
      vault: vaultPda,
      user: owner,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}

export async function withdrawFromVault(
  program: Program<WalletVault>,
  owner: PublicKey,
  amountSol: number
) {
  const [vaultPda] = getVaultPda(owner);
  const lamports = new BN(Math.round(amountSol * web3.LAMPORTS_PER_SOL));
  return program.methods
    .withdraw(lamports)
    .accounts({
      vault: vaultPda,
      user: owner,
    })
    .rpc();
}