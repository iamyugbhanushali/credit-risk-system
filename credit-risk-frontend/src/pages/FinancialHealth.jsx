import React, { useState, useEffect } from "react";
import { getFinancialHealthScore } from "../services/financialHealthApi";

export default function FinancialHealth() {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFinancialHealth();
  }, []);

  const fetchFinancialHealth = async () => {
    setLoading(true);
    try {
      const data = await getFinancialHealthScore();
      setScore(data);
    } catch (error) {
      console.error("Error loading financial health score");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Excellent":
        return "from-green-400 to-green-600";
      case "Good":
        return "from-blue-400 to-blue-600";
      case "Fair":
        return "from-yellow-400 to-yellow-600";
      case "Poor":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getCategoryBgColor = (category) => {
    switch (category) {
      case "Excellent":
        return "bg-green-100";
      case "Good":
        return "bg-blue-100";
      case "Fair":
        return "bg-yellow-100";
      case "Poor":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getCategoryTextColor = (category) => {
    switch (category) {
      case "Excellent":
        return "text-green-800";
      case "Good":
        return "text-blue-800";
      case "Fair":
        return "text-yellow-800";
      case "Poor":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Unable to load financial health score</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Financial Health Score
        </h1>

        {/* Main Score Card */}
        <div
          className={`rounded-lg shadow-lg p-12 mb-8 text-center bg-gradient-to-r ${getCategoryColor(
            score.category
          )}`}
        >
          <div className="text-white">
            <h2 className="text-lg font-semibold mb-2">Your Overall Score</h2>
            <div className="text-6xl font-bold mb-4">{score.score}</div>
            <p className="text-xl">{score.category}</p>
          </div>
        </div>

        {/* Component Scores */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-gray-700 font-semibold mb-2">Balance Health</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {score.balance_health}
            </div>
            <p className="text-sm text-gray-600">Based on account balance</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-gray-700 font-semibold mb-2">
              Transaction Health
            </h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {score.transaction_health}
            </div>
            <p className="text-sm text-gray-600">Based on activity</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-gray-700 font-semibold mb-2">Credit Health</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {score.credit_health}
            </div>
            <p className="text-sm text-gray-600">Based on credit profile</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recommendations
          </h2>
          <ul className="space-y-3">
            {score.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Score Breakdown Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How Your Score is Calculated
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>
              <span className="font-semibold">Balance Health (30%):</span> Based
              on your total account balance
            </li>
            <li>
              <span className="font-semibold">Transaction Health (30%):</span>{" "}
              Based on your account activity
            </li>
            <li>
              <span className="font-semibold">Credit Health (40%):</span> Based
              on your credit risk profile
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
