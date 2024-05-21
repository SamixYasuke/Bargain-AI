import React, { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

import winModalStyle from "../styles/winOfferModal.module.css";
import writingAnimationJson from "../utility/winAnimation.json";

const WinAnimation: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: AnimationItem | undefined;

    if (container.current) {
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: writingAnimationJson,
      });
    }

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, []);

  return (
    <div className={winModalStyle.winModalContainer} ref={container}></div>
  );
};

export default WinAnimation;
