import { useEffect, useState } from "react";

import { getAccounts } from "../services/accountApi";
import { getTransactions } from "../services/transactionApi";
import { getHistory } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    accounts: 0,
    transactions: 0,
    predictions: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentPredictions, setRecentPredictions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const accounts = await getAccounts();
      const transactions = await getTransactions();
      const predictions = await getHistory();

      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

      setStats({
        accounts: accounts.length,
        transactions: transactions.length,
        predictions: predictions.length,
        balance: totalBalance,
      });

      setRecentTransactions(transactions.slice(0, 5));
      setRecentPredictions(predictions.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Banking Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your account activity, transactions, and credit checks.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Balance</p>
            <h2 className="mt-3 text-3xl font-bold">₹{stats.balance.toFixed(2)}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Accounts</p>
            <h2 className="mt-3 text-3xl font-bold">{stats.accounts}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="mt-3 text-3xl font-bold">{stats.transactions}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Predictions</p>
            <h2 className="mt-3 text-3xl font-bold">{stats.predictions}</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <p className="text-sm text-gray-500">Latest banking movements</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-gray-500">No recent transactions available.</p>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-gray-900">{tx.type.replace("_", " ")}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-2 text-2xl font-semibold">₹{tx.amount.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-gray-600">{tx.description || "No description"}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recent Predictions</h2>
                <p className="text-sm text-gray-500">Latest credit risk checks</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentPredictions.length === 0 ? (
                <p className="text-gray-500">No recent credit assessments available.</p>
              ) : (
                recentPredictions.map((prediction) => (
                  <div key={prediction.id} className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-gray-900">Risk: {prediction.risk_category}</p>
                      <p className="text-sm text-gray-500">{new Date(prediction.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-2 text-lg text-gray-700">Probability: {(prediction.default_probability * 100).toFixed(1)}%</p>
                    <p className="mt-1 text-sm text-gray-600">Loan: ₹{prediction.loan_amount} • Rate: {prediction.interest_rate}%</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
