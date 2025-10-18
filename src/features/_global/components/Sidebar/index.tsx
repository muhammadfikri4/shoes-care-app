import { initial } from "../../utils/initial";
import { Poppins } from "../Text";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarMenu } from "./types";

export interface SidebarProps {
  menus: SidebarMenu[];
  name: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ menus, name }) => {
  return (
    <div className="fixed h-screen w-20 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
      <div className="px-6 pt-8 pb-6 flex flex-col gap-4 items-center">
        <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl">
          <Poppins className="text-lg text-white">{initial(name)}</Poppins>
        </div>
        <SidebarGroup menus={menus} />
      </div>
    </div>
  );
};
