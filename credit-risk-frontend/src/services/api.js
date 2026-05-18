const API_BASE = "http://127.0.0.1:8000";


export async function predictLoan(data) {

  const response = await fetch(
    `${API_BASE}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  return response.json();
}


export async function getHistory() {

  const response = await fetch(
    `${API_BASE}/history`
  );

  return response.json();
}