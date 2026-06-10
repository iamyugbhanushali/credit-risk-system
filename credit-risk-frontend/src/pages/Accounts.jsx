import { useEffect, useState } from "react";
import {
  getAccounts,
  createAccount
} from "../services/accountApi";

export default function Accounts() {

  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    const data = await getAccounts();
    setAccounts(data);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreate = async () => {
    await createAccount("Savings");
    loadAccounts();
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        My Accounts
      </h1>

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Account
      </button>

      <div className="mt-6 space-y-4">
        {accounts.map(account => (
          <div
            key={account.id}
            className="border p-4 rounded"
          >
            <h2>
              {account.account_number}
            </h2>

            <p>
              Type:
              {" "}
              {account.account_type}
            </p>

            <p>
              Balance:
              ₹{account.balance}
            </p>

            <p>
              Status:
              {" "}
              {account.status}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}