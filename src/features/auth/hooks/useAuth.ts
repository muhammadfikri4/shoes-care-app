// ==============================
// 📁 src/hooks/useAuth.ts (adjusted for custom request)
// ==============================
import { useMutation } from "@tanstack/react-query";
import { request } from "../../../core/libs/api/config";
import { API_ENDPOINT, CONFIG_APP } from "../../../core/configs/app";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ApiResponse } from "../../../core/libs/api/types";
import { authService } from "../../../core/services/auth";
import { CustomerRegisterDTO } from "../../../core/model/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      role: "ADMIN" | "CUSTOMER";
    }) => {
      return await request.post<ApiResponse<{ token: string }>>(
        API_ENDPOINT.auth.login
      )(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (res, variables) => {
      toast.success(res.message);
      localStorage.setItem(CONFIG_APP.TOKEN_KEY, res?.data?.token ?? "");
      const sp = new URLSearchParams(window.location.search);
      const returnUrl = sp.get("returnUrl");
      if (returnUrl) {
        navigate(returnUrl);
        return;
      }
      if (variables.role === "ADMIN") navigate("/admin/transactions");
      else navigate("/my/transactions");
    },
  });
};

export const useRegisterCustomer = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CustomerRegisterDTO) => {
      return authService.customerRegisterStart(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (res) => {
      toast.success(res.message);
      navigate("/login?role=CUSTOMER");
    },
  });
};
