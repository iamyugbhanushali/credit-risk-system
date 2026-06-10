import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const userName = localStorage.getItem("user_name") || "User";
  const userEmail = localStorage.getItem("user_email") || "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Digital Banking Platform
          </h1>
          <p className="text-sm text-gray-500">
            AI Powered Banking & Credit Risk
          </p>
        </div>

        {token && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-wrap gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/accounts"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Accounts
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Transactions
              </NavLink>
              <NavLink
                to="/predictions"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Credit Risk
              </NavLink>
              <NavLink
                to="/transfer"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Transfer
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Profile
              </NavLink>
            </div>

            <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
              <div className="text-right">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
