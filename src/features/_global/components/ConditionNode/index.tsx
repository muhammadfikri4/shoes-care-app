import React, { ReactNode } from "react";

interface ConditionProps {
  children?: ReactNode;
  option?: ReactNode;
  condition: boolean;
}

export const ConditionNode: React.FC<ConditionProps> = ({
  condition,
  children,
  option,
}) => {
  return <>{condition ? children : option ? option : null}</>;
};
