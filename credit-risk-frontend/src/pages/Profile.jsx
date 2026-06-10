export default function Profile() {
  const userName = localStorage.getItem("user_name") || "User";
  const userEmail = localStorage.getItem("user_email") || "";
  const userRole = localStorage.getItem("role") || "Customer";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Account Information</h2>
          <p className="text-gray-600 mt-2">Name: {userName}</p>
          <p className="text-gray-600">Email: {userEmail}</p>
          <p className="text-gray-600">Role: {userRole}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="text-gray-600 mt-2">
            Use the navigation links to manage your accounts, view transactions, and review credit risk checks.
          </p>
        </div>
      </div>
    </div>
  );
}
