import CreateTransaction from "../components/TxComponent/TxComponent";
// import VaultCard from "../components/VaultCard/VaultCard";
import WalletModal from "../components/WalletModal/WalletModal";

export default function MainPage() {
    return (
        <div className="flex w-full justify-center bg-[#0B0A10]">
            <WalletModal />
            <CreateTransaction />
            {/* <VaultCard /> */}
        </div>
    )
}