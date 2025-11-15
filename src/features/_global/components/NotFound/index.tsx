import Lottie from "lottie-react";
import NotFoundJSON from "../../../../core/assets/lottie/no-data.json";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  withBackButton?: boolean;
  width?: string | number;
  gap?: string | number;
}

export const NotFound: React.FC<NotFoundProps> = ({
  withBackButton,
  width = "50rem",
  gap = "4rem",
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen"
      style={{
        gap,
      }}
    >
      <Lottie
        animationData={NotFoundJSON}
        loop={true}
        style={{
          width,
        }}
      />
      {withBackButton && (
        <div className="w-60">
          <Button size="lg" onClick={() => navigate(-1)}>
            BACK
          </Button>
        </div>
      )}
    </div>
  );
};
