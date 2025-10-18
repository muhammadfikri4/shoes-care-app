import React from "react";
import { Poppins } from "../Text";

interface ITableHeadProps {
  field: string[];
  className?: string;
}

export const TableHead: React.FC<ITableHeadProps> = ({ field, className }) => {
  return (
    <thead
      className={`${className} bg-white dark:bg-gray-900 border-b-4 border-indigo-500`}
    >
      <tr className="text-gray-800 dark:text-gray-100">
        {field.map((item, index) => (
          <th
            key={index}
            className="py-5 px-6 text-left text-sm font-bold tracking-wider uppercase hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
          >
            <Poppins className="text-sm">{item}</Poppins>
          </th>
        ))}
      </tr>
    </thead>
  );
};
