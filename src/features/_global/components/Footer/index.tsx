import HIMTI from "@core/assets/logo/HIMTI.png";
import { Menus } from "../../config";
import { Link, useLocation } from "react-router-dom";
import { Poppins } from "../Text";

export const Footer = () => {
  const location = useLocation();
  return (
    <footer className="bg-gradient-to-r from-[rgba(76,118,163,0.8)] to-[rgba(32,61,93,0.8)] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bagian Logo & Deskripsi */}
          <div className="flex flex-col items-start">
            <img src={HIMTI} className="w-24 mb-4" alt="HIMTI Logo" />
            <p className="text-sm opacity-80">
              HIMTI adalah himpunan mahasiswa yang berfokus pada pengembangan
              teknologi dan komunitas IT.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm opacity-90">
              {Menus.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={`hover:text-gray-300 transition`}
                  >
                    <Poppins
                      className={`duration-300 ${
                        location.pathname === item.to
                          ? "font-medium text-md"
                          : "text-sm"
                      }`}
                    >
                      {item.name}
                    </Poppins>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <Link to={"#"} className="hover:text-gray-300 transition">
                Facebook
              </Link>
              <Link to={"#"} className="hover:text-gray-300 transition">
                Instagram
              </Link>
              <Link to={"#"} className="hover:text-gray-300 transition">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-70">
          © 2025 HIMTI. Semua Hak Dilindungi.
        </div>
      </div>
    </footer>
  );
};
