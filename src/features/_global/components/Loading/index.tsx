import lottie, { type AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";
import loadingAnimation from "@core/assets/lottie/loading.json";

interface LoadingFallbackProps {
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  height = 500,
  width = 500,
  maxWidth = "70vw",
}) => {
  const animationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !animationRef.current) {
      return;
    }

    let animation: AnimationItem | null = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    return () => {
      animation?.destroy();
      animation = null;
    };
  }, []);

  return (
    <>
      <div ref={animationRef} style={{ width, height, maxWidth }}></div>
    </>
  );
};
