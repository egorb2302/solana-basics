import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config()

const address = process.env.ADDRESS

const execAsync = promisify(exec);

async function airdropFromCli(address, amount = 2) {
    try {
        const { stdout } = await execAsync(
            `solana airdrop ${amount} ${address} --url devnet`
        );
        console.log('Airdrop success:', stdout);
        return stdout;
    } catch (error) {
        console.error('Airdrop failed:', error.stderr || error.message);
        throw error;
    }
}

airdropFromCli(address, 2);