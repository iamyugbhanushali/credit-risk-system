import { useEffect, useState }
from "react";

import {
  getTransactions
}
from "../services/transactionApi";

export default function Transactions() {

  const [transactions,
  setTransactions] = useState([]);

  useEffect(() => {

    const load = async () => {
      const data =
      await getTransactions();

      setTransactions(data);
    };

    load();

  }, []);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        Transactions
      </h1>

      <table className="w-full border">

        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map(tx => (

            <tr key={tx.id}>
              <td>{tx.type}</td>
              <td>₹{tx.amount}</td>
              <td>{tx.description}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}