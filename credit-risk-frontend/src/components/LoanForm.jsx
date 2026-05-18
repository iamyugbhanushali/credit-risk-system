import { useState } from "react";


export default function LoanForm({
  onSubmit,
  loading
}) {

  const [formData, setFormData] = useState({

    loan_amnt: "",
    term: 36,
    int_rate: "",
    installment: "",
    annual_inc: "",
    dti: "",
    delinq_2yrs: 0,
    inq_last_6mths: 0,
    open_acc: "",
    pub_rec: 0,
    revol_util: "",
    total_acc: "",
    bc_util: "",

    home_ownership: "RENT",

    purpose: "debt_consolidation",

    application_type: "Individual"
  });


  function handleChange(e) {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }


  async function handleSubmit(e) {

    e.preventDefault();

    await onSubmit({

      ...formData,

      loan_amnt: Number(formData.loan_amnt),
      term: Number(formData.term),
      int_rate: Number(formData.int_rate),
      installment: Number(formData.installment),
      annual_inc: Number(formData.annual_inc),
      dti: Number(formData.dti),
      delinq_2yrs: Number(formData.delinq_2yrs),
      inq_last_6mths: Number(formData.inq_last_6mths),
      open_acc: Number(formData.open_acc),
      pub_rec: Number(formData.pub_rec),
      revol_util: Number(formData.revol_util),
      total_acc: Number(formData.total_acc),
      bc_util: Number(formData.bc_util)
    });
  }


  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h1 className="text-3xl font-bold mb-6">
        AI Credit Risk System
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="number"
          name="loan_amnt"
          placeholder="Loan Amount"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <input
          type="number"
          name="annual_inc"
          placeholder="Annual Income"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <input
          type="number"
          step="0.01"
          name="int_rate"
          placeholder="Interest Rate"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <input
          type="number"
          step="0.01"
          name="installment"
          placeholder="Installment"
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-2xl"
        >
          {loading
            ? "Predicting..."
            : "Analyze Credit Risk"}
        </button>

      </form>

    </div>
  );
}