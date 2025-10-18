import { Link, useLocation } from "react-router-dom";
import { SidebarProps } from ".";

export const SidebarGroup: React.FC<Omit<SidebarProps, "name">> = ({
  menus,
}) => {
  const location = useLocation();
  console.log({ location });
  return (
    <div className="flex flex-col px-6 gap-4">
      {menus.map((item) => (
        <Link to={item.to}>
          <div
            className={`w-full px-4 py-4 rounded-xl ${
              location.pathname === item.to ? "bg-blue-50" : ""
            }`}
          >
            {item.icon}
          </div>
        </Link>
      ))}
    </div>
  );
};
