import CreateTransaction from "../components/TxComponent/TxComponent";
import SimulationDashboard from "../components/TxSimulation/TxSimulation";
import WalletModal from "../components/WalletModal/WalletModal";
import walletImage from '../assets/Solana Wallet.png';
import { DraggableWindow } from "../utils/springDraggable";

export default function MainPage() {
    return (
        <div className="bg-[#0B0A10]">
            <img
                className="absolute left-1/2 -translate-x-1/2 top-20"
                src={walletImage}
                alt="Solana Wallet"
        
            />
            <DraggableWindow title="Wallet">
                <WalletModal />
            </DraggableWindow>

            <DraggableWindow title="Simulation">
                <SimulationDashboard />
            </DraggableWindow>

            <DraggableWindow title="Transaction">
                <CreateTransaction />
            </DraggableWindow>
        </div>
    )
}