// import React, { useState } from "react";
// import { otpAuthService } from "@core/services/pos";
// import { CONFIG_APP } from "@core/configs/app";
// import { storage } from "@features/_global/helper/storage";

// export const CustomerOtpLogin: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [otp, setOtp] = useState("");
//   const [sent, setSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   const requestOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     try {
//       await otpAuthService.request({ email, name });
//       setSent(true);
//       setMessage("OTP terkirim. Cek email kamu.");
//     } catch (err) {
//       const error = err as Error;
//       setMessage(error?.message || "Gagal mengirim OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     try {
//       const res = await otpAuthService.verify({ email, otp });
//       const token = res?.data?.accessToken;
//       if (token) {
//         storage.set(CONFIG_APP.TOKEN_KEY, token);
//         const sp = new URLSearchParams(window.location.search);
//         const returnUrl = sp.get("returnUrl");
//         window.location.href = returnUrl || "/my/transactions";
//       } else {
//         setMessage("Token tidak ditemukan");
//       }
//     } catch (err) {
//       const error = err as Error;
//       setMessage(error?.message || "OTP tidak valid");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
//       <div className="w-full max-w-xl grid md:grid-cols-2 grid-cols-1 gap-6">
//         <div className="hidden md:flex flex-col justify-center rounded-2xl p-8 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl">
//           <h2 className="text-2xl font-semibold">Login Customer</h2>
//           <p className="text-white/90 mt-2 text-sm">
//             Gunakan email untuk menerima OTP. Simpel dan aman.
//           </p>
//           <ul className="mt-4 text-sm space-y-1 text-white/85 list-disc list-inside">
//             <li>Riwayat transaksi dapat dilihat kapan saja</li>
//             <li>QR pengambilan dikirim ke email</li>
//           </ul>
//         </div>
//         <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl">
//           <h1 className="text-xl font-semibold mb-4">
//             {sent ? "Masukkan Kode OTP" : "Dapatkan Kode OTP"}
//           </h1>
//           {!sent ? (
//             <form onSubmit={requestOtp} className="space-y-4">
//               <div>
//                 <label className="text-sm">Email</label>
//                 <input
//                   className="w-full border rounded p-2"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="text-sm">Nama (opsional)</label>
//                 <input
//                   className="w-full border rounded p-2"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>
//               <button
//                 disabled={loading}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white rounded py-2"
//               >
//                 {loading ? "Mengirim..." : "Kirim OTP"}
//               </button>
//             </form>
//           ) : (
//             <form onSubmit={verifyOtp} className="space-y-4">
//               <div>
//                 <label className="text-sm">Kode OTP</label>
//                 <input
//                   className="w-full border rounded p-2 tracking-widest"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="6 digit"
//                   required
//                 />
//               </div>
//               <button
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded py-2"
//               >
//                 {loading ? "Memverifikasi..." : "Verifikasi & Masuk"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSent(false)}
//                 className="w-full text-blue-600 underline text-sm"
//               >
//                 Kirim ulang ke email lain
//               </button>
//             </form>
//           )}
//           {message && <p className="text-sm text-gray-600 mt-4">{message}</p>}
//           <div className="mt-6 text-sm text-slate-600">
//             Admin?{" "}
//             <a href="/login" className="text-blue-600 hover:underline">
//               Masuk di sini
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
