import React, { useState, FormEvent, ChangeEvent } from "react";
import costpriceModalStyle from "../styles/costPriceModal.module.css";

interface CostPriceModalProps {
  setCostPriceModalIsOpen: (isOpen: boolean) => void;
  setCostPrice: (price: number) => void;
  setUserInput: (input: string) => void;
}

const CostPriceModal: React.FC<CostPriceModalProps> = ({
  setCostPriceModalIsOpen,
  setCostPrice,
  setUserInput,
}) => {
  const [userCostPrice, setUserCostPrice] = useState<number | undefined>(
    undefined
  );

  const handleSetCostPrice = (e: FormEvent) => {
    e.preventDefault();
    if (userCostPrice && userCostPrice > 0) {
      setCostPrice(userCostPrice);
      setUserInput(`I have something to sell for ₦${userCostPrice}`);
      setCostPriceModalIsOpen(false);
    }
  };

  return (
    <section className={costpriceModalStyle.costPriceModalContainer}>
      <form onSubmit={handleSetCostPrice}>
        <input
          value={userCostPrice !== undefined ? userCostPrice : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUserCostPrice(Number(e.target.value));
          }}
          type="number"
          placeholder="Enter a Cost Price"
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default CostPriceModal;
