import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import { getAccounts } from "../services/accountApi";
import { getTransactions } from "../services/transactionApi";
import { getHistory } from "../services/api";

export default function Dashboard() {

  const [stats, setStats] = useState({
    accounts: 0,
    transactions: 0,
    predictions: 0,
    balance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const accounts =
        await getAccounts();

      const transactions =
        await getTransactions();

      const predictions =
        await getHistory();

      const totalBalance =
        accounts.reduce(
          (sum, acc) =>
            sum + acc.balance,
          0
        );

      setStats({
        accounts: accounts.length,
        transactions:
          transactions.length,
        predictions:
          predictions.length,
        balance:
          totalBalance
      });

    } catch(error) {
      console.error(error);
    }

  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Banking Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <p>Total Accounts</p>
            <h2 className="text-3xl font-bold">
              {stats.accounts}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p>Total Balance</p>
            <h2 className="text-3xl font-bold">
              ₹{stats.balance}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p>Transactions</p>
            <h2 className="text-3xl font-bold">
              {stats.transactions}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p>Credit Checks</p>
            <h2 className="text-3xl font-bold">
              {stats.predictions}
            </h2>
          </div>

        </div>

      </div>

    </div>
  );
}
