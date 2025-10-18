import React from "react";
import { Poppins } from "../Text";
import { Input, InputProps } from "../Input";

interface InputLabelProps {
  title: string;
  inputProps?: InputProps;
  direction?: 'row' | 'column'
  titleSize?: 'sm' | 'md'
}

export const InputLabel: React.FC<InputLabelProps> = ({
  title,
  inputProps,
  direction = 'column',
  titleSize = 'md'
}) => {
  return (
    <div className={`flex ${direction === 'column' ? 'flex-col' : 'flex-row'} w-full gap-2`}>
      <Poppins className={`${titleSize === 'sm' ? 'text-sm' : 'text-md'}`}>{title}</Poppins>
      <Input {...inputProps} />
    </div>
  );
};
