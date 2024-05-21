import React from "react";

import winModalStyle from "../styles/winOfferModal.module.css";
import WinAnimation from "./WinAnimation";

interface WinOfferModalProps {
  setWinOfferModalIsOpen: (isopen: boolean) => void;
}

const WinOfferModal: React.FC<WinOfferModalProps> = ({
  setWinOfferModalIsOpen,
}) => {
  return (
    <section
      className={winModalStyle.winOfferModalContainer}
      onClick={() => {
        setWinOfferModalIsOpen(false);
      }}
    >
      <div>
        <WinAnimation />
        <h3>YOU WON THE BARGAIN 🚀 </h3>
      </div>
    </section>
  );
};

export default WinOfferModal;
