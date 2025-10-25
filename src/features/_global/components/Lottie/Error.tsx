import Lottie from "lottie-react";
import ErrorJSON from "../../../../core/assets/lottie/error.json";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";

interface ErrorProps {
  withBackButton?: boolean;
}

export const Error: React.FC<ErrorProps> = ({ withBackButton }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-16 w-screen h-screen">
      <Lottie
        animationData={ErrorJSON}
        loop={true}
        style={{
          width: "50rem",
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
