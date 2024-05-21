import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import appStyle from "./App.module.css";
import { SyncLoader } from "react-spinners";

import costPriceImg from "./assets/cost price.png";
import currentPriceImg from "./assets/current price.png";
import aiIcon from "./assets/ai icon.png";
import sendBtn from "./assets/send icon.png";
import acceptOfferIcon from "./assets/accept offer icon.png";
import bargainAI from "./utility/bargain.ai";
import CostPriceModal from "./components/CostPriceModal";
import AcceptOfferModal from "./components/AcceptOfferModal";
import WinOfferModal from "./components/WinOfferModal";
import LoseOfferModal from "./components/LoseOfferModal";

interface Message {
  type: "user" | "ai";
  text: string;
}

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const [costPriceModalIsOpen, setCostPriceModalIsOpen] = useState(false);
  const [acceptOfferModalIsOpen, setAcceptOfferModalIsOpen] = useState(false);
  const [winOfferModalIsOpen, setWinOfferModalIsOpen] = useState(false);
  const [loseOfferModalIsOpen, setLoseOfferModalIsOpen] = useState(false);
  const [costPrice, setCostPrice] = useState<number>(Number);
  const [currentOffer, setCurrentOffer] = useState<number>(Number);

  const scrollToBottom = () => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    setCostPriceModalIsOpen(true);
  }, []);

  const extractNumberFromResponse = (response: string): number | null => {
    // Regex to find all instances of numbers with optional '₦' prefix and 'k' shorthand
    const matches: RegExpMatchArray | null = response.match(
      /₦?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+k)/gi
    );

    console.log(matches);
    if (matches && matches.length > 0) {
      // Get the last match from the array
      const lastMatch: string = matches[matches.length - 1];
      let extractedNumber: number;
      if (/k$/i.test(`${lastMatch}k`)) {
        // If the number ends with 'k' or 'K', multiply by 1000
        extractedNumber = parseFloat(lastMatch.replace(/k/i, "")) * 1000;
        console.log(extractedNumber);
        return extractedNumber;
      } else {
        // Remove '₦' if present and any commas
        extractedNumber = parseFloat(lastMatch.replace(/₦|,/g, ""));
        console.log(extractedNumber);
        return extractedNumber;
      }
    }

    return null;
  };

  const handleChat = async (e: FormEvent) => {
    e.preventDefault();
    if (userInput) {
      setConversation((prev) => [...prev, { type: "user", text: userInput }]);
      setUserInput("");
      setIsLoading(true);
      try {
        const response = await bargainAI(userInput);
        setConversation((prev) => [...prev, { type: "ai", text: response }]);
        const extractedNumber = extractNumberFromResponse(response);
        if (extractedNumber !== null) {
          setCurrentOffer(extractedNumber);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <main className={appStyle.chatContainer}>
        <section>
          <div>
            <img src={costPriceImg} alt="Cost Price" />
            <p>{`₦${costPrice !== null ? costPrice : "Not available"}`}</p>
          </div>
          <div>
            <img src={currentPriceImg} alt="Current Offer" />
            <p>{`₦${
              currentOffer !== null ? currentOffer : "Not available"
            }`}</p>
          </div>
        </section>
        <section className={appStyle.conversationContainer}>
          {conversation.map((message, index) => (
            <div
              key={index}
              className={
                message.type === "user"
                  ? appStyle.messageContainer
                  : appStyle.replyContainer
              }
            >
              {message.type === "user" ? (
                <div className={appStyle.messageBox}>
                  <p>{message.text}</p>
                </div>
              ) : (
                <div className={appStyle.replyBox}>
                  <img src={aiIcon} alt="AI Icon" />
                  <p>{message.text}</p>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className={appStyle.loadingContainer}>
              <SyncLoader color="#fcbe42" />
            </div>
          )}
          <div ref={conversationEndRef} />
        </section>
        <form onSubmit={handleChat}>
          <div className={appStyle.inputContainer}>
            <input
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUserInput(e.target.value);
              }}
              value={userInput}
              type="text"
              placeholder="Start Typing..."
            />
            <div className={appStyle.iconContainer}>
              <img
                src={acceptOfferIcon}
                alt="Accept Offer Icon"
                onClick={() => {
                  setAcceptOfferModalIsOpen(true);
                }}
              />
              <img src={sendBtn} alt="Send Button" onClick={handleChat} />
            </div>
          </div>
        </form>
      </main>
      {costPriceModalIsOpen && (
        <CostPriceModal
          setCostPriceModalIsOpen={setCostPriceModalIsOpen}
          setCostPrice={setCostPrice}
          setUserInput={setUserInput}
        />
      )}
      {acceptOfferModalIsOpen && (
        <AcceptOfferModal
          setAcceptOfferModalIsOpen={setAcceptOfferModalIsOpen}
          setWinOfferModalIsOpen={setWinOfferModalIsOpen}
          setLoseOfferModalIsOpen={setLoseOfferModalIsOpen}
          currentOffer={currentOffer}
          costPrice={costPrice}
        />
      )}
      {winOfferModalIsOpen && (
        <WinOfferModal setWinOfferModalIsOpen={setWinOfferModalIsOpen} />
      )}
      {loseOfferModalIsOpen && (
        <LoseOfferModal setLoseOfferModalIsOpen={setLoseOfferModalIsOpen} />
      )}
    </>
  );
};

export default App;
