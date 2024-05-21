import React from "react";
import acceptOfferModalStyle from "../styles/acceptOfferModal.module.css";

interface AcceptOfferModalProps {
  setAcceptOfferModalIsOpen: (isOpen: boolean) => void;
  setWinOfferModalIsOpen: (isOpen: boolean) => void;
  setLoseOfferModalIsOpen: (isOpen: boolean) => void;
  currentOffer: number;
  costPrice: number;
}

const AcceptOfferModal: React.FC<AcceptOfferModalProps> = ({
  setAcceptOfferModalIsOpen,
  setWinOfferModalIsOpen,
  setLoseOfferModalIsOpen,
  currentOffer,
  costPrice,
}) => {
  const handleAcceptOffer = () => {
    if (currentOffer >= costPrice) {
      setAcceptOfferModalIsOpen(false);
      setWinOfferModalIsOpen(true);
    } else {
      setAcceptOfferModalIsOpen(false);
      setLoseOfferModalIsOpen(true);
    }
  };

  return (
    <section className={acceptOfferModalStyle.acceptOfferModalContainer}>
      <div>
        <h2>Do You Accept This Offer?</h2>
        <div>
          <button onClick={handleAcceptOffer}>Yes</button>
          <button onClick={() => setAcceptOfferModalIsOpen(false)}>No</button>
        </div>
      </div>
    </section>
  );
};

export default AcceptOfferModal;
