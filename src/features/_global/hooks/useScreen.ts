import { useMediaQuery } from "react-responsive";

export const useScreen = () => {
  const sm = useMediaQuery({
    query: "(min-width: 40rem)",
  }); // min-width: 640px

  const md = useMediaQuery({
    query: "(min-width: 48rem)",
  }); // min-width: 768px

  const lg = useMediaQuery({
    query: "(min-width: 64rem)",
  }); // min-width: 1024px

  const xl = useMediaQuery({
    query: "(min-width: 80rem)",
  }); // min-width: 1280px

  const xxl = useMediaQuery({
    query: "(min-width: 96rem)",
  }); // min-width: 1536px
  
  return { sm, md, lg, xl, "2xl": xxl };
};
