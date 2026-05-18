export default function PredictionCard({
  prediction
}) {

  if (!prediction) {

    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        No prediction yet.
      </div>
    );
  }

  return (

    <div className="bg-white p-6 rounded-3xl shadow-lg space-y-4">

      <h2 className="text-2xl font-bold">
        Prediction Result
      </h2>

      <div>
        <strong>Default Probability:</strong>{" "}
        {(prediction.default_probability * 100).toFixed(2)}%
      </div>

      <div>
        <strong>Risk Category:</strong>{" "}
        {prediction.risk_category}
      </div>

      <div>
        <strong>Decision:</strong>{" "}
        {prediction.prediction === 1
          ? "Rejected"
          : "Approved"}
      </div>

    </div>
  );
}