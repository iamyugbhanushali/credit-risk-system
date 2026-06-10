import React, { useState, useEffect } from "react";
import {
  addBeneficiary,
  getBeneficiaries,
  removeBeneficiary,
} from "../services/beneficiaryApi";

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiary_name: "",
    beneficiary_account_number: "",
    bank_name: "",
  });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    setLoading(true);
    try {
      const data = await getBeneficiaries();
      setBeneficiaries(data);
    } catch (error) {
      setFeedback("Error loading beneficiaries");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addBeneficiary(formData);
      setFormData({
        beneficiary_name: "",
        beneficiary_account_number: "",
        bank_name: "",
      });
      setShowForm(false);
      setFeedback("Beneficiary added successfully");
      await fetchBeneficiaries();
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      setFeedback("Error adding beneficiary");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this beneficiary?")) {
      try {
        await removeBeneficiary(id);
        setFeedback("Beneficiary removed successfully");
        await fetchBeneficiaries();
        setTimeout(() => setFeedback(""), 3000);
      } catch (error) {
        setFeedback("Error removing beneficiary");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Beneficiaries</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            {showForm ? "Cancel" : "Add Beneficiary"}
          </button>
        </div>

        {feedback && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {feedback}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Beneficiary</h2>
            <form onSubmit={handleAddBeneficiary}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  value={formData.beneficiary_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiary_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.beneficiary_account_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiary_account_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Bank Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Beneficiary"}
              </button>
            </form>
          </div>
        )}

        {loading && !showForm ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : beneficiaries.length === 0 ? (
          <div className="text-center text-gray-600">
            No beneficiaries added yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {beneficiary.beneficiary_name}
                    </h3>
                    <p className="text-gray-600">
                      Account: {beneficiary.beneficiary_account_number}
                    </p>
                    {beneficiary.bank_name && (
                      <p className="text-gray-600">
                        Bank: {beneficiary.bank_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Added: {new Date(beneficiary.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(beneficiary.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
