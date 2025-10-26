import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  History,
  LogOut,
  Package,
  QrCode,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { SidebarGroup } from "./SidebarGroup";
import DSC from "@core/assets/logo/DSC.svg";
import { Role } from "../../../../core/model/profile";
import { useNavigate } from "react-router-dom";
import { CONFIG_APP } from "@core/configs/app";

export interface SidebarProps {
  role: Role;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  open,
  onOpenChange,
  defaultOpen = false,
}) => {
  const isAdmin = role === "ADMIN";
  const navigate = useNavigate();

  // === Mode controlled/uncontrolled
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const effectiveOpen = isControlled ? (open as boolean) : internalOpen;

  // helper untuk ubah state dari dalam Sidebar
  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      if (onOpenChange) onOpenChange(v);
    },
    [setInternalOpen, onOpenChange, isControlled]
  );

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Kunci scroll body saat mobile & open
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = effectiveOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [effectiveOpen, isMobile]);

  // Tutup dengan ESC (mobile & desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && effectiveOpen) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [effectiveOpen, setOpen]);

  const menuItems = useMemo(
    () =>
      isAdmin
        ? [
            {
              path: "/admin/transactions",
              label: "Transaksi",
              icon: <ShoppingCart />,
            },
            { path: "/admin/racks", label: "Rak", icon: <Package /> },
            { path: "/check-qr", label: "QR Code Check", icon: <QrCode /> },
          ]
        : [
            {
              path: "/my/transactions",
              label: "Riwayat Transaksi",
              icon: <History />,
            },
            { path: "/check-qr", label: "QR Code Check", icon: <QrCode /> },
          ],
    [isAdmin]
  );

  // === Kelas responsif sesuai requirement:
  // Mobile: open -> w-3/4 & translate-x-0, closed -> w-0 & -translate-x-full (hilang)
  // Desktop: open -> w-64, closed -> w-20 (ikon saja), selalu translate-x-0
  const widthCls = effectiveOpen ? "w-3/4 md:w-64" : "w-0 md:w-20";
  const translateCls = effectiveOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";
  const visibilityCls = effectiveOpen
    ? "opacity-100"
    : "opacity-0 md:opacity-100";
  const pointerCls = effectiveOpen
    ? "pointer-events-auto"
    : "pointer-events-none md:pointer-events-auto";

  return (
    <>
      {/* Floating toggle button (always visible, including on mobile) */}
      <button
        aria-label={effectiveOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setOpen(!effectiveOpen)}
        className="fixed top-3 md:top-4 z-[1001] bg-white border border-slate-200 rounded-lg p-2 shadow hover:bg-slate-50 transition-all duration-300"
        style={{
          left: isMobile
            ? effectiveOpen
              ? "calc(75vw + 8px)"
              : "12px"
            : effectiveOpen
            ? "calc(16rem + 12px)"
            : "calc(5rem + 12px)",
        }}
      >
        {effectiveOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay mobile (dibuat & ditutup di DALAM Sidebar) */}
      {effectiveOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-[998]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        onClick={(e) => e.stopPropagation()}
        className={[
          "bg-white shadow-lg fixed left-0 top-0 bottom-0 z-[999]",
          "transition-all duration-300 will-change-transform",
          "flex flex-col",
          widthCls,
          translateCls,
          visibilityCls,
          pointerCls,
        ].join(" ")}
        role="complementary"
        aria-label="Sidebar"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img src={DSC} className="w-10" />
            {/* brand hanya tampak ketika expanded desktop / mobile open */}
            <span
              className={`font-bold text-lg ${
                effectiveOpen ? "inline" : "hidden md:opacity-0"
              }`}
            >
              Defend Shoes & Care
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <SidebarGroup
              key={index}
              icon={item.icon}
              path={item.path}
              label={item.label}
              open={effectiveOpen}
              onSelect={() => {
                if (isMobile) setOpen(false);
              }}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            className={[
              "w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition",
              !effectiveOpen ? "justify-center md:justify-start" : "",
            ].join(" ")}
            onClick={() => {
              localStorage.removeItem(CONFIG_APP.TOKEN_KEY);
              localStorage.removeItem(CONFIG_APP.REFRESH_TOKEN_KEY);
              navigate(isAdmin ? "/login" : "/login-customer", {
                replace: true,
              });
            }}
          >
            <LogOut size={20} />
            {effectiveOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
