// 📁 src/pages/Login.tsx
import React, { useMemo, useState } from "react";
import { BsShieldLock } from "react-icons/bs";
import { HiOutlineMail, HiUserCircle } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { TbShoe } from "react-icons/tb";
import { Link, useSearchParams } from "react-router-dom";
import DSC from "../../../core/assets/logo/DSC.svg";
import { AuthLoginDTO } from "../../../core/model/auth";
import { Button } from "../../_global/components/Button";
import { Input } from "../../_global/components/Input";
import { Poppins } from "../../_global/components/Text";
import { useLogin } from "../hooks/useAuth";
import { convertQueryParamsToObject } from "../../_global/helper";

type Role = "CUSTOMER" | "ADMIN";

const defaultValue: AuthLoginDTO = {
  email: "",
  password: "",
};

export const LoginViews = () => {
  const { mutateAsync, isPending } = useLogin();

  const [data, setData] = useState<AuthLoginDTO>(defaultValue);
  const [searchParams, setSearchParams] = useSearchParams();
  const role = (searchParams.get("role") as Role) || "ADMIN";
  const queries = convertQueryParamsToObject(searchParams.toString());
  const setRole = (role: Role) => setSearchParams({ ...queries, role });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>("");

  const isValid = useMemo(() => {
    const okEmail = !!data.email && /\S+@\S+\.\S+/.test(data.email);
    const okPass = !!data.password && data.password.length >= 6;
    return okEmail && okPass;
  }, [data]);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    await mutateAsync({ ...data, role });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 grid-cols-1 gap-8">
        {/* Left: Brand + Visual */}
        <div className="relative hidden md:flex flex-col justify-between rounded-2xl p-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-blue-500 to-indigo-500 text-white shadow-xl overflow-hidden">
          {/* Bubbles */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute top-24 -left-8 h-40 w-40 rounded-full bg-white/10 blur-xl" />
          <div className="pointer-events-none absolute bottom-16 right-8 h-24 w-24 rounded-full bg-white/10 blur-lg" />

          <div>
            <Poppins className="text-3xl font-bold">
              Defend Shoes and Care
            </Poppins>
            <p className="mt-2 text-white/90">
              Kelola transaksi cuci sepatu dengan cepat, aman, dan teratur.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur p-8 rounded-2xl border border-white/20 shadow-2xl">
              <img
                src={DSC}
                className="h-28 w-28 object-contain"
                alt="ShoesCare"
              />
            </div>
          </div>

          <div className="text-sm text-white/85">
            Tips: Gunakan email customer agar QR pengambilan terkirim otomatis.
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="mb-6">
            <Poppins className="text-2xl font-semibold">Masuk</Poppins>
            <p className="text-slate-500 text-sm mt-1">
              Akses dashboard untuk kelola rak & transaksi, atau lacak sebagai
              pelanggan.
            </p>
          </div>

          {/* Role Segmented Control */}
          <div className="mb-6">
            <Poppins className="text-sm mb-2">Login sebagai</Poppins>
            <div
              role="tablist"
              aria-label="Login Role"
              className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl"
            >
              <button
                type="button"
                role="tab"
                aria-selected={role === "ADMIN"}
                onClick={() => setRole("ADMIN")}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition
                ${
                  role === "ADMIN"
                    ? "bg-white shadow border border-slate-200"
                    : "bg-transparent hover:bg-white/60"
                }
              `}
              >
                <MdAdminPanelSettings className="text-slate-700" />
                <span className="text-sm font-medium text-slate-700">
                  Admin
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={role === "CUSTOMER"}
                onClick={() => setRole("CUSTOMER")}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition
                ${
                  role === "CUSTOMER"
                    ? "bg-white shadow border border-slate-200"
                    : "bg-transparent hover:bg-white/60"
                }
              `}
              >
                <TbShoe className="text-slate-700" />
                <span className="text-sm font-medium text-slate-700">
                  Pelanggan
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Admin untuk input transaksi & manajemen rak. Pelanggan untuk lacak
              & pengambilan.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin} noValidate>
            <div className="flex flex-col gap-1">
              <Poppins className="text-sm">Email</Poppins>
              <Input
                type="email"
                placeholder="nama@contoh.com"
                autoComplete="email"
                LeftIcon={<HiOutlineMail className="text-gray-500" />}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Poppins className="text-sm">Password</Poppins>
              <Input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                LeftIcon={<BsShieldLock className="text-gray-500" />}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                RightIcon={
                  <button
                    type="button"
                    aria-label={
                      show ? "Sembunyikan password" : "Tampilkan password"
                    }
                    className="p-2 cursor-pointer"
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? <IoEyeOff /> : <IoEye />}
                  </button>
                }
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
                {error}
              </div>
            )}

            <Button
              variant={isPending || !isValid ? "disabled" : "primary"}
              disabled={isPending || !isValid}
            >
              {isPending ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {role === "CUSTOMER" && (
            <div className="mt-6 text-sm text-slate-600">
              Sudah pernah melakukan transaksi namun belum memiliki akun?{" "}
              <Link
                to="/register-customer"
                className="text-blue-600 hover:underline"
              >
                Register
              </Link>
            </div>
          )}

          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
            <HiUserCircle />
            Pastikan email benar, agar notifikasi & QR pengambilan terkirim.
          </div>
        </div>
      </div>
    </div>
  );
};
