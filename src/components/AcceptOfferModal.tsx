import React from "react";
import acceptOfferModalStyle from "../styles/acceptOfferModal.module.css";

interface AcceptOfferModalProps {
  setAcceptOfferModalIsOpen: (isOpen: boolean) => void;
}

const AcceptOfferModal: React.FC<AcceptOfferModalProps> = ({
  setAcceptOfferModalIsOpen,
}) => {
  return (
    <section className={acceptOfferModalStyle.acceptOfferModalContainer}>
      <div>
        <h2>Do You Accept This Offer?</h2>
        <div>
          <button onClick={() => setAcceptOfferModalIsOpen(false)}>Yes</button>
          <button onClick={() => setAcceptOfferModalIsOpen(false)}>No</button>
        </div>
      </div>
    </section>
  );
};

export default AcceptOfferModal;
