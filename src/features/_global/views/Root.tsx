import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ProfileDTO, Role } from "../../../core/model/profile";
import { useProfile } from "../../profile/hooks/useProfile";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export const RootLayout = () => {
  const { data: profile, isFetching } = useProfile();
  const [open, setOpen] = useState(false);
  if (!profile?.data?.id && !isFetching) {
    return <Navigate to="/login" />;
  }
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
        <main className="w-full">
          {/* Container dengan padding yang berubah dari kiri */}
          <div
            className={`px-4 md:px-8 w-screen transition-all duration-300 ${
              open ? "md:w-screen" : "md:w-[calc(100%-256px)]"
            }`}
          >
            <div className="w-screen">
              <Outlet />
            </div>
            {/* Inner container dengan max-width untuk konten */}
          </div>
        </main>
      </div>
    </>
  );
};
