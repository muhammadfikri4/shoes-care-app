import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProps } from ".";
import { ReactNode } from "react";

interface ItemMenu {
  path: string;
  label: string;
  icon: ReactNode;
  open: SidebarProps["open"];
  onSelect?: () => void;
}

export const SidebarGroup: React.FC<ItemMenu> = ({
  path,
  label,
  open,
  icon,
  onSelect,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log({ location });
  return (
    <button
      onClick={() => { navigate(path); onSelect?.(); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        location.pathname === path
          ? "bg-primary text-white"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      {open && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
};
