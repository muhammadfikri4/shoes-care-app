import { useAtom } from "jotai";
import { Navigate, Outlet } from "react-router-dom";
import { ProfileDTO, Role } from "../../../core/model/profile";
import { useProfile } from "../../profile/hooks/useProfile";
import { Header } from "../components/Header";
import { LoadingFallback } from "../components/Loading";
import { Sidebar } from "../components/Sidebar";
import { SidebarAtom } from "../store";

export const RootLayout = () => {
  const { data: profile, isFetching } = useProfile();
  const [open, setOpen] = useAtom(SidebarAtom);

  if (!isFetching && !profile?.data?.id) {
    return <Navigate to="/login" />;
  }

  if (isFetching && !profile?.data?.id) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-600">
        <LoadingFallback />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header user={profile?.data as ProfileDTO} />
        <div className="flex flex-1 overflow-hidden">
          {open && (
            <button
              aria-label="Close sidebar"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
            />
          )}

          <Sidebar
            onOpenChange={setOpen}
            open={open}
            defaultOpen={false}
            role={profile?.data?.role as Role}
          />
          <main className=" overflow-y-auto">
            <div className="w-screen px-4 md:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
