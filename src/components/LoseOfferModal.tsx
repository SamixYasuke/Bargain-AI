import React from "react";

import winModalStyle from "../styles/winOfferModal.module.css";

interface LoseOfferModalProps {
  setLoseOfferModalIsOpen: (isopen: boolean) => void;
}

const LoseOfferModal: React.FC<LoseOfferModalProps> = ({
  setLoseOfferModalIsOpen,
}) => {
  return (
    <section
      className={winModalStyle.winOfferModalContainer}
      onClick={() => {
        setLoseOfferModalIsOpen(false);
      }}
    >
      <div>
        <h3>WHOOPS YOU LOST THIS BARGAIN 🥺😢😭 </h3>
      </div>
    </section>
  );
};

export default LoseOfferModal;
