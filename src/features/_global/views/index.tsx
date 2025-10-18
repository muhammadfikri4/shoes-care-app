// import { AiOutlineQrcode } from "react-icons/ai";
// import { BiArchive } from "react-icons/bi";
// import { BsReceipt } from "react-icons/bs";
// import { VscSettings } from "react-icons/vsc";
// import { Outlet } from "react-router-dom";
// import { useProfile } from "../../profile/hooks/useProfile";
// import { Sidebar } from "../components/Sidebar";
// import { useSocket } from "../hooks/useSocket";

// export const RootViews = () => {
//   const socket = useSocket();
//   socket?.id;
//   const { data: profile } = useProfile();
//   // const token = storage.get(CONFIG_APP.TOKEN_KEY);
//   // if (!token) {
//   //   return <Navigate to={"/login"} />;
//   // }
//   const role = profile?.data?.role as
//     | "SUPERADMIN"
//     | "ADMIN"
//     | "CUSTOMER"
//     | undefined;

//   const adminMenus = [
//     {
//       icon: <BsReceipt className="text-xl" />,
//       name: "Transactions",
//       to: "/admin/transactions",
//     },
//     {
//       icon: <BiArchive className="text-2xl" />,
//       name: "Rack",
//       to: "/admin/racks",
//     },
//     {
//       icon: <AiOutlineQrcode className="text-2xl" />,
//       name: "Check QR",
//       to: "/check-qr",
//     },
//     {
//       icon: <VscSettings className="text-xl" />,
//       name: "Profile",
//       to: "/profile",
//     },
//   ];
//   const customerMenus = [
//     {
//       icon: <BsReceipt className="text-xl" />,
//       name: "Transactions",
//       to: "/my/transactions",
//     },
//     {
//       icon: <AiOutlineQrcode className="text-2xl" />,
//       name: "Check QR",
//       to: "/check-qr",
//     },
//     {
//       icon: <VscSettings className="text-xl" />,
//       name: "Profile",
//       to: "/profile",
//     },
//   ];

//   return (
//     <>
//       <Sidebar
//         menus={
//           role === "ADMIN" || role === "SUPERADMIN" ? adminMenus : customerMenus
//         }
//         name={profile?.data?.name ?? ""}
//       />
//       <div className="pl-20">
//         <Outlet />
//         {/* <AblyDebugPanel /> */}
//       </div>
//     </>
//   );
// };
