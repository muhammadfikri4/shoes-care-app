import Lottie from "lottie-react";
import NotFoundJSON from "../../../../core/assets/lottie/not-found.json";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  withBackButton?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({ withBackButton }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-16 w-screen h-screen">
      <Lottie
        animationData={NotFoundJSON}
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
