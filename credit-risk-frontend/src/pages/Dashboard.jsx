import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import LoanForm from "../components/LoanForm";
import PredictionCard from "../components/PredictionCard";
import HistoryTable from "../components/HistoryTable";

import {
  getHistory,
  predictLoan
} from "../services/api";


export default function Dashboard() {

  const [prediction, setPrediction] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);


  async function loadHistory() {

    try {

      const data = await getHistory();

      setHistory(data.reverse());

    } catch (error) {

      console.error(error);
    }
  }


  useEffect(() => {

    loadHistory();

  }, []);


  async function handlePrediction(formData) {

    setLoading(true);

    try {

      const result = await predictLoan(formData);

      setPrediction(result);

      loadHistory();

    } catch (error) {

      console.error(error);
    }

    setLoading(false);
  }


  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <LoanForm
          onSubmit={handlePrediction}
          loading={loading}
        />

        <div className="space-y-6">

          <PredictionCard
            prediction={prediction}
          />

          <HistoryTable
            history={history}
          />

        </div>

      </div>

    </div>
  );
}