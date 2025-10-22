import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "../../features/_global/components/NotFound";

import { LoginViews } from "../../features/auth/views/LoginViews";
import { RegisterViews } from "../../features/auth/views/RegisterViews";
import { ProfileViews } from "../../features/profile/views/ProfileViews";
import { FriendsViews } from "../../features/friends/views/FriendsViews";
import { RacksManagement } from "../../features/transactions/views/RacksManagement";
import { TransactionsAdmin } from "../../features/transactions/views/TransactionsAdmin";
import { TransactionCreate } from "../../features/transactions/views/TransactionCreate";
import { TransactionsCustomer } from "../../features/transactions/views/TransactionsCustomer";
import { CheckQR } from "../../features/transactions/views/CheckQR";
import { TransactionDetail } from "../../features/transactions/views/TransactionDetail";
import { CustomerOtpLogin } from "../../features/auth/views/CustomerOtpLogin";
import { RootLayout } from "../../features/_global/views/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/profile",
        element: <ProfileViews />,
      },
      {
        path: "/friends",
        element: <FriendsViews />,
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
        path: "/admin/transactions/:invoice",
        element: <TransactionDetail />,
      },
      {
        path: "/my/transactions",
        element: <TransactionsCustomer />,
      },
      {
        path: "/my/transactions/:invoice",
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
    element: <CustomerOtpLogin />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
