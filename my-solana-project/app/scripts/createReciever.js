import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

async function main() {
    const wallet = Keypair.generate();
    const address = wallet.publicKey.toBase58();

    fs.writeFileSync('dev-wallet.json', JSON.stringify(Array.from(wallet.secretKey)));
    
    console.log('Permanent dev wallet created:');
    console.log('  Address:', address);
    console.log('  File: dev-wallet.json');
    console.log('  Add dev-wallet.json to .gitignore!');
}

main();