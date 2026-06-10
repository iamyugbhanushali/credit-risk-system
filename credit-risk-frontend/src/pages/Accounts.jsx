import { useEffect, useState } from "react";
import {
  getAccounts,
  createAccount,
  depositMoney,
  withdrawMoney,
} from "../services/accountApi";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState("Savings");
  const [modal, setModal] = useState({ mode: "", account: null });
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const loadAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Unable to load accounts." });
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await createAccount(accountType);

      if (response?.error) {
        setFeedback({ type: "error", message: response.error });
        return;
      }

      setFeedback({ type: "success", message: "Account created successfully." });
      await loadAccounts();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Failed to create account." });
    }
  };

  const openModal = (mode, account) => {
    setAmount("");
    setDescription("");
    setModal({ mode, account });
    setFeedback({ type: "", message: "" });
  };

  const closeModal = () => {
    setModal({ mode: "", account: null });
    setFeedback({ type: "", message: "" });
  };

  const handleTransaction = async (event) => {
    event.preventDefault();

    if (!modal.account) {
      setFeedback({ type: "error", message: "Select an account first." });
      return;
    }

    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setFeedback({ type: "error", message: "Enter a valid amount." });
      return;
    }

    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        account_id: modal.account.id,
        amount: parsedAmount,
        description,
      };

      const response =
        modal.mode === "deposit"
          ? await depositMoney(payload)
          : await withdrawMoney(payload);

      if (response?.error) {
        setFeedback({ type: "error", message: response.error });
        return;
      }

      setAccounts((current) =>
        current.map((account) =>
          account.id === modal.account.id
            ? { ...account, balance: response.new_balance }
            : account
        )
      );

      setFeedback({
        type: "success",
        message:
          modal.mode === "deposit"
            ? "Deposit successful."
            : "Withdrawal successful.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Transaction failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Accounts</h1>
          <p className="text-gray-600 mt-2">
            Manage savings accounts, deposits, and withdrawals from one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 shadow-sm"
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Business">Business</option>
          </select>

          <button
            onClick={handleCreate}
            className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-900 transition"
          >
            Create Account
          </button>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          No accounts yet. Create your first account to begin.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                    {account.status}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-black">
                    {account.account_number}
                  </h2>
                  <p className="mt-2 text-gray-600">{account.account_type} account</p>
                </div>

                <div className="rounded-3xl bg-gray-100 p-5 text-right">
                  <p className="text-sm uppercase text-gray-500">Balance</p>
                  <p className="mt-2 text-3xl font-bold text-black">₹{account.balance.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => openModal("deposit", account)}
                  className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Deposit
                </button>
                <button
                  onClick={() => openModal("withdraw", account)}
                  className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold capitalize">{modal.mode} funds</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {modal.account?.account_number} • {modal.account?.account_type}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-sm font-medium text-gray-500 transition hover:text-black"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleTransaction} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Optional note"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
                />
              </div>

              {feedback.message && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Processing..." : `Submit ${modal.mode}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
