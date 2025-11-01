import DSC from "@core/assets/logo/DSC.svg";
import React, { useState } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "../../_global/components/Button";
import { InputLabel } from "../../_global/components/InputLabel";
import { Poppins } from "../../_global/components/Text";
import { useForgotPasswordCustomer } from "../hooks/usePasswordReset";
import { ForgotPasswordCustomerDTO } from "@core/model/auth";

export const ForgotPasswordView: React.FC = () => {
  const [data, setData] = useState<ForgotPasswordCustomerDTO>({
    email: "",
  });
  const forgotMutation = useForgotPasswordCustomer();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotMutation.mutateAsync({
      email: data.email,
      callback: () => setData({ email: "" }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 grid-cols-1 gap-8">
        {/* Left: Brand Info */}
        <div className="hidden md:flex flex-col justify-center rounded-2xl p-10 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-red-500 via-orange-500 to-yellow-500 text-white shadow-xl">
          <h2 className="text-2xl font-semibold">Lupa Password?</h2>
          <p className="text-white/90 mt-2 text-sm">
            Jangan khawatir! Kami akan mengirimkan link reset password ke email
            Anda.
          </p>
          <ul className="mt-4 text-sm space-y-1 text-white/85 list-disc list-inside">
            <li>Link akan dikirim ke email terdaftar</li>
            <li>Link berlaku 1 jam</li>
            <li>Cek folder spam jika tidak muncul di inbox</li>
          </ul>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <img src={DSC} width={80} height={80} className="bg-cover" />
          </div>

          <div className="mb-6">
            <Poppins className="text-xl font-semibold">Lupa Password</Poppins>
            <p className="text-slate-500 text-sm mt-1">
              Masukkan email yang terdaftar dan kami akan mengirimkan link untuk
              mereset password Anda.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <InputLabel
                title="Email"
                direction="column"
                titleSize="sm"
                inputProps={{
                  LeftIcon: <MdOutlineAlternateEmail />,
                  type: "email",
                  placeholder: "nama@example.com",
                  value: data.email,
                  onChange: (e) =>
                    setData((prev) => ({ ...prev, email: e.target.value })),
                  required: true,
                }}
              />
            </div>

            <div>
              <Button
                variant={
                  forgotMutation.isPending || !data.email
                    ? "disabled"
                    : "primary"
                }
              >
                {forgotMutation.isPending
                  ? "Mengirim..."
                  : "Kirim Link Reset Password"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-600 text-center">
            Ingat password Anda?{" "}
            <Link
              to="/login?role=CUSTOMER"
              className="text-blue-600 hover:underline font-medium"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
