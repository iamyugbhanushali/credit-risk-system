import { useEffect, useState } from "react";
import { getAccounts } from "../services/accountApi";
import { executeTransfer, getTransfers } from "../services/transferApi";

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountNumber, setDestinationAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [accountsData, transfersData] = await Promise.all([
        getAccounts(),
        getTransfers(),
      ]);

      setAccounts(accountsData);
      setTransfers(transfersData);
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Unable to load transfer data." });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "", message: "" });
    const parsedAmount = Number(amount);

    if (!sourceAccountId) {
      setFeedback({ type: "error", message: "Choose a source account." });
      return;
    }

    if (!destinationAccountNumber) {
      setFeedback({ type: "error", message: "Enter a destination account number." });
      return;
    }

    if (!parsedAmount || parsedAmount <= 0) {
      setFeedback({ type: "error", message: "Enter a valid transfer amount." });
      return;
    }

    setLoading(true);

    try {
      const response = await executeTransfer({
        source_account_id: Number(sourceAccountId),
        destination_account_number: destinationAccountNumber,
        amount: parsedAmount,
        description,
      });

      if (response?.error) {
        setFeedback({ type: "error", message: response.error });
      } else {
        setFeedback({ type: "success", message: response.message || "Transfer completed." });
        setAmount("");
        setDescription("");
        setDestinationAccountNumber("");
        await loadData();
      }
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Transfer failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Money Transfer</h1>
        <p className="text-gray-600 mt-2">Send funds between accounts and review recent transfer activity.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Transfer Funds</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Source Account</label>
              <select
                value={sourceAccountId}
                onChange={(event) => setSourceAccountId(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
              >
                <option value="">Select source account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_number} • ₹{account.balance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Destination Account Number</label>
              <input
                value={destinationAccountNumber}
                onChange={(event) => setDestinationAccountNumber(event.target.value)}
                placeholder="ACC123456"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
              />
            </div>

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
                placeholder="Optional memo"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
              />
            </div>

            {feedback.message && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Transfer"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
          {transfers.length === 0 ? (
            <p className="text-gray-500">No transfers have been made yet.</p>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <div key={transfer.id} className="rounded-3xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900">{transfer.direction}</p>
                    <p className="text-sm text-gray-500">{new Date(transfer.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-black">₹{transfer.amount.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-gray-600">Counterparty: {transfer.counterparty}</p>
                  <p className="mt-1 text-sm text-gray-600">{transfer.description || "No description"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
