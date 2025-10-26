import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "../../features/_global/components/NotFound";

import { RootLayout } from "../../features/_global/views/Root";
import { LoginViews } from "../../features/auth/views/LoginViews";
import { RegisterViews } from "../../features/auth/views/RegisterViews";
import { CustomerRegister } from "../../features/auth/views/CustomerRegister";
import { CustomerRegisterVerify } from "../../features/auth/views/CustomerRegisterVerify";
import { ProfileViews } from "../../features/profile/views/ProfileViews";
import { CheckQR } from "../../features/qr-scanner/views/CheckQR";
import { RacksManagement } from "../../features/rack/views/Rack";
import { TransactionCreate } from "../../features/transactions/views/TransactionCreate";
import { TransactionDetail } from "../../features/transactions/views/TransactionDetail";
import { TransactionsAdmin } from "../../features/transactions/views/TransactionsAdmin";
import { TransactionsCustomer } from "../../features/transactions/views/TransactionsCustomer";
import { Protected } from "../../features/_global/views/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Protected />,
      },
      {
        path: "/profile",
        element: <ProfileViews />,
      },
      {
        path: "/admin/racks",
        element: <RacksManagement />,
      },
      {
        path: "/admin/transactions",
        element: <TransactionsAdmin />,
      },
      {
        path: "/admin/transactions/create",
        element: <TransactionCreate />,
      },
      {
        path: "/admin/transactions/:transactionId",
        element: <TransactionDetail />,
      },
      {
        path: "/my/transactions",
        element: <TransactionsCustomer />,
      },
      {
        path: "/my/transactions/:transactionId",
        element: <TransactionDetail />,
      },
      {
        path: "/check-qr",
        element: <CheckQR />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginViews />,
  },
  {
    path: "/register",
    element: <RegisterViews />,
  },
  {
    path: "/login-customer",
    element: <LoginViews />,
  },
  {
    path: "/register-customer",
    element: <CustomerRegister />,
  },
  {
    path: "/register-customer/verify",
    element: <CustomerRegisterVerify />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
