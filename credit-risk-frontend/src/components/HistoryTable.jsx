export default function HistoryTable({
  history
}) {

  return (

    <div className="bg-white p-6 rounded-3xl shadow-lg overflow-auto">

      <h2 className="text-2xl font-bold mb-4">
        Prediction History
      </h2>

      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b">

            <th className="p-2 text-left">
              Loan
            </th>

            <th className="p-2 text-left">
              Income
            </th>

            <th className="p-2 text-left">
              Probability
            </th>

            <th className="p-2 text-left">
              Risk
            </th>

          </tr>

        </thead>

        <tbody>

          {history.map((item) => (

            <tr
              key={item.id}
              className="border-b"
            >

              <td className="p-2">
                {item.loan_amount}
              </td>

              <td className="p-2">
                {item.annual_income}
              </td>

              <td className="p-2">
                {(item.default_probability * 100).toFixed(2)}%
              </td>

              <td className="p-2">
                {item.risk_category}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}