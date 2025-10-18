import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiDotsVertical } from "react-icons/hi";

interface DropdownMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  visibleButtons?: React.ReactNode[];
  className?: string;
}

export const DropdownMenu = ({
  items,
  visibleButtons = [],
  className = "",
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close dropdown
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const rect = buttonRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Position dropdown below the button
    const top = rect.bottom + scrollTop + 4; // 4px gap
    
    // Calculate left position to keep dropdown within viewport
    const dropdownWidth = 224; // w-56 = 14rem = 224px
    const viewportWidth = window.innerWidth;
    
    let left = rect.left + scrollLeft;
    
    // If dropdown would go outside right edge, align to right
    if (left + dropdownWidth > viewportWidth) {
      left = rect.right + scrollLeft - dropdownWidth;
    }
    
    // Ensure minimum left position (don't go negative)
    left = Math.max(8, left); // 8px minimum margin from left edge

    return { top, left };
  };

  const position = getDropdownPosition()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !dropdownRef.current?.contains(target) &&
        !dropdownMenuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      className={`relative flex items-center gap-2 w-max ${className}`}
      ref={dropdownRef}
    >
      {/* Visible buttons */}
      {visibleButtons.map((button, index) => (
        <div key={`visible-btn-${index}`}>{button}</div>
      ))}

      {/* Dropdown toggle */}
      <button
        ref={buttonRef}
        className="inline-flex justify-center border border-solid border-gray-600 rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More actions"
        aria-expanded={isOpen}
      >
        <HiDotsVertical className="h-3 w-3" />
      </button>

      {/* Dropdown menu */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownMenuRef}
            className="absolute z-[991] mt-1 w-56 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700 transition-all duration-200 transform"
            style={{
              // position: "absolute",
              // top: buttonRef.current?.getBoundingClientRect().bottom ?? 0,
              // left:
              //   (buttonRef.current?.getBoundingClientRect().left ?? 0) - 200,
              // minWidth: buttonRef.current?.clientWidth,
              top: position.top,
              left: position.left,
            }}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={`menu-item-${index}`}
                  onClick={() => {
                    if(!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={`
              flex w-full items-center px-4 py-2 text-sm
              ${
                item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
              ${
                item.variant === "danger"
                  ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70"
              }
              transition-colors duration-200 ease-in-out
            `}
                >
                  <span className="mr-3 flex items-center">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>,
          document.body // 👈 ini penting, agar dropdown render di luar container
        )}
    </div>
  );
};
