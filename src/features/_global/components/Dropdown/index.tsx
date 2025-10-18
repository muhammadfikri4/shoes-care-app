import React from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  value: string;
}

interface DropdownProps {
  options: DropdownItem[];
  onChange: (e: string) => void;
  defaultValue?: {
    label: string;
    value: string;
  };
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  onChange,
  defaultValue,
}) => {
//   const [value, setValue] = useState(defaultValue);
  return (
    <div className="w-full">
      <details className="dropdown">
      {defaultValue ? (
        <summary className="btn m-1">{defaultValue.label}</summary>
      ) : (
        <summary className="btn m-1">open or close</summary>
      )}
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {options.map((item) => (
          <li onClick={() => onChange(item.value)}>
            <a>{item.label}</a>
          </li>
        ))}
      </ul>
    </details>
    </div>
  );
};
