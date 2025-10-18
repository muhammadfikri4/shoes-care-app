import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ProfileDTO, Role } from "../../../core/model/profile";
import { useProfile } from "../../profile/hooks/useProfile";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export const RootLayout = () => {
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header user={profile?.data as ProfileDTO} />
      <div className="flex flex-col overflow-hidden">
        <Sidebar
          onOpenChange={setOpen}
          defaultOpen={open}
          open={open}
          role={profile?.data?.role as Role}
        />
        <main
          className={`transition-all duration-300 ${
            open ? "md:pl-64" : "md:pl-4"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};
