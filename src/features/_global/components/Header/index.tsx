import { ProfileDTO } from "../../../../core/model/profile";

interface HeaderProps {
  user: ProfileDTO;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-end px-8 py-4">
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isAdmin
                ? "bg-blue-100 text-primary border border-solid border-primary"
                : "bg-green-100 text-green-700 border border-solid border-green-700"
            }`}
          >
            <span className="text-xs font-medium">
              {isAdmin ? "Admin" : "Pelanggan"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
