import DSC from "@core/assets/logo/DSC.svg";
import React, { useState } from "react";
import { BsPerson, BsShieldLock } from "react-icons/bs";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Button } from "../../_global/components/Button";
import { InputLabel } from "../../_global/components/InputLabel";
import { useCustomerRegisterStart } from "../hooks/useCustomerRegister";
import { AuthRegisterDTO } from "../../../core/model/auth";

export const CustomerRegister: React.FC = () => {
  const [data, setData] = useState<Omit<AuthRegisterDTO, "confirmPassword">>({
    email: "",
    name: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const startMutation = useCustomerRegisterStart();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startMutation.mutate(data);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl p-8 border border-slate-100 shadow-xl">
        <div className="flex items-center justify-center">
          <img src={DSC} width={100} height={100} className="bg-cover" />
        </div>
        <h1 className="text-xl font-semibold mb-4">Register Customer</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <InputLabel
              title="Nama"
              direction="column"
              titleSize="sm"
              inputProps={{
                LeftIcon: <BsPerson />,
                value: data.name,
                onChange: (e) =>
                  setData((prev) => ({ ...prev, name: e.target.value })),
                required: true,
              }}
            />
          </div>
          <div>
            <InputLabel
              title="Email"
              direction="column"
              titleSize="sm"
              inputProps={{
                LeftIcon: <MdOutlineAlternateEmail />,
                type: "email",
                value: data.email,
                onChange: (e) =>
                  setData((prev) => ({ ...prev, email: e.target.value })),
                required: true,
              }}
            />
          </div>
          <div>
            <InputLabel
              title="Password"
              titleSize="sm"
              direction="column"
              inputProps={{
                type: show ? "text" : "password",
                placeholder: "••••••••",
                autoComplete: "new-password",
                LeftIcon: <BsShieldLock className="text-gray-500" />,
                onChange: (e) =>
                  setData((prev) => ({ ...prev, password: e.target.value })),
                RightIcon: (
                  <div
                    className="p-2 cursor-pointer"
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? <IoEyeOff /> : <IoEye />}
                  </div>
                ),
                required: true,
              }}
            />
          </div>
          <div>
            <Button variant={startMutation.isPending ? "disabled" : "primary"}>
              {startMutation.isPending ? "Memproses..." : "Kirim OTP"}
            </Button>
          </div>
        </form>
        <div className="mt-6 text-sm text-slate-600">
          Sudah punya akun?{" "}
          <a
            href="/login?role=CUSTOMER"
            className="text-blue-600 hover:underline"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};
