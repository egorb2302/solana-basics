const styles = {
  page: "min-h-fit bg-transparent flex items-center justify-center p-6 !w-fit",

  gradientBorder:
    "max-w-lg rounded-[28px] p-[1.5px] bg-gradient-to-br from-[#9945FF] via-[#7B61FF] to-[#14F195] !w-fit",
  card: "rounded-[26px] bg-[#16141C] p-7 space-y-6 w-fit",

  eyebrow: "text-xs uppercase tracking-[0.18em] text-[#9C96AA]",
  title: "text-2xl font-semibold text-[#F5F3FF] font-['Space_Grotesk']",
  walletButtonWrapper:
    "[&_.wallet-adapter-button-start-icon]:!w-6 [&_.wallet-adapter-button-start-icon]:!h-6 " +
    "[&_.wallet-adapter-button-start-icon_img]:!rounded-lg " +
    "[&_.wallet-adapter-dropdown-list]:!bg-[#1E1B26] [&_.wallet-adapter-dropdown-list]:!border [&_.wallet-adapter-dropdown-list]:!border-[#2A2733] " +
    "[&_.wallet-adapter-dropdown-list]:!rounded-2xl [&_.wallet-adapter-dropdown-list]:!p-1.5 [&_.wallet-adapter-dropdown-list]:!shadow-2xl " +
    "[&_.wallet-adapter-dropdown-list-item]:!text-[#D9D5E3] [&_.wallet-adapter-dropdown-list-item]:!text-xs " +
    "[&_.wallet-adapter-dropdown-list-item]:!font-['Inter'] [&_.wallet-adapter-dropdown-list-item]:!rounded-xl " +
    "[&_.wallet-adapter-dropdown-list-item:hover]:!bg-[#2A2733]",

  walletButton:
    "!w-full !justify-center !rounded-2xl !h-12 !bg-gradient-to-r !from-[#9945FF] !to-[#14F195] cursor-pointer" +
    "!font-['Inter'] !font-semibold !text-sm hover:!opacity-90 !transition-opacity",

  actionButtonBase:
    "w-full rounded-xl px-4 py-3 text-sm font-medium font-['Inter'] transition-colors text-left cursor-pointer",
  actionButtonGhost:
    "bg-[#1E1B26] border border-[#2A2733] text-[#D9D5E3] hover:border-[#3A3648] hover:bg-[#221E30]",
  actionButtonAccent:
    "bg-[#1E1B26] border border-[#9945FF]/40 text-[#F5F3FF] hover:border-[#9945FF] hover:bg-[#221E30]",

  footNote: "text-[11px] text-[#6E6980] leading-relaxed",
  link: "text-[#AB9FF2] hover:text-[#C4BAFF] underline underline-offset-2",

  infoBox: "space-y-2 rounded-xl bg-[#1E1B26] border border-[#2A2733] p-3.5 w-auto",
  infoDivider: "h-px bg-[#2A2733]",
  infoRow: "flex items-center justify-between gap-3",
  infoLabel: "text-xs text-[#9C96AA] shrink-0",
  infoValueMono: "text-xs text-[#D9D5E3] font-['JetBrains_Mono'] truncate",

  copyButton:
    "flex items-center gap-1.5 max-w-[65%] group cursor-pointer bg-transparent border-0 p-0",
  copyIcon: "text-[11px] shrink-0 transition-colors text-[#6E6980] group-hover:text-[#AB9FF2]",
  copyIconDone: "text-[11px] shrink-0 text-[#14F195]",

  fieldWrap: "space-y-1.5",
  fieldLabel: "text-xs text-[#9C96AA] px-0.5",
  fieldRelative: "relative",
  fieldInput:
    "w-full rounded-xl bg-[#1E1B26] border border-[#2A2733] px-3.5 py-3 text-sm text-[#F5F3FF] " +
    "placeholder:text-[#5C576B] outline-none focus:border-[#AB9FF2] focus:ring-1 focus:ring-[#AB9FF2]/40 transition-colors",
  fieldInputMono: "font-['JetBrains_Mono']",
  fieldInputWithSuffix: "pr-14",
  fieldSuffix: "absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6E6980]",

  submitButton:
    "cursor-pointer w-full rounded-xl h-12 text-sm font-semibold text-[#0B0A10] transition-opacity" +
    "disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90",

  errorBox: "rounded-xl border border-[#FF6B6B]/30 bg-[#2A1A1D] px-3.5 py-2.5",
  errorText: "text-xs text-[#FF8A8A] font-['JetBrains_Mono']",

  successBox:
    "rounded-xl border border-[#14F195]/30 bg-[#152420] px-3.5 py-2.5 flex items-center justify-between gap-3",
  successText: "text-xs text-[#6EE7B7]",
  explorerLink: "text-xs text-[#AB9FF2] hover:text-[#C4BAFF] underline underline-offset-2 shrink-0",
};

export default styles;