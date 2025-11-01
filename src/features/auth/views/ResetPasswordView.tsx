import DSC from "@core/assets/logo/DSC.svg";
import React, { useEffect, useMemo, useState } from "react";
import { BsShieldLock } from "react-icons/bs";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../_global/components/Button";
import { InputLabel } from "../../_global/components/InputLabel";
import { Poppins } from "../../_global/components/Text";
import { useResetPasswordCustomer } from "../hooks/usePasswordReset";

export const ResetPasswordView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("reset_token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetMutation = useResetPasswordCustomer();

  useEffect(() => {
    if (!resetToken) {
      toast.error("Token reset password tidak valid atau sudah kadaluarsa");
    }
  }, [resetToken]);

  const isValid = useMemo(() => {
    const okPassword = password.length >= 6;
    const okMatch = password === confirmPassword;
    return okPassword && okMatch;
  }, [password, confirmPassword]);

  const passwordStrength = useMemo(() => {
    if (password.length === 0) return null;
    if (password.length < 6) return "Minimal 6 karakter";
    return "Password valid";
  }, [password]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      toast.error("Token reset password tidak valid");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    resetMutation.mutate({
      resetPasswordToken: resetToken,
      password: password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 grid-cols-1 gap-8">
        {/* Left: Brand Info */}
        <div className="hidden md:flex flex-col justify-center rounded-2xl p-10 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl">
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <p className="text-white/90 mt-2 text-sm">
            Buat password baru untuk akun Anda. Pastikan password yang Anda
            buat mudah diingat namun tetap aman.
          </p>
          <ul className="mt-4 text-sm space-y-1 text-white/85 list-disc list-inside">
            <li>Minimal 6 karakter</li>
            <li>Password dan konfirmasi harus sama</li>
            <li>Gunakan kombinasi huruf dan angka</li>
          </ul>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <img src={DSC} width={80} height={80} className="bg-cover" />
          </div>

          <div className="mb-6">
            <Poppins className="text-xl font-semibold">Reset Password</Poppins>
            <p className="text-slate-500 text-sm mt-1">
              Masukkan password baru Anda. Password harus minimal 6 karakter.
            </p>
          </div>

          {!resetToken ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              Token reset password tidak valid atau sudah kadaluarsa. Silakan
              request ulang reset password.
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <InputLabel
                  title="Password Baru"
                  titleSize="sm"
                  direction="column"
                  inputProps={{
                    type: showPassword ? "text" : "password",
                    placeholder: "••••••••",
                    autoComplete: "new-password",
                    value: password,
                    LeftIcon: <BsShieldLock className="text-gray-500" />,
                    onChange: (e) => setPassword(e.target.value),
                    RightIcon: (
                      <div
                        className="p-2 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <IoEyeOff /> : <IoEye />}
                      </div>
                    ),
                    required: true,
                  }}
                />
                {passwordStrength && (
                  <p
                    className={`text-xs mt-1 ${
                      password.length >= 6 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {passwordStrength}
                  </p>
                )}
              </div>

              <div>
                <InputLabel
                  title="Konfirmasi Password"
                  titleSize="sm"
                  direction="column"
                  inputProps={{
                    type: showConfirm ? "text" : "password",
                    placeholder: "••••••••",
                    autoComplete: "new-password",
                    value: confirmPassword,
                    LeftIcon: <BsShieldLock className="text-gray-500" />,
                    onChange: (e) => setConfirmPassword(e.target.value),
                    RightIcon: (
                      <div
                        className="p-2 cursor-pointer"
                        onClick={() => setShowConfirm((prev) => !prev)}
                      >
                        {showConfirm ? <IoEyeOff /> : <IoEye />}
                      </div>
                    ),
                    required: true,
                  }}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    Password tidak sama
                  </p>
                )}
              </div>

              <div>
                <Button
                  variant={
                    resetMutation.isPending || !isValid ? "disabled" : "primary"
                  }
                  disabled={resetMutation.isPending || !isValid}
                >
                  {resetMutation.isPending
                    ? "Memproses..."
                    : "Reset Password"}
                </Button>
              </div>
            </form>
          )}

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
