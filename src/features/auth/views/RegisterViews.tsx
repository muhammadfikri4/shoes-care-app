// 📁 src/pages/Login.tsx
import React, { useState } from "react";
import { BsFillPersonFill, BsShieldLock } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";
import Chat from "../../../core/assets/logo/chat.png";
import { Button } from "../../_global/components/Button";
import { Input } from "../../_global/components/Input";
import { Poppins } from "../../_global/components/Text";
import { useLogin } from "../hooks/useAuth";

export const RegisterViews = () => {
  const { mutateAsync, isPending } = useLogin();
  const [email] = useState("");
  const [password] = useState("");
  //   const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutateAsync({ email, password, role: "ADMIN" });
  };
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex md:flex-row flex-col items-center justify-center bg-gray-50">
      <div className="w-[50vw] h-screen flex items-center justify-center flex-col">
        <div className="flex flex-col w-full px-20 gap-10">
          <Poppins className="text-left text-4xl font-bold">Sign Up</Poppins>
          <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <Poppins className="text-sm">Full Name</Poppins>
              <Input
                LeftIcon={<BsFillPersonFill className="text-gray-500" />}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Poppins className="text-sm">Email</Poppins>
              <Input LeftIcon={<HiOutlineMail className="text-gray-500" />} />
            </div>
            <div className="flex flex-col gap-1">
              <Poppins className="text-sm">Password</Poppins>
              <Input
                type={show ? "text" : "password"}
                LeftIcon={<BsShieldLock className="text-gray-500" />}
                RightIcon={
                  <div
                    className="p-2 cursor-pointer"
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? <IoEyeOff /> : <IoEye />}
                  </div>
                }
              />
            </div>
            <Button>{isPending ? "Submitting..." : "Sign Up"}</Button>
            <Poppins className="text-xs">
              Do you have an account?{" "}
              <Link to="/login" className="text-blue-500 underline">
                Login
              </Link>
            </Poppins>
          </form>
        </div>
      </div>
      <div className="w-[50vw] bg-primary h-screen flex items-center justify-center flex-col gap-5">
        <div className="bg-white p-10 w-[50%] rounded-full">
          <img src={Chat} className="" alt="" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Poppins className="text-white text-4xl font-bold">LIVE CHAT</Poppins>
          <p className="w-[60%] text-white text-center">
            With this application, you can communicate with your friends without
            limits and for free.
          </p>
        </div>
      </div>
    </div>
  );
};
