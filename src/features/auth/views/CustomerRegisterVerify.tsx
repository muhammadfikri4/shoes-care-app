import DSC from "@core/assets/logo/DSC.svg";
import { CONFIG_APP } from "@core/configs/app";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../_global/components/Button";
import { useCustomerRegisterVerify } from "../hooks/useCustomerRegister";

export const CustomerRegisterVerify: React.FC = () => {
  const [sp] = useSearchParams();

  const email = sp.get("email") || "";
  const bundle = useMemo(() => {
    try {
      const raw = localStorage.getItem(CONFIG_APP.TOKEN_KEY);
      return raw
        ? (JSON.parse(raw) as { key?: string; expiredAt?: string })
        : {};
    } catch {
      return {};
    }
  }, []);
  const key = bundle?.key || "";
  const expiredAt = bundle?.expiredAt || "";
  const [otp, setOtp] = useState("");
  const verifyMutation = useCustomerRegisterVerify();
  const [remaining, setRemaining] = useState<number>(() => {
    if (!expiredAt) return 0;
    const diff = new Date(expiredAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  useEffect(() => {
    if (!expiredAt) return;
    const id = setInterval(() => {
      const diff = new Date(expiredAt).getTime() - Date.now();
      setRemaining(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [expiredAt]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({ key, otp });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl p-8 border border-slate-100 shadow-xl">
        <div className="flex items-center justify-center">
          <img src={DSC} width={100} height={100} className="bg-cover" />
        </div>
        <h1 className="text-xl font-semibold mb-4">Verifikasi OTP</h1>
        {!key ? (
          <div className="text-red-600">
            Key tidak ditemukan. Silakan mulai ulang proses register.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm">Email</label>
              <input
                className="w-full border rounded p-2"
                value={email}
                disabled
              />
            </div>
            {expiredAt && (
              <div className="text-xs text-slate-600">
                OTP berakhir dalam:{" "}
                <b>
                  {Math.floor(remaining / 60)}:
                  {(remaining % 60).toString().padStart(2, "0")}
                </b>
              </div>
            )}
            <div>
              <label className="text-sm">Kode OTP</label>
              <input
                className="w-full border rounded p-2 tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 digit"
                required
              />
            </div>
            <div>
              <Button
                variant={verifyMutation.isPending ? "disabled" : "primary"}
              >
                {verifyMutation.isPending
                  ? "Memverifikasi..."
                  : "Verifikasi & Aktifkan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
