import { useAtom } from "jotai";
import { Navigate, Outlet } from "react-router-dom";
import { ProfileDTO, Role } from "../../../core/model/profile";
import { useProfile } from "../../profile/hooks/useProfile";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SidebarAtom } from "../store";

export const RootLayout = () => {
  const { data: profile, isFetching } = useProfile();
  const [open, setOpen] = useAtom(SidebarAtom); // kontrol sidebar (mobile)

  if (!isFetching && !profile?.data?.id) {
    return <Navigate to="/login" />;
  }

  // Optional: tampilkan loading tipis saat fetching profile
  if (isFetching && !profile?.data?.id) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-600">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header sticky, biar selalu di atas */}
      <Header
        user={
          profile?.data as ProfileDTO
        } /* tambahkan tombol menu di Header untuk setOpen(true) kalau perlu */
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ===== Sidebar (Mobile: off-canvas overlay, Desktop: static) ===== */}
        {/* Backdrop untuk mobile */}
        {open && (
          <button
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
          />
        )}

        <Sidebar
          onOpenChange={setOpen}
          // Mobile: pakai state "open"; Desktop: Sidebar tetap bisa kontrol internalnya sendiri
          open={open}
          defaultOpen={false}
          role={profile?.data?.role as Role}
        />

        {/* ===== Main Content ===== */}
        <main className=" overflow-y-auto">
          {/* Container konten: center + max-width supaya rapi di desktop */}
          <div className="w-screen px-4 md:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
