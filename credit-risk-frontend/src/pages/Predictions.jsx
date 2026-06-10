import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import LoanForm from "../components/LoanForm";
import PredictionCard from "../components/PredictionCard";
import HistoryTable from "../components/HistoryTable";

import {
  getHistory,
  predictLoan
} from "../services/api";

export default function Predictions() {

  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 AUTH GUARD + INITIAL LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadHistory();
  }, []);

  // 🔥 LOAD HISTORY
  async function loadHistory() {
    try {
      const data = await getHistory();

      if (Array.isArray(data)) {
        setHistory([...data].reverse());
      } else {
        setHistory([]);
      }

    } catch (error) {
      console.error("History error:", error);
      setHistory([]);
    }
  }

  // 🔥 HANDLE PREDICTION
  async function handlePrediction(formData) {
    setLoading(true);

    try {
      const result = await predictLoan(formData);

      setPrediction(result);

      await loadHistory();

    } catch (error) {
      console.error("Prediction error:", error);
      alert(error.response?.data?.detail || "Prediction failed");
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