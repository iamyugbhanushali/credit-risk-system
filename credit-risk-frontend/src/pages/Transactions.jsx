import { useEffect, useMemo, useState } from "react";
import { getTransactions } from "../services/transactionApi";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error(error);
        setFeedback("Unable to load transactions.");
      }
    };

    load();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const query = search.toLowerCase();
        const matchesSearch =
          tx.description?.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query) ||
          tx.created_at.toLowerCase().includes(query);

        const matchesType = filterType === "ALL" || tx.type === filterType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, search, filterType, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-600 mt-2">Search, filter, and sort your transaction history.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transactions"
            className="min-w-[240px] rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:outline-none"
          />

          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
            className="rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
            <option value="TRANSFER_OUT">Transfer Out</option>
            <option value="TRANSFER_IN">Transfer In</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800">{feedback}</div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 text-left text-sm uppercase tracking-[0.12em] text-gray-500">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No transactions matched your search.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(tx.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{tx.type.replace("_", " ")}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">₹{tx.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.description || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
