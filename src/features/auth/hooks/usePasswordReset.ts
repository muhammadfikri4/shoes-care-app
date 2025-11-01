import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authService } from "@core/services/auth";
import { ApiResponse } from "@core/libs/api/types";
import {
  ForgotPasswordCustomerDTO,
  ResetPasswordCustomerDTO,
} from "@core/model/auth";
import { useNavigate } from "react-router-dom";

export const useForgotPasswordCustomer = () => {
  return useMutation({
    mutationKey: ["forgot-password-customer"],
    mutationFn: (body: ForgotPasswordCustomerDTO) =>
      authService.forgotPasswordCustomer({
        email: body.email,
      }),
    onError: (err: ApiResponse) =>
      toast.error(err?.message || "Gagal mengirim email reset password"),
    onSuccess: (res, vars) => {
      toast.success(
        res?.data?.message ||
          "Email reset password telah dikirim. Silakan cek inbox/spam Anda."
      );
      vars?.callback?.(res);
    },
  });
};

export const useResetPasswordCustomer = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["reset-password-customer"],
    mutationFn: (body: ResetPasswordCustomerDTO) =>
      authService.resetPasswordCustomer(body),
    onError: (err: ApiResponse) =>
      toast.error(err?.message || "Gagal mereset password"),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Password berhasil diubah");
      setTimeout(() => {
        navigate("/login?role=CUSTOMER");
      }, 2000);
    },
  });
};
