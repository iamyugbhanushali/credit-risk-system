import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔥 Get user info from localStorage
  const userName =
    localStorage.getItem("user_name") || "User";

  const userEmail =
    localStorage.getItem("user_email") || "";


  // 🔥 Logout function
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    navigate("/login");
  };

  return (

    <nav className="bg-white shadow-sm border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div>

          <h1 className="text-2xl font-bold text-black">
            Credit Risk System
          </h1>

          <p className="text-sm text-gray-500">
            AI Loan Default Prediction
          </p>

        </div>


        {/* RIGHT */}
        {token && (

          <div className="flex items-center gap-4">

            {/* PROFILE */}
            <div className="text-right">

              <p className="font-semibold text-sm">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                {userEmail}
              </p>

            </div>

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">

              {userName.charAt(0).toUpperCase()}

            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </nav>
  );
}