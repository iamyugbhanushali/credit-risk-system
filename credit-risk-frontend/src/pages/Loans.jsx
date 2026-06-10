import React, { useState, useEffect } from "react";
import { applyLoan, getLoans } from "../services/loanApi";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    loan_amount: "",
    tenure_months: "",
    annual_income: "",
    existing_loans: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await getLoans();
      setLoans(data);
    } catch (error) {
      setFeedback("Error loading loan applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newLoan = await applyLoan({
        loan_amount: parseFloat(formData.loan_amount),
        tenure_months: parseInt(formData.tenure_months),
        annual_income: parseFloat(formData.annual_income),
        existing_loans: parseInt(formData.existing_loans),
      });

      setFormData({
        loan_amount: "",
        tenure_months: "",
        annual_income: "",
        existing_loans: 0,
      });
      setShowForm(false);
      setFeedback("Loan application submitted successfully");
      await fetchLoans();
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      setFeedback("Error submitting loan application");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Loan Applications</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            {showForm ? "Cancel" : "Apply for Loan"}
          </button>
        </div>

        {feedback && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {feedback}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Apply for Loan</h2>
            <form onSubmit={handleApplyLoan}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={formData.loan_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loan_amount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.tenure_months}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tenure_months: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    value={formData.annual_income}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        annual_income: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Existing Loans
                  </label>
                  <input
                    type="number"
                    value={formData.existing_loans}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        existing_loans: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Applying..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}

        {loading && !showForm ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : loans.length === 0 ? (
          <div className="text-center text-gray-600">
            No loan applications yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedLoan(loan)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        ₹{loan.loan_amount.toLocaleString()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          loan.approval_status
                        )}`}
                      >
                        {loan.approval_status}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Tenure: {loan.tenure_months} months
                    </p>
                    <p className="text-gray-600">
                      Risk: {loan.risk_assessment}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Applied: {new Date(loan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Default Probability
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {(loan.default_probability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedLoan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Amount:</span> ₹
                  {selectedLoan.loan_amount.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Tenure:</span>{" "}
                  {selectedLoan.tenure_months} months
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Annual Income:</span> ₹
                  {selectedLoan.annual_income.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedLoan.approval_status}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Risk Assessment:</span>{" "}
                  {selectedLoan.risk_assessment}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Default Probability:</span>{" "}
                  {(selectedLoan.default_probability * 100).toFixed(1)}%
                </p>
              </div>
              <button
                onClick={() => setSelectedLoan(null)}
                className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
