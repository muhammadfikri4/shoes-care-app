import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authService } from "@core/services/auth";
import { ApiResponse } from "@core/libs/api/types";
import {
  CustomerRegisterDTO,
  CustomerRegisterVerifyDTO,
} from "@core/model/auth";
import { useNavigate } from "react-router-dom";
import { CONFIG_APP } from "@core/configs/app";

export const useCustomerRegisterStart = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["customer-register-start"],
    mutationFn: (body: CustomerRegisterDTO) =>
      authService.customerRegisterStart(body),
    onError: (err: ApiResponse) => toast.error(err?.message || "Registrasi gagal"),
    onSuccess: () => {
      toast.success("Registrasi berhasil. Silakan login");
      navigate(`/login?role=CUSTOMER`);
    },
  });
};

export const useCustomerRegisterVerify = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["customer-register-verify"],
    mutationFn: (body: CustomerRegisterVerifyDTO) =>
      authService.customerRegisterVerify(body),
    onError: (err: ApiResponse) =>
      toast.error(err?.message || "Verifikasi OTP gagal"),
    onSuccess: (res) => {
      toast.success(res?.message || "Akun berhasil diaktifkan");
      localStorage.removeItem(CONFIG_APP.TOKEN_KEY);
      navigate("/login?role=CUSTOMER");
    },
  });
};
